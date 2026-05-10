import { LICENSE_TIERS, getBeatById } from "@/config/beats";

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for a beat + tier and returns the
 * hosted Checkout URL. The client redirects the buyer there.
 *
 * Request body: { beatId: string, tierId: "mp3" | "wav" }
 * Response:     { url: string, sessionId: string }
 *
 * Notes:
 *  - We use shared Products + Prices (one per tier) and pass the beat
 *    title/id as Checkout Session metadata. The webhook reads that
 *    metadata to deliver the right files.
 *  - The submit message on the Stripe page reminds the buyer which beat
 *    they're licensing.
 *  - "exclusive" tier never reaches this route — the UI routes it to
 *    /work-with-me instead.
 */

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";

export async function POST(request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      { ok: false, error: "Stripe not configured" },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const { beatId, tierId } = body || {};
  if (!beatId || !tierId) {
    return Response.json(
      { ok: false, error: "beatId and tierId required" },
      { status: 400 },
    );
  }

  if (tierId === "exclusive") {
    return Response.json(
      { ok: false, error: "exclusive tier is contact-only" },
      { status: 400 },
    );
  }

  const beat = getBeatById(beatId);
  if (!beat) {
    return Response.json({ ok: false, error: "unknown beat" }, { status: 404 });
  }

  const tier = LICENSE_TIERS.find((t) => t.id === tierId);
  if (!tier || !tier.stripePriceId) {
    return Response.json(
      { ok: false, error: "unknown or unpriced tier" },
      { status: 400 },
    );
  }

  // Origin used for success/cancel URLs without hardcoding the domain.
  const origin =
    request.headers.get("origin") ||
    `https://${request.headers.get("host") || "xavier-moreno-store.vercel.app"}`;

  // Stripe expects form-encoded bodies. Build the payload manually so we
  // can express nested keys (line_items[0][price], metadata[...]).
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", tier.stripePriceId);
  params.set("line_items[0][quantity]", "1");
  params.set(
    "custom_text[submit][message]",
    `${beat.title} — ${tier.name}. Files and license sent by email immediately after payment.`,
  );
  params.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/checkout/cancel?beat=${encodeURIComponent(beatId)}`);
  params.set("metadata[beat_id]", String(beat.id));
  params.set("metadata[beat_title]", String(beat.title));
  params.set("metadata[tier_id]", String(tier.id));
  params.set("metadata[tier_name]", String(tier.name));
  // Collect the buyer's email — required for delivery.
  params.set("customer_creation", "if_required");
  params.set("billing_address_collection", "auto");
  // Mirror metadata onto the PaymentIntent so the webhook can use either.
  params.set("payment_intent_data[metadata][beat_id]", String(beat.id));
  params.set("payment_intent_data[metadata][tier_id]", String(tier.id));

  let stripeRes;
  try {
    stripeRes = await fetch(STRIPE_API, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  } catch (e) {
    console.error("[checkout] Stripe network error", e?.message || e);
    return Response.json(
      { ok: false, error: "stripe unreachable" },
      { status: 502 },
    );
  }

  const data = await stripeRes.json();
  if (!stripeRes.ok) {
    console.error("[checkout] Stripe error", stripeRes.status, data);
    return Response.json(
      { ok: false, error: data?.error?.message || "stripe error" },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, url: data.url, sessionId: data.id });
}
