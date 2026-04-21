"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Logo";

// Match the landing's vocabulary exactly — same curve, same grammar.
// The masthead is a continuation of the hero, not a separate screen.
const EASE_SILK = [0.22, 0.6, 0.24, 1];
const DRIFT_EASE = [0.45, 0, 0.55, 1];

/**
 * The /beats masthead.
 *
 * NOT a duplicate of the landing hero. It's a quieter brand reinforcement:
 * ~75vh, dark moody plate, slow-drift gradient orbs, grain + vignette.
 * Drop /public/beats/masthead.mp4 in to auto-activate a video plate.
 *
 * Users arriving from `/` already saw the full hero — this is the breath
 * before the catalogue. The intent: stepping through a curtain into the
 * same room, lower volume. Same easing, same parallax grammar, same grain,
 * just dialed down — shorter amplitudes, longer periods.
 */
export default function BeatsMasthead() {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden bg-stage"
      style={{ height: "78vh", minHeight: "600px" }}
    >
      {/* 0. Deep stage with a soft warm center — matches the landing's base */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 45%, #1a1512 0%, #0B0B0B 55%, #050505 100%)",
        }}
      />

      {/* 1. Warm gold haze — slower, shorter amplitude than the landing */}
      <motion.div
        aria-hidden
        initial={{ x: "-5%", y: "-2%", scale: 1.05 }}
        animate={{ x: "5%", y: "2%", scale: 1.1 }}
        transition={{
          duration: 44,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="absolute -inset-[10%]"
        style={{
          background:
            "radial-gradient(circle at 32% 42%, rgba(201, 168, 124, 0.18), transparent 52%)",
          filter: "blur(80px)",
        }}
      />

      {/* 2. Cool counter-drift — same recipe family as the landing, dialed down */}
      <motion.div
        aria-hidden
        initial={{ x: "4%", y: "2%", scale: 1.06 }}
        animate={{ x: "-6%", y: "-2%", scale: 1.0 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="absolute -inset-[10%] opacity-60"
        style={{
          background:
            "radial-gradient(circle at 72% 58%, rgba(70, 58, 46, 0.55), transparent 58%)",
          filter: "blur(100px)",
        }}
      />

      {/* 3. Plum thread — quiet third color, longest period of all */}
      <motion.div
        aria-hidden
        initial={{ x: "3%", y: "1%", scale: 1.04 }}
        animate={{ x: "-4%", y: "-1%", scale: 1.0 }}
        transition={{
          duration: 72,
          repeat: Infinity,
          repeatType: "reverse",
          ease: DRIFT_EASE,
        }}
        className="absolute -inset-[10%] opacity-50"
        style={{
          background:
            "radial-gradient(circle at 70% 62%, rgba(122, 90, 116, 0.16), transparent 60%)",
          filter: "blur(110px)",
        }}
      />

      {/* 4. Optional video plate — drops in when /public/beats/masthead.mp4 exists */}
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
        animate={{ opacity: videoReady ? 0.42 : 0 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ mixBlendMode: "screen" }}
      />

      {/* 5. Grain — matches the landing's density exactly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* 6. Vignette — matches the landing recipe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 48%, transparent 0%, transparent 42%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* 7. Bottom feather — taller, gentler. Bleeds into the catalogue with
            no visible seam, carrying the editorial silence down into whitespace. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 sm:h-64"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(11,11,11,0.35) 45%, #0B0B0B 100%)",
        }}
      />

      {/* Lockup — same grammar as the hero logo: scale + blur + slow reveal.
          Delays shifted slightly later than on /, giving a "took a breath" feel
          before the typography cascades in. */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 0.35, ease: EASE_SILK }}
          className="relative"
        >
          {/* Light-sweep — same gesture as the landing, quieter. One pass, never again. */}
          <motion.span
            aria-hidden
            initial={{ x: "-130%", opacity: 0 }}
            animate={{ x: "130%", opacity: [0, 0.32, 0] }}
            transition={{
              duration: 2.6,
              delay: 0.9,
              times: [0, 0.5, 1],
              ease: EASE_SILK,
            }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.22) 50%, transparent 62%)",
              mixBlendMode: "overlay",
              borderRadius: "2px",
            }}
          />
          <Logo
            blendOnBg
            className="block h-auto w-auto select-none"
            style={{
              // Smaller than the hero — it's a masthead, not the main stage —
              // but same clamp grammar so it scales with the same character.
              height: "clamp(5.5rem, 18vw, 10.5rem)",
            }}
            alt="Xavier Moreno"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.35, ease: EASE_SILK }}
          className="mt-10 text-[10px] text-silver sm:mt-12 sm:text-[11px]"
          style={{
            letterSpacing: "0.52em",
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          Volume I
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1.7, ease: EASE_SILK }}
          className="mt-6 font-display text-[2.25rem] leading-[1.04] text-bone sm:text-6xl md:text-[4.25rem]"
          style={{ letterSpacing: "-0.012em" }}
        >
          Selected Productions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.7, delay: 2.1, ease: EASE_SILK }}
          className="mt-7 max-w-md text-[12px] leading-relaxed text-bone/50 sm:text-[13.5px]"
          style={{ fontStyle: "italic", letterSpacing: "0.01em" }}
        >
          An archive for the artists who feel everything.
        </motion.p>
      </div>
    </section>
  );
}
