"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Logo";

const EASE_SILK = [0.22, 1, 0.36, 1];

/**
 * The /beats masthead.
 *
 * NOT a duplicate of the landing hero. It's a quieter brand reinforcement:
 * ~75vh, dark moody plate, slow-drift gradient orbs, grain + vignette.
 * Drop /public/beats/masthead.mp4 in to auto-activate a video plate.
 *
 * Users arriving from `/` already saw the full hero — this is the breath
 * before the catalogue. Users landing directly here still get a strong
 * editorial first impression.
 */
export default function BeatsMasthead() {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden bg-stage"
      style={{ height: "75vh", minHeight: "560px" }}
    >
      {/* 0. Deep stage with a soft warm center for depth */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 45%, #161513 0%, #0B0B0B 55%, #050505 100%)",
        }}
      />

      {/* 1. Gold haze — slow horizontal drift (kept restrained, not loud) */}
      <motion.div
        aria-hidden
        initial={{ x: "-6%", y: "-3%", scale: 1.05 }}
        animate={{ x: "6%", y: "3%", scale: 1.12 }}
        transition={{
          duration: 38,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.45, 0, 0.55, 1],
        }}
        className="absolute -inset-[10%]"
        style={{
          background:
            "radial-gradient(circle at 30% 38%, rgba(201, 168, 124, 0.16), transparent 55%)",
          filter: "blur(80px)",
        }}
      />

      {/* 2. Plum counter-drift — the new color thread */}
      <motion.div
        aria-hidden
        initial={{ x: "5%", y: "2%", scale: 1.06 }}
        animate={{ x: "-7%", y: "-2%", scale: 1.0 }}
        transition={{
          duration: 52,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.45, 0, 0.55, 1],
        }}
        className="absolute -inset-[10%] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(122, 90, 116, 0.20), transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      {/* 3. Optional video plate — drops in when /public/beats/masthead.mp4 exists */}
      <motion.video
        ref={videoRef}
        src="/beats/masthead.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: videoReady ? 0.45 : 0 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ mixBlendMode: "screen" }}
      />

      {/* 4. Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* 5. Vignette — pulls the eye to the lockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* 6. Bottom feather — soft handoff into the grid below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #0B0B0B 100%)",
        }}
      />

      {/* Lockup */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.2, ease: EASE_SILK }}
        >
          <Logo
            blendOnBg
            className="h-20 w-auto sm:h-28 md:h-32"
            alt="Xavier Moreno"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.7, ease: EASE_SILK }}
          className="mt-10 text-[10px] text-silver sm:text-[11px]"
          style={{
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          Volume I
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.7, delay: 0.95, ease: EASE_SILK }}
          className="mt-5 font-display text-3xl text-bone sm:text-5xl md:text-6xl"
          style={{ letterSpacing: "-0.01em", lineHeight: 1.05 }}
        >
          Selected Productions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.7, delay: 1.25, ease: EASE_SILK }}
          className="mt-6 max-w-md text-[12px] leading-relaxed text-bone/55 sm:text-[13.5px]"
          style={{ fontStyle: "italic" }}
        >
          An archive for the artists who feel everything.
        </motion.p>
      </div>
    </section>
  );
}
