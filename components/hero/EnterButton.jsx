"use client";

import { motion } from "framer-motion";

const EASE_SILK = [0.22, 0.6, 0.24, 1];

/**
 * Hero CTA — restyled as a proper button. Bone-tinted hairline border,
 * very subtle bone wash background, generous padding, letter-spaced
 * label. Hover deepens the border and adds a soft warm glow.
 *
 * Lowercase 'production' is intentional per spec.
 */
export default function EnterButton({
  onClick,
  delay = 3,
  disabled = false,
  label = "License a production",
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay, ease: EASE_SILK }}
      whileTap={{ scale: 0.992 }}
      aria-label={`${label} — enter the beats catalog`}
      className={[
        "group relative mt-10 inline-block self-start font-display text-bone",
        "border border-bone/30 bg-bone/[0.04]",
        "transition-[border-color,background-color,box-shadow,color] duration-[700ms] ease-out",
        "hover:border-bone/60 hover:bg-bone/[0.08]",
        "hover:shadow-[0_0_40px_rgba(239,233,221,0.15)]",
        "disabled:cursor-default disabled:opacity-70",
        "sm:mt-12",
      ].join(" ")}
      style={{
        padding: "14px 28px",
        fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)",
        fontWeight: 400,
        letterSpacing: "0.15em",
        lineHeight: 1.15,
        textAlign: "center",
      }}
    >
      {label}
    </motion.button>
  );
}
