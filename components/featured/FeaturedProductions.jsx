"use client";

import { motion } from "framer-motion";
import ProductionCard from "@/components/beats/ProductionCard";
import { beats } from "@/config/beats";

// Single cinematic curve — matches hero + /beats.
const EASE_SILK = [0.22, 1, 0.36, 1];

const FEATURED_SLUGS = ["tarde-de-lluvia", "cristal", "no-me-llames"];

/**
 * Three hand-picked productions for the homepage. Pulls straight from
 * config/beats.js by slug so the catalogue stays the source of truth —
 * editing a beat's mood/key/BPM there updates here automatically.
 *
 * Visual language matches /beats: editorial serif title, section ruler,
 * the same ProductionCard. We turn on `showLicenseCta` so each card reads
 * like a storefront moment on this page, while /beats keeps its hover-only
 * reveal for a more gallery feel.
 */
export default function FeaturedProductions() {
  const featured = FEATURED_SLUGS
    .map((slug) => beats.find((b) => b.id === slug))
    .filter(Boolean);

  // Canonical release numbers from the source order — stable across filters.
  const releaseNoFor = (id) => {
    const i = beats.findIndex((b) => b.id === id);
    return i >= 0 ? String(i + 1).padStart(3, "0") : "000";
  };

  return (
    <section
      aria-label="Featured Productions"
      className="relative w-full overflow-hidden bg-stage text-bone"
    >
      {/* Film grain — same language as the rest of the site */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32">
        {/* Editorial ruler — echoes "The Archive" on /beats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.4, ease: EASE_SILK }}
          className="flex items-center justify-center gap-5 sm:gap-6"
        >
          <span className="h-px w-10 bg-silver/25" aria-hidden />
          <span
            className="text-[9.5px] text-silver/80"
            style={{ letterSpacing: "0.55em", textTransform: "uppercase" }}
          >
            Selected Work
          </span>
          <span className="h-px w-10 bg-silver/25" aria-hidden />
        </motion.div>

        {/* Section title — editorial serif, same scale family as /beats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.4, delay: 0.1, ease: EASE_SILK }}
          className="mt-8 flex flex-col items-center text-center sm:mt-10"
        >
          <h2
            className="font-display text-[1.75rem] leading-[1.1] text-bone sm:text-[2.15rem]"
            style={{ letterSpacing: "-0.012em" }}
          >
            Featured Productions
          </h2>
          <p
            className="mt-5 max-w-md text-[11.5px] italic text-bone/55 sm:text-[12.5px]"
            style={{ letterSpacing: "0.02em", lineHeight: 1.7 }}
          >
            Three releases to begin with. License any of them, or keep
            reading to meet the hand behind them.
          </p>
        </motion.div>

        {/* Grid — three up on desktop, stacks on mobile. The asymmetric
            offsets built into ProductionCard give the row a subtle rhythm
            without it feeling algorithmic. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.22, delayChildren: 0.25 },
            },
          }}
          className="mt-20 grid grid-cols-1 gap-x-10 gap-y-24 sm:mt-24 sm:gap-y-28 md:grid-cols-3 md:gap-x-10 lg:gap-x-14"
        >
          {featured.map((beat, i) => (
            <ProductionCard
              key={beat.id}
              beat={beat}
              index={i}
              releaseNo={releaseNoFor(beat.id)}
              showLicenseCta
            />
          ))}
        </motion.div>

        {/* Quiet "see the rest" rail — routes into the full catalogue */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.4, delay: 0.2, ease: EASE_SILK }}
          className="mt-24 flex items-center justify-center gap-5 sm:mt-28 sm:gap-6"
        >
          <span className="h-px w-10 bg-silver/25" aria-hidden />
          <a
            href="/beats"
            className="text-[10px] text-silver/85 transition-colors duration-500 hover:text-bone"
            style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
          >
            See the Full Catalogue →
          </a>
          <span className="h-px w-10 bg-silver/25" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
