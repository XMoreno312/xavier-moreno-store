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
 *   2. Cutout portrait anchored to the right edge with a slow Ken Burns drift
 *   3. Site-wide film grain at ~5% opacity
 *   4. Bottom 20vh fade to #0B0B0B so FeaturedProductions hands off cleanly
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

      {/* 2. Cutout portrait — right edge on desktop, atmospheric on mobile.
            Slow Ken Burns (1.0 → 1.02) over 30s for almost-imperceptible breath. */}
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
        className="pointer-events-none absolute bottom-0 right-[-4vw] hidden h-[85vh] md:block"
        style={{
          aspectRatio: "1440 / 1800",
          filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))",
        }}
      >
        <Image
          src="/photos/hero-cutout.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="(min-width: 768px) 70vh, 0px"
          className="object-contain object-bottom"
        />
      </motion.div>

      {/* 2b. Mobile cutout — low-opacity atmospheric layer behind the text */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-10vw] block h-[70vh] opacity-[0.30] md:hidden"
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
          className="object-contain object-bottom"
        />
      </div>

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
