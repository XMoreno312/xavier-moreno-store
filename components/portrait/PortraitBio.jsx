"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Same long, restrained easing used across the hero and /beats.
const EASE_SILK = [0.22, 1, 0.36, 1];

// Shared viewport config — fades in when the block comes into view, and
// stays (no replay on scroll-up).
const VIEWPORT = { once: true, amount: 0.35 };

export default function PortraitBio() {
  return (
    <section
      aria-label="Xavier Moreno — portrait and bio"
      className="relative w-full bg-stage text-bone"
      style={{ minHeight: "90vh" }}
    >
      {/* Film-grain overlay — echoes the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* Soft top vignette so the seam from the hero feels intentional */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[90vh] w-full max-w-[1400px] flex-col items-stretch gap-12 px-6 py-24 sm:px-10 sm:py-28 md:flex-row md:items-center md:gap-16 md:py-32 lg:px-16 lg:gap-24">
        {/* Portrait — left on desktop, top on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.6, ease: EASE_SILK }}
          className="relative w-full overflow-hidden md:w-[55%]"
          style={{ aspectRatio: "3 / 4" }}
        >
          <Image
            src="/portraits/rooftop.jpg"
            alt="Xavier Moreno on a rooftop at blue hour, holding a guitar, Los Angeles skyline behind."
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
            style={{
              // Extra tonal anchor so the photo sits inside our palette
              // even before the sharp-graded file loads.
              filter: "saturate(0.92) contrast(1.02)",
            }}
          />

          {/* Gentle plum/shadow wash — very low opacity, keeps the photo real */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 30% 20%, rgba(11,11,11,0) 40%, rgba(122,90,116,0.12) 100%)",
              mixBlendMode: "soft-light",
            }}
          />

          {/* Vignette for edge-fall */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        </motion.div>

        {/* Text block — right on desktop, below photo on mobile */}
        <div className="flex w-full flex-col justify-center md:w-[45%]">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.6, delay: 0.15, ease: EASE_SILK }}
            className="font-display text-bone"
            style={{
              fontSize: "clamp(2.4rem, 5.6vw, 4.2rem)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
            }}
          >
            Xavier Moreno.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.6, delay: 0.35, ease: EASE_SILK }}
            className="mt-5 uppercase text-silver"
            style={{
              fontSize: "clamp(0.72rem, 0.95vw, 0.82rem)",
              fontWeight: 300,
              letterSpacing: "0.42em",
            }}
          >
            Los Angeles.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.6, delay: 0.55, ease: EASE_SILK }}
            className="mt-8 italic text-bone/90"
            style={{
              fontSize: "clamp(1.02rem, 1.35vw, 1.2rem)",
              fontWeight: 300,
              lineHeight: 1.55,
              letterSpacing: "0.01em",
              maxWidth: "32ch",
            }}
          >
            Artist, producer, songwriter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.8, delay: 0.85, ease: EASE_SILK }}
            className="mt-12"
          >
            <Link
              href="/beats"
              className="group inline-block font-display text-bone"
              style={{
                fontSize: "clamp(1.4rem, 2.1vw, 1.8rem)",
                fontWeight: 400,
                letterSpacing: "-0.005em",
                lineHeight: 1.15,
              }}
            >
              <span
                className="relative inline-block"
                style={{ transition: "color 900ms ease" }}
              >
                Welcome to my collection.
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 right-0 bottom-[-4px] h-[1px] origin-left scale-x-0 bg-bone transition-transform duration-[900ms] ease-out group-hover:scale-x-100"
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
