"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

// Slow, cinematic drift. Everything here is intentionally s-l-o-w.
// The curve is a long symmetrical ease — no visible "reset" at loop boundaries.
const DRIFT_EASE = [0.45, 0, 0.55, 1];

/**
 * Hero background built from approved photography.
 *
 * Layer stack (back → front):
 *   0. Deep ink base — guarantees no flashes while the image hydrates.
 *   1. Primary portrait — side-profile.jpg, slow Ken-Burns drift.
 *   2. Edge texture — bokeh.jpg, screened + heavy radial feather, low opacity.
 *   3. Darkening overlays — radial vignette + bottom-up linear for CTA legibility.
 *   4. Optional video loop (activates automatically if /hero/loop.mp4 exists).
 */
export default function BackgroundVisual() {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  return (
    <div className="absolute inset-0">
      {/* 0. Base — deep ink with a soft warm center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 42%, #1a1512 0%, #0B0B0B 55%, #050505 100%)",
        }}
      />

      {/* 1. Primary portrait — slow Ken-Burns so it breathes */}
      <motion.div
        initial={{ scale: 1.06, x: "-1.5%", y: "-1%" }}
        animate={{ scale: 1.12, x: "1.5%", y: "1%" }}
        transition={{
          duration: 38,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="absolute inset-0"
      >
        <Image
          src="/photos/side-profile.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center",
            // Warm color photo — nudge saturation down, add shadow warmth.
            filter: "sepia(0.08) saturate(0.9) contrast(1.02)",
          }}
        />
      </motion.div>

      {/* 2. Edge texture — bokeh, screened into the environment */}
      <motion.div
        aria-hidden
        initial={{ scale: 1.0, x: "0%", y: "0%" }}
        animate={{ scale: 1.08, x: "-2%", y: "1.5%" }}
        transition={{
          duration: 46,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="pointer-events-none absolute right-0 top-0 h-[55%] w-[55%]"
        style={{
          // Heavy radial feather so the photo dissolves into darkness.
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 70% 40%, #000 0%, rgba(0,0,0,0.75) 45%, transparent 78%)",
          maskImage:
            "radial-gradient(ellipse 60% 55% at 70% 40%, #000 0%, rgba(0,0,0,0.75) 45%, transparent 78%)",
          mixBlendMode: "screen",
          opacity: 0.4,
        }}
      >
        <Image
          src="/photos/bokeh.jpg"
          alt=""
          aria-hidden
          fill
          sizes="55vw"
          className="object-cover"
          style={{ filter: "saturate(0.75) contrast(1.05)" }}
        />
      </motion.div>

      {/* 3a. Radial darkening — carves the eye to center, crushes edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 45%, rgba(11,11,11,0.3) 0%, rgba(11,11,11,0.55) 55%, rgba(11,11,11,0.85) 100%)",
        }}
      />

      {/* 3b. Bottom-up linear — guarantees text legibility at the CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(5,5,5,0.7) 85%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* 4. Optional video loop — fades in the moment it can play.
            Drop /public/hero/loop.mp4 and it activates automatically. */}
      <motion.video
        ref={videoRef}
        src="/hero/loop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: videoReady ? 0.35 : 0 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
