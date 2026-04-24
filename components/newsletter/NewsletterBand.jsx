// TODO: wire to ConvertKit/Beehiiv when service is chosen
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Canonical easing used throughout the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, margin: "-20% 0px" };

/**
 * Subtle email capture band. Reads as an editorial moment, not a growth
 * widget: small italic eyebrow, muted silver subtitle, and a single-line
 * email + arrow on desktop (stacked on mobile). No badges, no promises of
 * "weekly newsletter" — just "Enter the archive."
 *
 * On submit we fade out the form and drop in a quiet italic "You're in."
 * The network call is intentionally not wired up yet; see top-of-file TODO.
 */
export default function NewsletterBand() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No network call yet — placeholder. See top-of-file TODO.
    setSubmitted(true);
  };

  return (
    <section
      aria-label="Join the archive"
      className="relative w-full overflow-hidden bg-stage text-bone"
      style={{ minHeight: "40vh" }}
    >
      {/* Top/bottom seam — blends into neighbouring sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Film grain — mirrors the global treatment */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.8, ease: EASE_SILK }}
        className="relative z-10 mx-auto flex w-full max-w-[640px] flex-col items-center justify-center px-6 py-24 text-center sm:py-32"
      >
        <p
          className="font-display italic text-bone"
          style={{
            fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.005em",
            lineHeight: 1.2,
          }}
        >
          Enter the archive.
        </p>

        <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed text-silver sm:text-sm">
          Get early access to new productions and unreleased work.
        </p>

        <div className="mt-10 w-full">
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.p
                key="confirm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE_SILK }}
                className="font-display italic text-bone"
                style={{
                  fontSize: "clamp(1.15rem, 1.7vw, 1.4rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.2,
                }}
              >
                You&apos;re in.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE_SILK }}
                className="mx-auto flex max-w-[420px] flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:gap-5"
                aria-label="Email subscription"
              >
                <label htmlFor="nl-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="nl-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="email address"
                  className={[
                    "block w-full border-0 border-b border-bone/20 bg-transparent",
                    "px-0 py-2.5 text-[15px] text-bone placeholder:text-silver/70",
                    "transition-colors duration-500 ease-out",
                    "focus:border-bone/60 focus:outline-none focus:ring-0",
                    "appearance-none rounded-none text-center sm:text-left",
                  ].join(" ")}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className={[
                    "group relative inline-flex shrink-0 items-center justify-center",
                    "px-5 py-2.5 text-[13px] text-bone/90",
                    "border border-bone/20 bg-transparent",
                    "transition-all duration-[700ms] ease-out",
                    "hover:text-bone hover:border-bone/45",
                  ].join(" ")}
                  style={{
                    letterSpacing: "0.18em",
                    fontWeight: 300,
                    boxShadow: "0 0 0 rgba(239,233,221,0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 24px rgba(239,233,221,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 rgba(239,233,221,0)";
                  }}
                >
                  →
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
