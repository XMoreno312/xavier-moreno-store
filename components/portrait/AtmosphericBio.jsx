"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Same long, restrained easing used across the hero and /beats.
const EASE_SILK = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, amount: 0.25 };

/**
 * Atmospheric bio collage — three photos feathered into the darkness,
 * bio text layered in the darker gaps between them. Designed so the
 * photos read as one environment, not three cards side-by-side.
 *
 * Photos:
 *   - Left:   piano-hands-bw.jpg  (B&W, intimate)
 *   - Center: acoustic-mic.jpg    (warm amber, production moment)
 *   - Right:  daw-bw.jpg          (B&W, editorial over-the-shoulder)
 *
 * Mobile: stacks vertically, bio text sits between; photos still feather
 * into black so the atmosphere holds.
 */
export default function AtmosphericBio() {
  return (
    <section
      aria-label="Xavier Moreno — bio"
      className="relative w-full overflow-hidden bg-stage text-bone"
      style={{ minHeight: "70vh" }}
    >
      {/* Photo collage layer — absolutely positioned, bleeds off every edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        {/* LEFT — piano hands, feathered on the right edge */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 2.2, ease: EASE_SILK }}
          className="absolute inset-y-0 left-0 hidden md:block"
          style={{
            width: "42%",
            transform: "translateX(-6%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 85% at 30% 50%, #000 0%, rgba(0,0,0,0.85) 45%, transparent 90%)",
            maskImage:
              "radial-gradient(ellipse 95% 85% at 30% 50%, #000 0%, rgba(0,0,0,0.85) 45%, transparent 90%)",
          }}
        >
          <Image
            src="/photos/piano-hands-bw.jpg"
            alt=""
            aria-hidden
            fill
            sizes="42vw"
            className="object-cover"
            style={{ objectPosition: "center", filter: "contrast(1.05)" }}
          />
        </motion.div>

        {/* CENTER — acoustic / mic, smaller, floats vertical center */}
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 2.4, delay: 0.15, ease: EASE_SILK }}
          className="absolute left-1/2 top-1/2 hidden md:block"
          style={{
            width: "46%",
            height: "72%",
            transform: "translate(-50%, -50%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 70% at 50% 50%, #000 0%, rgba(0,0,0,0.7) 55%, transparent 92%)",
            maskImage:
              "radial-gradient(ellipse 75% 70% at 50% 50%, #000 0%, rgba(0,0,0,0.7) 55%, transparent 92%)",
          }}
        >
          <Image
            src="/photos/acoustic-mic.jpg"
            alt=""
            aria-hidden
            fill
            sizes="46vw"
            className="object-cover"
            style={{
              objectPosition: "center",
              // Warm photo — same grading language as the hero.
              filter: "sepia(0.08) saturate(0.9) contrast(1.02)",
            }}
          />
        </motion.div>

        {/* RIGHT — DAW monitor, feathered on the left edge */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 2.2, delay: 0.25, ease: EASE_SILK }}
          className="absolute inset-y-0 right-0 hidden md:block"
          style={{
            width: "44%",
            transform: "translateX(6%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 85% at 70% 50%, #000 0%, rgba(0,0,0,0.85) 45%, transparent 90%)",
            maskImage:
              "radial-gradient(ellipse 95% 85% at 70% 50%, #000 0%, rgba(0,0,0,0.85) 45%, transparent 90%)",
          }}
        >
          <Image
            src="/photos/daw-bw.jpg"
            alt=""
            aria-hidden
            fill
            sizes="44vw"
            className="object-cover"
            style={{ objectPosition: "center", filter: "contrast(1.05)" }}
          />
        </motion.div>

        {/* MOBILE stack — three photos vertically, each feathered top+bottom */}
        <div className="flex h-full flex-col md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.8, ease: EASE_SILK }}
            className="relative h-1/3 w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
              maskImage:
                "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
            }}
          >
            <Image
              src="/photos/piano-hands-bw.jpg"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
              style={{ filter: "contrast(1.05)" }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.8, delay: 0.1, ease: EASE_SILK }}
            className="relative h-1/3 w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
              maskImage:
                "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
            }}
          >
            <Image
              src="/photos/acoustic-mic.jpg"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
              style={{ filter: "sepia(0.08) saturate(0.9) contrast(1.02)" }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.8, delay: 0.2, ease: EASE_SILK }}
            className="relative h-1/3 w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
              maskImage:
                "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
            }}
          >
            <Image
              src="/photos/daw-bw.jpg"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
              style={{ filter: "contrast(1.05)" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Unifying dark overlays — makes the three photos feel like one environment */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(11,11,11,0.15) 0%, rgba(11,11,11,0.55) 60%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 14%, rgba(0,0,0,0.15) 86%, rgba(0,0,0,0.85) 100%)",
        }}
      />

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

      {/* Bio text — layered over the darker gaps */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-center px-6 py-20 sm:px-10 md:items-start md:justify-center md:py-24 lg:px-20" style={{ minHeight: "70vh" }}>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.6, ease: EASE_SILK }}
          className="font-display text-bone"
          style={{
            fontSize: "clamp(2.6rem, 6.2vw, 4.8rem)",
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: "-0.015em",
            textShadow: "0 2px 28px rgba(0,0,0,0.55)",
          }}
        >
          Xavier Moreno.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.6, delay: 0.25, ease: EASE_SILK }}
          className="mt-8 uppercase italic text-silver"
          style={{
            fontSize: "clamp(0.72rem, 0.95vw, 0.84rem)",
            fontWeight: 300,
            letterSpacing: "0.44em",
            textShadow: "0 2px 18px rgba(0,0,0,0.55)",
          }}
        >
          Los Angeles.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.6, delay: 0.5, ease: EASE_SILK }}
          className="mt-10 italic text-bone/90"
          style={{
            fontSize: "clamp(1.05rem, 1.45vw, 1.28rem)",
            fontWeight: 300,
            lineHeight: 1.55,
            letterSpacing: "0.01em",
            maxWidth: "36ch",
            textShadow: "0 2px 18px rgba(0,0,0,0.55)",
          }}
        >
          Artist, producer, songwriter.
        </motion.p>
      </div>
    </section>
  );
}
