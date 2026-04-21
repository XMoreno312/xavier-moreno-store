"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Same easing as the rest of the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, amount: 0.4 };

/**
 * A "breath" moment below the portrait/bio block.
 * Left: ultra-minimal line. Right: studio photo, ~40% width.
 * ~70vh — shorter, quieter than the bio section.
 */
export default function InTheWork() {
  return (
    <section
      aria-label="In the work"
      className="relative w-full bg-stage text-bone"
      style={{ minHeight: "70vh" }}
    >
      {/* Grain, matching language */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-[1400px] flex-col items-stretch gap-10 px-6 py-24 sm:px-10 sm:py-28 md:flex-row md:items-center md:gap-20 md:py-32 lg:px-16">
        {/* Left — the line */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.8, ease: EASE_SILK }}
          className="flex w-full items-center md:w-[55%]"
        >
          <p
            className="font-display text-bone"
            style={{
              fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              maxWidth: "20ch",
            }}
          >
            Every production starts here.
          </p>
        </motion.div>

        {/* Right — the studio photo, ~40% width on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.8, delay: 0.25, ease: EASE_SILK }}
          className="relative w-full overflow-hidden md:w-[40%] md:ml-auto"
          style={{ aspectRatio: "3 / 4" }}
        >
          <Image
            src="/portraits/studio.jpg"
            alt="Xavier Moreno in a studio, seated playing a black acoustic guitar under plum lighting."
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            style={{
              filter: "saturate(0.9) contrast(1.02)",
            }}
          />

          {/* Plum wash — leans into the palette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 70% 30%, rgba(11,11,11,0) 40%, rgba(122,90,116,0.18) 100%)",
              mixBlendMode: "soft-light",
            }}
          />

          {/* Edge vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
