/**
 * POST /api/work-with-me
 *
 * Receives the native ApplicationForm submission and tries, in order:
 *   1. Forward to Tally form b5NQ46 via their public submissions API.
 *      (May 401 on free tier — that's fine.)
 *   2. Log the submission to server logs (Vercel captures them).
 *   3. If RESEND_API_KEY is present, send an email to bishopxavier20@gmail.com.
 *
 * The route always returns 200 on a structurally valid request so the form
 * never silently loses a submission — the fallback chain guarantees the lead
 * is captured somewhere we can recover it from.
 */

const TALLY_FORM_ID = "b5NQ46";
const TALLY_ENDPOINT = `https://api.tally.so/v1/forms/${TALLY_FORM_ID}/submissions`;
const NOTIFY_TO = "bishopxavier20@gmail.com";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function multilineHtml(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // 1. Try Tally first.
  try {
    const tallyResponse = await fetch(TALLY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: data.name,
        Email: data.email,
        "Artist Name": data.artistName,
        "Demo Links": data.demoLinks,
        "Social Media Links": data.socialLinks,
        "What are you trying to create?": data.message,
      }),
    });
    if (tallyResponse.ok) {
      return Response.json({ ok: true, via: "tally" });
    }
  } catch (e) {
    // Fall through.
  }

  // 2. Always log so the lead is recoverable from Vercel logs.
  console.log(
    "[work-with-me submission]",
    JSON.stringify(data, null, 2),
  );

  // 3. Email via Resend if the env var is configured.
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  console.log("[work-with-me] RESEND_API_KEY present:", hasResend);

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
          subject: `New Work With Me application: ${data.artistName || data.name || "(no name)"}`,
          html: `
            <h2>New Work With Me application</h2>
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Artist Name:</strong> ${escapeHtml(data.artistName)}</p>
            <p><strong>Demo Links:</strong><br>${multilineHtml(data.demoLinks)}</p>
            <p><strong>Social Media:</strong><br>${multilineHtml(data.socialLinks)}</p>
            <p><strong>What they want to create:</strong><br>${multilineHtml(data.message)}</p>
          `,
        }),
      });
      const resendBody = await resendRes.text();
      console.log(
        "[work-with-me] Resend response:",
        resendRes.status,
        resendBody.slice(0, 500),
      );
      if (resendRes.ok) {
        return Response.json({ ok: true, via: "resend" });
      }
    } catch (e) {
      console.error("[work-with-me] Resend threw:", e?.message || e);
    }
  }

  return Response.json({ ok: true, via: "logged" });
}
