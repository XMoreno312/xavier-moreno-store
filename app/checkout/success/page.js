import Link from "next/link";

// Force dynamic so Stripe session lookup is fresh on every visit.
export const dynamic = "force-dynamic";

/**
 * /checkout/success
 *
 * Stripe redirects buyers here after payment with ?session_id=cs_...
 * We verify the session server-side, then show a thank-you that mirrors
 * the site's editorial voice. The actual file delivery happens via the
 * Stripe webhook (separate route) — this page is just the "yes, it
 * worked" moment.
 */

async function fetchSession(sessionId) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !sessionId) return null;
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id || null;
  const session = await fetchSession(sessionId);

  const paid = session?.payment_status === "paid";
  const beatTitle = session?.metadata?.beat_title || "your production";
  const tierName = session?.metadata?.tier_name || "license";
  const customerEmail =
    session?.customer_details?.email || session?.customer_email || null;

  return (
    <div className="relative w-full bg-stage text-bone">
      <section
        className="relative mx-auto flex w-full max-w-[640px] flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "70vh", paddingTop: "16vh", paddingBottom: "16vh" }}
      >
        <p
          className="text-[10px] text-silver"
          style={{ letterSpacing: "0.52em", textTransform: "uppercase" }}
        >
          {paid ? "Payment received" : "Processing"}
        </p>

        <h1
          className="mt-5 font-display text-bone"
          style={{
            fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.008em",
          }}
        >
          {paid ? "Thank you." : "Almost there…"}
        </h1>

        <p
          className="mt-7 max-w-[480px] font-display italic text-bone/85"
          style={{
            fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)",
            fontWeight: 400,
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
          }}
        >
          {paid
            ? `Your ${tierName.toLowerCase()} for ${beatTitle} is on the way.`
            : "Your payment is being verified. You'll see a confirmation email shortly."}
        </p>

        {paid && customerEmail ? (
          <p className="mt-6 max-w-[420px] text-[12.5px] leading-relaxed text-silver">
            Files and your license document are being sent to{" "}
            <span className="text-bone/80">{customerEmail}</span>. Check your
            inbox in the next few minutes.
          </p>
        ) : null}

        <Link
          href="/beats"
          className="group mt-12 inline-flex items-center gap-3 border border-bone/25 px-7 py-3 text-[10.5px] text-bone transition-colors duration-[700ms] hover:border-bone hover:bg-bone hover:text-stage"
          style={{
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)",
          }}
        >
          Back to the catalog
          <span
            aria-hidden
            className="transition-transform duration-[700ms] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </section>
    </div>
  );
}
