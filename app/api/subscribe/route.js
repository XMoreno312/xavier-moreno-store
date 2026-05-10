/**
 * POST /api/subscribe
 *
 * Newsletter signup. Mirrors /api/work-with-me's fallback chain:
 *   1. Forward to Tally form oblLvx via their submissions API.
 *   2. Log to server logs (Vercel captures them).
 *   3. Email via Resend if RESEND_API_KEY is configured.
 *
 * Always returns 200 on a structurally valid payload so submissions can't
 * be silently dropped — Tally's free tier may reject API submissions and
 * we still want a recoverable trail.
 */

const TALLY_FORM_ID = "oblLvx";
const TALLY_ENDPOINT = `https://api.tally.so/v1/forms/${TALLY_FORM_ID}/submissions`;
const NOTIFY_TO = "musicaxmoreno@gmail.com";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const email = (data?.email || "").trim();
  if (!email) {
    return Response.json({ ok: false, error: "email required" }, { status: 400 });
  }

  // 1. Try Tally first.
  try {
    const tallyResponse = await fetch(TALLY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, email }),
    });
    if (tallyResponse.ok) {
      return Response.json({ ok: true, via: "tally" });
    }
  } catch (e) {
    // Fall through.
  }

  // 2. Always log so the signup is recoverable from Vercel logs.
  console.log("[subscribe submission]", JSON.stringify({ email }, null, 2));

  // 3. Email via Resend if configured.
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  console.log("[subscribe] RESEND_API_KEY present:", hasResend);

  if (hasResend) {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Site Form <onboarding@resend.dev>",
          to: NOTIFY_TO,
          subject: `New newsletter signup: ${email}`,
          html: `<p>New newsletter signup:</p><p><strong>${escapeHtml(email)}</strong></p>`,
        }),
      });
      const resendBody = await resendRes.text();
      console.log(
        "[subscribe] Resend response:",
        resendRes.status,
        resendBody.slice(0, 500),
      );
      if (resendRes.ok) {
        return Response.json({ ok: true, via: "resend" });
      }
    } catch (e) {
      console.error("[subscribe] Resend threw:", e?.message || e);
    }
  }

  return Response.json({ ok: true, via: "logged" });
}
