"use client";

import { motion } from "framer-motion";

const EASE_SILK = [0.22, 0.6, 0.24, 1];

/**
 * Hero CTA — serif, bone, editorial. Not a pill, not uppercase.
 * The period matters. The underline animates in on hover.
 * Still fires onClick so the hero can run its exit fade before navigating.
 */
export default function EnterButton({ onClick, delay = 3, disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay, ease: EASE_SILK }}
      whileTap={{ scale: 0.992 }}
      aria-label="Welcome to my collection — enter the beats catalog"
      className={[
        "group relative mt-12 inline-block font-display text-bone",
        "transition-colors duration-[900ms] ease-out",
        "hover:text-white",
        "disabled:cursor-default disabled:opacity-70",
        "sm:mt-14",
      ].join(" ")}
      style={{
        fontSize: "clamp(1.35rem, 2.1vw, 1.9rem)",
        fontWeight: 400,
        letterSpacing: "-0.005em",
        lineHeight: 1.15,
      }}
    >
      <span className="relative inline-block">
        Welcome to my collection.
        {/* Hairline underline — grows in on hover, stays in our palette */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 bottom-[-6px] h-px origin-left scale-x-0 bg-bone/80 transition-transform duration-[900ms] ease-out group-hover:scale-x-100"
        />
      </span>

      {/* Soft warm halo — only on hover, very slow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[-1.2em] inset-y-[-0.5em] rounded-full opacity-0 transition-opacity duration-[1200ms] ease-out group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(201,168,124,0.12), transparent 70%)",
          filter: "blur(14px)",
          zIndex: -1,
        }}
      />
    </motion.button>
  );
}
