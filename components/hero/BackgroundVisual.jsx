"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Long, symmetrical ease — no visible "reset" at loop boundaries.
const DRIFT_EASE = [0.45, 0, 0.55, 1];

/**
 * Hero background — warm "coffee" gradient with a floating cutout portrait.
 *
 * Layer stack (back → front):
 *   0. Linear ink wash (135°, deep coffee → near-black)
 *   1. Warm radial bloom anchored upper-left to give the type a halo
 *   2a. Dark brown halo behind the cutout — anchors it to the gradient
 *   2b. Cutout portrait — desktop, larger and pulled inward
 *   2c. Cutout portrait — mobile, face anchored upper-right
 *   2d. Mobile read-zone gradient — keeps text legible over the cutout
 *   3. Site-wide film grain at ~5% opacity
 *   4. Bottom fade to #0B0B0B so FeaturedProductions hands off cleanly
 */
export default function BackgroundVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 0. Base linear wash — deep coffee diagonal into black */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #2F2218 0%, #1F1812 45%, #0B0B0B 100%)",
        }}
      />

      {/* 1. Warm radial bloom — upper-left, behind the type */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 35% 40%, #3D2D22 0%, transparent 70%)",
        }}
      />

      {/* 2a. Dark brown halo BEHIND the desktop cutout — soft radial,
            ~80% the cutout's footprint, blurred ~120px. Sits between
            the gradient and the cutout itself so the figure reads as
            "lit from the gradient" rather than pasted on top. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-4vh] right-[2vw] hidden h-[95vh] w-[65vh] md:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 55%, #150F08 0%, transparent 75%)",
          opacity: 0.6,
          filter: "blur(120px)",
        }}
      />

      {/* 2b. Cutout portrait — desktop. Larger, pulled inward so the
            guitar body sits roughly between 50–65% of the viewport.
            Slow Ken Burns (1.0 → 1.02) over 30s for almost-imperceptible
            breath. */}
      <motion.div
        aria-hidden
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.02 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="pointer-events-none absolute bottom-[-3vh] right-[6vw] hidden h-[100vh] md:block"
        style={{
          aspectRatio: "1440 / 1800",
          filter: "drop-shadow(0 60px 100px rgba(0,0,0,0.6))",
        }}
      >
        <Image
          src="/photos/hero-cutout.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="(min-width: 768px) 80vh, 0px"
          className="object-contain object-bottom"
        />
      </motion.div>

      {/* 2c. Mobile cutout — face/upper-body visible at top-right.
            objectPosition crops to the head/shoulders area; full opacity,
            with the read-zone gradient (2d) handling legibility. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-4vh] right-[-14vw] block h-[58vh] md:hidden"
        style={{
          aspectRatio: "1440 / 1800",
        }}
      >
        <Image
          src="/photos/hero-cutout.png"
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 767px) 90vw, 0px"
          className="object-contain"
          style={{ objectPosition: "75% 20%" }}
        />
      </div>

      {/* 2d. Mobile read-zone gradient — fades the cutout into the
            background over the lower half so logo/tagline/headline/CTA
            sit cleanly over a dark wash. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 block md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 32%, rgba(11,11,11,0.78) 58%, #0B0B0B 92%)",
        }}
      />

      {/* 3. Site-wide film grain — keeps the gradient from looking flat/CGI */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* 4. Bottom fade — clean handoff to FeaturedProductions (#0B0B0B) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 70%, #0B0B0B 100%)",
        }}
      />
    </div>
  );
}
