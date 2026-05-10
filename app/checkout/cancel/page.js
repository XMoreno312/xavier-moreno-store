import Link from "next/link";

export const dynamic = "force-dynamic";

/**
 * /checkout/cancel
 *
 * Stripe redirects buyers here when they back out of checkout. Quiet,
 * non-judgmental — keeps the door open. If a beat slug is in the query
 * string we link them straight back to it.
 */
export default function CheckoutCancelPage({ searchParams }) {
  const beat = searchParams?.beat || null;
  const backHref = beat ? `/beats/${beat}` : "/beats";

  return (
    <div className="relative w-full bg-stage text-bone">
      <section
        className="relative mx-auto flex w-full max-w-[640px] flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "60vh", paddingTop: "14vh", paddingBottom: "14vh" }}
      >
        <p
          className="text-[10px] text-silver"
          style={{ letterSpacing: "0.52em", textTransform: "uppercase" }}
        >
          Checkout canceled
        </p>

        <h1
          className="mt-5 font-display text-bone"
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.008em",
          }}
        >
          No harm done.
        </h1>

        <p
          className="mt-7 max-w-[480px] font-display italic text-bone/80"
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
            fontWeight: 400,
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
          }}
        >
          When you&apos;re ready, the production is right where you left it.
        </p>

        <Link
          href={backHref}
          className="group mt-12 inline-flex items-center gap-3 border border-bone/25 px-7 py-3 text-[10.5px] text-bone transition-colors duration-[700ms] hover:border-bone hover:bg-bone hover:text-stage"
          style={{
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)",
          }}
        >
          {beat ? "Back to this production" : "Back to the catalog"}
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
