import Stripe from "stripe";
import { getSignedDownloadUrl, objectExists } from "@/lib/r2";
import { generateLicensePDF } from "@/lib/license-pdf";
import { getBeatById, LICENSE_TIERS } from "@/config/beats";

/**
 * POST /api/stripe/webhook
 *
 * Stripe-facing webhook that runs the post-payment delivery pipeline:
 *
 *   1. Verify Stripe's signature against `STRIPE_WEBHOOK_SECRET` on the
 *      raw request body (NOT a parsed JSON body — the bytes have to match
 *      what Stripe signed).
 *   2. On `checkout.session.completed`, mint 24-hour signed download URLs
 *      for the buyer's files in R2.
 *   3. Render a one-page license PDF tailored to the tier they bought.
 *   4. Email everything via Resend (if RESEND_API_KEY is set). If the
 *      Resend key is missing, log the payload and skip — we still return
 *      200 so Stripe doesn't retry forever.
 *   5. Log the order to stdout so Vercel captures it for forensics.
 *
 * Runtime is forced to Node because pdfkit, the AWS SDK, and the Stripe
 * SDK all need Node APIs that Edge doesn't ship.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_URL = "https://api.resend.com/emails";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  // Pin the API version to avoid surprise schema drift in production.
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

/**
 * Build the list of file keys the buyer is entitled to based on tier.
 * MP3 lease → mp3 only. WAV lease → wav + mp3 (per LICENSE_TIERS delivery
 * wording: "Untagged WAV + MP3").
 */
function filesForTier(beatId, tierId) {
  if (tierId === "wav") {
    return [
      { key: `${beatId}.wav`, label: "WAV (Untagged)" },
      { key: `${beatId}.mp3`, label: "MP3 (320kbps)" },
    ];
  }
  // Default + mp3 tier.
  return [{ key: `${beatId}.mp3`, label: "MP3 (320kbps)" }];
}

function renderEmailHtml({
  buyerName,
  beatTitle,
  tierName,
  availableLinks,
  pendingLabels,
}) {
  const greeting = buyerName ? `Hey ${buyerName.split(" ")[0]},` : "Hey,";

  const linksHtml = availableLinks
    .map(
      (l) =>
        `<li style="margin:6px 0;"><a href="${l.url}" style="color:#111;text-decoration:underline;">${l.label}</a> — link expires in 24 hours.</li>`,
    )
    .join("");

  const pendingHtml = pendingLabels.length
    ? `<p style="margin:18px 0 0;color:#666;font-size:13px;">
         Note: the following files are still being prepared and will be sent in a follow-up email shortly: ${pendingLabels.join(
           ", ",
         )}.
       </p>`
    : "";

  return `<!doctype html>
<html><body style="font-family:Georgia, 'Times New Roman', serif;color:#111;background:#fff;margin:0;padding:32px;">
  <div style="max-width:560px;margin:0 auto;">
    <h1 style="font-size:22px;font-weight:normal;letter-spacing:-0.01em;margin:0 0 8px;">Thank you.</h1>
    <p style="font-size:14px;color:#555;margin:0 0 24px;">Your ${tierName} for <em>${beatTitle}</em> is ready.</p>

    <p style="font-size:15px;line-height:1.55;margin:0 0 16px;">${greeting}</p>
    <p style="font-size:15px;line-height:1.55;margin:0 0 16px;">
      Here are your download links. They're signed and expire in 24 hours, so grab them tonight.
    </p>

    <ul style="font-size:15px;line-height:1.6;padding-left:18px;margin:0 0 8px;">
      ${linksHtml}
    </ul>
    ${pendingHtml}

    <h3 style="font-size:14px;font-weight:bold;letter-spacing:0.04em;text-transform:uppercase;margin:28px 0 8px;color:#333;">What's included</h3>
    <p style="font-size:14px;line-height:1.55;margin:0 0 6px;color:#333;">
      ${tierName} — non-exclusive use for one commercial recording. The full license PDF is attached to this email — keep it with your project files for distributor / DSP submissions.
    </p>

    <h3 style="font-size:14px;font-weight:bold;letter-spacing:0.04em;text-transform:uppercase;margin:28px 0 8px;color:#333;">Producer credit</h3>
    <p style="font-size:14px;line-height:1.55;margin:0 0 6px;color:#333;">
      Please credit me as <strong>prod. Xavier Moreno</strong> in the song title or first line of the credits. Tag <em>@xaviermoreno</em> when you share the finished record — I'd love to hear it.
    </p>

    <p style="font-size:13px;color:#888;margin:32px 0 0;border-top:1px solid #eee;padding-top:16px;">
      Questions? Reply to this email or reach me at bishopxavier20@gmail.com.
    </p>
  </div>
</body></html>`;
}

async function sendDeliveryEmail({
  toEmail,
  subject,
  html,
  pdfBuffer,
  pdfFilename,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Log what we would have sent so we can debug delivery in Vercel.
    console.log("[webhook] RESEND_API_KEY missing — would send:", {
      to: toEmail,
      subject,
      htmlBytes: html.length,
      pdfBytes: pdfBuffer.length,
      pdfFilename,
    });
    return { ok: false, skipped: true };
  }

  const payload = {
    from: "Xavier Moreno <onboarding@resend.dev>",
    to: [toEmail],
    subject,
    html,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer.toString("base64"),
      },
    ],
  };

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[webhook] Resend error", res.status, data);
      return { ok: false, error: data };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[webhook] Resend network error", err?.message || err);
    return { ok: false, error: err?.message || String(err) };
  }
}

async function handleCheckoutCompleted(session) {
  const orderId = session.id;
  const beatId = session?.metadata?.beat_id;
  const beatTitle = session?.metadata?.beat_title || "your production";
  const tierId = session?.metadata?.tier_id || "mp3";
  const tierName =
    session?.metadata?.tier_name ||
    LICENSE_TIERS.find((t) => t.id === tierId)?.name ||
    "Lease";

  const buyerEmail =
    session?.customer_details?.email || session?.customer_email || null;
  const buyerName = session?.customer_details?.name || "";

  // Light sanity check against the catalog. If the slug doesn't match a
  // known beat we still proceed (Stripe metadata is authoritative for
  // delivery), but log it so we can catch typos.
  if (!getBeatById(beatId)) {
    console.warn(
      "[webhook] beat_id not in config/beats.js, continuing anyway",
      { beatId, orderId },
    );
  }

  if (!buyerEmail) {
    // Can't deliver without an email. Log and exit gracefully — Stripe
    // shouldn't retry on a content failure.
    console.error("[webhook] checkout.session.completed missing buyer email", {
      orderId,
      beatId,
      tierId,
    });
    return { delivered: false, reason: "no_buyer_email" };
  }

  // --- Build signed URLs (and detect any files not yet uploaded). ---
  const files = filesForTier(beatId, tierId);
  const availableLinks = [];
  const pendingLabels = [];

  for (const f of files) {
    let exists = false;
    try {
      exists = await objectExists(f.key);
    } catch (err) {
      console.error("[webhook] R2 head failed", f.key, err?.message || err);
      // Treat HEAD failures as "pending" — we'd rather follow up than
      // hand the buyer a link that 403s.
      pendingLabels.push(f.label);
      continue;
    }
    if (!exists) {
      pendingLabels.push(f.label);
      continue;
    }
    try {
      const url = await getSignedDownloadUrl(f.key, 86400);
      availableLinks.push({ label: f.label, url });
    } catch (err) {
      console.error("[webhook] R2 sign failed", f.key, err?.message || err);
      pendingLabels.push(f.label);
    }
  }

  // --- Render license PDF. ---
  let pdfBuffer = null;
  try {
    pdfBuffer = await generateLicensePDF({
      buyerName,
      buyerEmail,
      beatTitle,
      tier: tierId,
      orderId,
      date: new Date(),
    });
  } catch (err) {
    console.error("[webhook] license PDF render failed", err?.message || err);
  }

  // --- Send the email. ---
  const subject = `Your ${beatTitle} ${String(tierId).toUpperCase()} Lease`;
  const html = renderEmailHtml({
    buyerName,
    beatTitle,
    tierName,
    availableLinks,
    pendingLabels,
  });

  const emailResult = pdfBuffer
    ? await sendDeliveryEmail({
        toEmail: buyerEmail,
        subject,
        html,
        pdfBuffer,
        pdfFilename: `${beatId}-license.pdf`,
      })
    : { ok: false, error: "pdf_render_failed" };

  // --- Order log (Vercel captures stdout). ---
  console.log("[webhook] order processed", {
    orderId,
    beatId,
    tierId,
    buyerEmail,
    buyerName,
    amountTotal: session.amount_total,
    currency: session.currency,
    filesDelivered: availableLinks.map((l) => l.label),
    filesPending: pendingLabels,
    pdfRendered: Boolean(pdfBuffer),
    pdfBytes: pdfBuffer?.length ?? 0,
    emailSent: emailResult.ok === true,
    emailSkipped: emailResult.skipped === true,
  });

  return {
    delivered: emailResult.ok === true,
    skipped: emailResult.skipped === true,
    pending: pendingLabels,
  };
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return new Response("webhook secret not configured", { status: 500 });
  }

  // CRITICAL: read raw bytes, not JSON. Stripe signs the exact byte
  // string and any reformat (JSON.parse → stringify) will break the HMAC.
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("missing stripe-signature header", { status: 400 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error("[webhook] stripe init failed", err?.message || err);
    return new Response("stripe not configured", { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err?.message || err);
    return new Response(`signature error: ${err?.message || "invalid"}`, {
      status: 400,
    });
  }

  // Only `checkout.session.completed` triggers delivery. For everything
  // else we ack with 200 so Stripe stops retrying — we just don't act.
  if (event.type !== "checkout.session.completed") {
    console.log("[webhook] ignored event type", event.type, event.id);
    return Response.json({ received: true, ignored: true });
  }

  try {
    const result = await handleCheckoutCompleted(event.data.object);
    return Response.json({ received: true, ...result });
  } catch (err) {
    // We want to 200 here on most failures so Stripe doesn't hammer the
    // endpoint indefinitely while we debug. The order is already logged
    // and Stripe has the payment recorded.
    console.error("[webhook] handler error", err?.message || err, err?.stack);
    return Response.json({ received: true, error: "handler_failed" });
  }
}
