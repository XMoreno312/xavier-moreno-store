"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

// Canonical easing used throughout the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, margin: "-20% 0px" };

/**
 * Subtle email capture band. Reads as an editorial moment, not a growth
 * widget: small italic eyebrow, muted silver subtitle, then a Tally-backed
 * email field. We keep the React-side eyebrow + subtitle for visual control
 * (typography, animation, spacing) and let Tally render only the input +
 * submit button via the hideTitle=1 flag on the embed URL. Tally also owns
 * the post-submission "You're in." state inside the iframe — that thank-you
 * page was configured on the form itself, so the React success state has
 * been removed.
 */

const TALLY_SRC =
  "https://tally.so/embed/oblLvx?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

export default function NewsletterBand() {
  useEffect(() => {
    // Load Tally's embed script for dynamic-height postMessage support.
    // Safe to run on multiple pages — script is deduped by src.
    const SRC = "https://tally.so/widgets/embed.js";
    const existing = document.querySelector(`script[src="${SRC}"]`);
    if (existing) {
      if (typeof window.Tally !== "undefined") {
        window.Tally.loadEmbeds();
      }
      return;
    }
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => {
      if (typeof window.Tally !== "undefined") {
        window.Tally.loadEmbeds();
      }
    };
    document.body.appendChild(s);
  }, []);

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
          <iframe
            data-tally-src={TALLY_SRC}
            loading="lazy"
            title="Newsletter signup"
            className="mx-auto block w-full min-h-[120px] max-w-md"
            style={{ border: 0, width: "100%" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
