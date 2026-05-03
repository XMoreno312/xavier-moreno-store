"use client";

import { motion } from "framer-motion";
import Logo from "../Logo";

// Matches the Hero easing vocabulary — long, silky, no snap.
const EASE_SILK = [0.22, 0.6, 0.24, 1];

export default function LogoAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1.02, filter: "blur(0px)" }}
      transition={{ duration: 1.8, delay: 0.35, ease: EASE_SILK }}
      className="relative"
    >
      {/* Light sweep — passes across the lockup once, restrained */}
      <motion.span
        aria-hidden
        initial={{ x: "-130%", opacity: 0 }}
        animate={{ x: "130%", opacity: [0, 0.55, 0] }}
        transition={{
          duration: 2.6,
          delay: 0.8,
          times: [0, 0.5, 1],
          ease: EASE_SILK,
        }}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.28) 50%, transparent 62%)",
          mixBlendMode: "overlay",
          borderRadius: "2px",
        }}
      />

      {/* Canonical crown + wordmark lockup — same mark the Header uses.
          `blendOnBg` drops the PNG's black backing so only the brush strokes
          and crown render on the cinematic #0B0B0B stage. */}
      <Logo
        blendOnBg
        className="block h-auto w-auto select-none"
        style={{
          // Smooth cinematic scale from mobile → desktop without breakpoint jumps.
          height: "clamp(7rem, 24vw, 15rem)",
        }}
      />
    </motion.div>
  );
}
