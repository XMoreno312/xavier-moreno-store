"use client";

import { motion } from "framer-motion";

const EASE_SILK = [0.22, 0.6, 0.24, 1];

export default function EnterButton({ onClick, delay = 3, disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay, ease: EASE_SILK }}
      whileTap={{ scale: 0.985 }}
      className={[
        "group relative mt-12 overflow-hidden rounded-full border border-white/15",
        "bg-white/[0.04] px-10 py-3.5 text-[11px] uppercase text-white/85",
        "backdrop-blur-md transition-[border-color,background-color,color,box-shadow] duration-[900ms] ease-out",
        "hover:border-white/40 hover:bg-white/[0.07] hover:text-white",
        "disabled:cursor-default disabled:opacity-60",
        "sm:mt-14 sm:px-12 sm:py-4 sm:text-[12px]",
      ].join(" ")}
      style={{ letterSpacing: "0.4em" }}
    >
      <span className="relative z-10">Enter the World</span>

      {/* Soft warm glow — only appears on hover, slowly */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-[900ms] ease-out group-hover:opacity-100"
        style={{
          boxShadow:
            "0 0 34px 2px rgba(201,168,124,0.28), inset 0 0 22px rgba(201,168,124,0.10)",
        }}
      />

      {/* Subtle inner gradient — stays quiet */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0) 60%)",
        }}
      />
    </motion.button>
  );
}
