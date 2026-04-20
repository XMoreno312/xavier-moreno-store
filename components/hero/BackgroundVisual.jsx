"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

// Slow, cinematic drift. Everything here is intentionally s-l-o-w.
// The curve is a long symmetrical ease — no visible "reset" at loop boundaries.
const DRIFT_EASE = [0.45, 0, 0.55, 1];

export default function BackgroundVisual() {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  return (
    <div className="absolute inset-0">
      {/* 0. Base — deep ink with a soft warm center, anchoring the eye */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 42%, #1a1512 0%, #0B0B0B 55%, #050505 100%)",
        }}
      />

      {/* 1. Warm gold haze — slow horizontal drift */}
      <motion.div
        initial={{ x: "-8%", y: "-4%", scale: 1.05 }}
        animate={{ x: "8%", y: "4%", scale: 1.12 }}
        transition={{
          duration: 34,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="absolute -inset-[10%]"
        style={{
          background:
            "radial-gradient(circle at 32% 42%, rgba(201, 168, 124, 0.22), transparent 52%)",
          filter: "blur(70px)",
        }}
      />

      {/* 2. Cool counter-drift — adds depth without competing */}
      <motion.div
        initial={{ x: "6%", y: "3%", scale: 1.08 }}
        animate={{ x: "-8%", y: "-3%", scale: 1.02 }}
        transition={{
          duration: 46,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="absolute -inset-[10%] opacity-60"
        style={{
          background:
            "radial-gradient(circle at 72% 58%, rgba(70, 58, 46, 0.55), transparent 58%)",
          filter: "blur(90px)",
        }}
      />

      {/* 3. Deep shadow wash — bottom weight */}
      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0.95 }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
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
        animate={{ opacity: videoReady ? 0.55 : 0 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
