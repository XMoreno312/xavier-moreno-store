"use client";

import { motion } from "framer-motion";

// Same editorial curve as the rest of the hero.
const EASE_SILK = [0.22, 0.6, 0.24, 1];

/**
 * Single primary CTA below the "Welcome to my collection." tagline.
 * Minimal bone-on-dark: hairline border, letter-spaced uppercase label,
 * a soft warm glow on hover. Routes to /beats via the hero's exit fade
 * so the transition stays cinematic — no jarring instant navigation
 * away from a page this atmospheric.
 */
export default function HeroCTA({ onExit, disabled = false, delay = 3.8 }) {
  const trigger = (e) => {
    e.preventDefault();
    if (disabled) return;
    onExit?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay, ease: EASE_SILK }}
      className="mt-8 flex justify-center sm:mt-10"
    >
      <button
        type="button"
        onClick={trigger}
        disabled={disabled}
        aria-label="License a production"
        className={[
          "group relative inline-flex items-center justify-center",
          "px-7 py-3 text-[10.5px] text-bone/90 sm:text-[11px]",
          "border border-bone/20 bg-transparent",
          "transition-all duration-[700ms] ease-out",
          "hover:text-bone hover:border-bone/45",
          "disabled:cursor-default disabled:opacity-60",
        ].join(" ")}
        style={{
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          fontWeight: 300,
          boxShadow: "0 0 0 rgba(239,233,221,0)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 28px rgba(239,233,221,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 rgba(239,233,221,0)";
        }}
      >
        License a Production
      </button>
    </motion.div>
  );
}
