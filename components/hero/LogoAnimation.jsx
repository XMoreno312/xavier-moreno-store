"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CrownLogo from "../CrownLogo";

// Matches the Hero easing vocabulary — long, silky, no snap.
const EASE_SILK = [0.22, 0.6, 0.24, 1];

export default function LogoAnimation() {
  // Try to load a drop-in /hero/logo.svg silently in the background.
  // If it resolves, swap the placeholder out. If not, the placeholder stays.
  const [customLoaded, setCustomLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setCustomLoaded(true);
    img.onerror = () => setCustomLoaded(false);
    img.src = "/hero/logo.svg";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1.02, filter: "blur(0px)" }}
      transition={{ duration: 1.8, delay: 0.35, ease: EASE_SILK }}
      className="relative"
    >
      {/* Light sweep — passes across the logo once, restrained */}
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

      {customLoaded ? (
        // User dropped in a custom logo — show it at its intended size.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hero/logo.svg"
          alt="Xavier Moreno"
          className="h-20 w-auto select-none sm:h-24"
          draggable={false}
        />
      ) : (
        <PlaceholderWordmark />
      )}
    </motion.div>
  );
}

function PlaceholderWordmark() {
  return (
    <div className="flex select-none flex-col items-center gap-4 sm:gap-5">
      <CrownLogo className="h-[18px] w-auto text-white/75 sm:h-[22px]" />
      <h1
        className="font-display text-white"
        style={{
          fontWeight: 300,
          letterSpacing: "0.34em",
          // Responsive sizing without jumping — clamp hits the A24 sweet spot.
          fontSize: "clamp(1.75rem, 6.2vw, 3.25rem)",
          lineHeight: 1,
          // A whisper of warm tint on the type so it sits inside the frame
          textShadow: "0 0 30px rgba(201,168,124,0.08)",
        }}
      >
        XAVIER&nbsp;MORENO
      </h1>
      <span
        aria-hidden
        className="block h-px w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent sm:w-16"
      />
    </div>
  );
}
