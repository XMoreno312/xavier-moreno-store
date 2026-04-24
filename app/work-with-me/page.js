"use client";

import { motion } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import ApplicationForm from "@/components/workwithme/ApplicationForm";

// Same cinematic easing used across the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

/**
 * /work-with-me — quiet application page. Three beats:
 *   1. Hero band: title + the single statement in italic serif.
 *   2. Form: native <ApplicationForm /> — placeholder submit for now.
 *   3. Closing line: one italic serif breath — "The right fit matters."
 *
 * Dark stage, global grain overlay inherited from layout, persistent header.
 * No agency chrome. Reads like a letter, not a lead form.
 */
export default function WorkWithMePage() {
  return (
    <div className="relative w-full bg-stage text-bone">
      {/* Section-level grain — mirrors QuietMoment / Hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* 1 — Quiet hero band */}
      <SectionReveal>
        <section
          aria-labelledby="wm-title"
          className="relative flex w-full flex-col items-center justify-center px-6 text-center"
          style={{ minHeight: "40vh", paddingTop: "14vh", paddingBottom: "6vh" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_SILK }}
            className="text-[10px] text-silver"
            style={{ letterSpacing: "0.52em", textTransform: "uppercase" }}
          >
            By application
          </motion.p>

          <motion.h1
            id="wm-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE_SILK }}
            className="mt-5 font-display text-bone"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.008em",
            }}
          >
            Work With Me
          </motion.h1>

          <motion.blockquote
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.5, ease: EASE_SILK }}
            className="mt-[6vh] max-w-[640px] font-display italic text-bone"
            style={{
              fontSize: "clamp(1.15rem, 1.9vw, 1.55rem)",
              fontWeight: 400,
              lineHeight: 1.55,
              letterSpacing: "-0.005em",
            }}
          >
            “I work with a limited number of artists. If you&apos;re serious
            about your sound and ready to create something that lasts, apply
            below.”
            <span
              className="mt-5 block text-[10px] not-italic text-silver"
              style={{ letterSpacing: "0.42em", textTransform: "uppercase" }}
            >
              — Xavier
            </span>
          </motion.blockquote>
        </section>
      </SectionReveal>

      {/* 2 — Application form */}
      <SectionReveal>
        <section
          aria-label="Application form"
          className="relative mx-auto w-full max-w-[720px] px-4 pb-24 pt-6 sm:pb-32 sm:pt-10"
        >
          <ApplicationForm />
        </section>
      </SectionReveal>

      {/* 3 — Closing breath */}
      <SectionReveal>
        <section
          aria-label="Closing"
          className="relative flex w-full items-center justify-center px-6"
          style={{ paddingTop: "10vh", paddingBottom: "20vh" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.4, ease: EASE_SILK }}
            className="font-display italic text-bone/85"
            style={{
              fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
              fontWeight: 400,
              lineHeight: 1.3,
              letterSpacing: "-0.005em",
              textAlign: "center",
              textShadow: "0 2px 24px rgba(0,0,0,0.65)",
            }}
          >
            The right fit matters.
          </motion.p>
        </section>
      </SectionReveal>
    </div>
  );
}
