"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Matches the rest of the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, amount: 0.35 };

/**
 * Quiet deeper moment — a breath after the bio collage before the site ends.
 * Just bokeh texture, a heavy dark wash, and one line.
 */
export default function QuietMoment() {
  return (
    <section
      aria-label="Every production starts here"
      className="relative w-full overflow-hidden bg-stage text-bone"
      style={{ minHeight: "70vh", height: "70vh" }}
    >
      {/* Bokeh background — slow drift */}
      <motion.div
        initial={{ scale: 1.04, x: "-1%" }}
        animate={{ scale: 1.1, x: "1%" }}
        transition={{
          duration: 42,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.45, 0, 0.55, 1],
        }}
        className="absolute inset-0"
      >
        <Image
          src="/photos/bokeh.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.7) contrast(1.02)" }}
        />
      </motion.div>

      {/* Heavy dark radial — crushes the edges, lets a warm center breathe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0.8) 55%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Top + bottom seams — blend into the bio section above and the footer below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 15%, rgba(0,0,0,0) 85%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* The one line */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.8, ease: EASE_SILK }}
          className="font-display italic text-bone"
          style={{
            fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.005em",
            textAlign: "center",
            textShadow: "0 2px 24px rgba(0,0,0,0.65)",
          }}
        >
          Every production starts here.
        </motion.p>
      </div>
    </section>
  );
}
