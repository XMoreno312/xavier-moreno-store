import Link from "next/link";

/**
 * Shared editorial chrome for the Terms / Privacy / License Agreement
 * pages. Keeps these documents reading as part of the same series — same
 * eyebrow, same display heading, same body rhythm, same disclaimer at
 * the bottom. The page itself just passes a title + `children` (already
 * formatted as JSX prose).
 */
export default function LegalPage({ eyebrow, title, updated, children }) {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-7 sm:pt-24">
      <p
        className="text-[10px] text-silver"
        style={{ letterSpacing: "0.52em", textTransform: "uppercase" }}
      >
        {eyebrow}
      </p>

      <h1
        className="mt-5 font-display text-[2.2rem] leading-[1.06] text-bone sm:text-[3rem]"
        style={{ letterSpacing: "-0.012em" }}
      >
        {title}
      </h1>

      {updated ? (
        <p
          className="mt-4 text-[10px] text-silver/70"
          style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}
        >
          Last updated · {updated}
        </p>
      ) : null}

      <div className="legal-prose mt-12 space-y-7 text-[14.5px] leading-[1.75] text-bone/80">
        {children}

        <hr className="my-12 border-t border-bone/10" />

        <p className="text-[12.5px] italic text-silver/75">
          This is not legal advice. For legal questions, consult an attorney.
        </p>

        <p className="text-[11.5px] text-silver/70">
          Questions? Email{" "}
          <Link
            href="mailto:bishopxavier20@gmail.com"
            className="text-bone/80 underline decoration-bone/30 underline-offset-2 transition-colors hover:text-bone hover:decoration-bone"
          >
            bishopxavier20@gmail.com
          </Link>
          .
        </p>
      </div>

      {/* Local prose styles — kept here so the rest of the site doesn't
          inherit them. Editorial weight, generous spacing, quiet links. */}
      <style>{`
        .legal-prose h2 {
          font-family: var(--font-display, serif);
          color: rgb(239 233 221 / 1);
          font-size: 1.35rem;
          line-height: 1.2;
          letter-spacing: -0.005em;
          margin-top: 2.6rem;
          margin-bottom: 0.6rem;
        }
        .legal-prose h3 {
          color: rgb(239 233 221 / 0.95);
          font-size: 0.78rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .legal-prose p { color: rgb(239 233 221 / 0.78); }
        .legal-prose ul { margin: 0.4rem 0 0.8rem 0; padding-left: 1.1rem; list-style: none; }
        .legal-prose ul li {
          position: relative;
          padding-left: 1.1rem;
          margin-top: 0.5rem;
          color: rgb(239 233 221 / 0.78);
        }
        .legal-prose ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.85em;
          width: 0.6rem;
          height: 1px;
          background: rgb(168 163 154 / 0.5);
        }
        .legal-prose strong {
          color: rgb(239 233 221 / 0.95);
          font-weight: 500;
        }
        .legal-prose a {
          color: rgb(239 233 221 / 0.85);
          text-decoration: underline;
          text-decoration-color: rgb(239 233 221 / 0.25);
          text-underline-offset: 3px;
          transition: color 200ms, text-decoration-color 200ms;
        }
        .legal-prose a:hover {
          color: rgb(239 233 221 / 1);
          text-decoration-color: rgb(239 233 221 / 0.6);
        }
      `}</style>
    </article>
  );
}
