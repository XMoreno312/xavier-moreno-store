"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Shared silk curve — matches the rest of the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

/**
 * Cinematic release still.
 *
 * When a real cover image is present at `/public/beats/covers/{id}.jpg`
 * we render it in depth: a softly blurred, slightly up-scaled copy sits
 * beneath a sharp layer to give the artwork a sense of atmosphere, and
 * the sharp layer drifts through a long, slow Ken Burns cycle. A subtle
 * animated grain sits over everything, and a strengthened bottom gradient
 * ensures that the card's text below reads clearly at any size.
 *
 * When there is no image we keep the tuned generative recipe from
 * `config/beats.js` — two slow drift orbs on a tinted base, vignette,
 * grain — and apply the same bottom fade so the card system stays
 * visually coherent.
 *
 * `parallaxX` / `parallaxY` may be passed as framer-motion MotionValues
 * from a parent (ProductionCard) so the interior layers drift a few
 * pixels in response to the cursor — editorial, not arcade-y.
 */
export default function CoverStill({
  beat,
  image,
  aspect = "portrait",
  parallaxX,
  parallaxY,
}) {
  const [imgOk, setImgOk] = useState(Boolean(image));

  const s = beat.signature || {};
  const base = s.base || "#141210";
  const orbA = s.orbA || "rgba(201, 168, 124, 0.35)";
  const orbB = s.orbB || "rgba(96, 80, 72, 0.35)";
  const orbAPos = s.orbAPos || "32% 38%";
  const orbBPos = s.orbBPos || "70% 70%";

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
      ? "aspect-[16/10]"
      : "aspect-[4/5]";

  const hasImage = Boolean(image) && imgOk;

  return (
    <div
      className={[
        "relative w-full overflow-hidden",
        aspectClass,
      ].join(" ")}
      style={{ backgroundColor: base }}
    >
      {hasImage ? (
        <>
          {/* Blurred back layer — atmosphere behind the sharp image */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              x: parallaxX,
              y: parallaxY,
              scale: 1.1,
              opacity: 0.4,
              filter: "blur(40px)",
              willChange: "transform",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              aria-hidden
              draggable={false}
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Sharp foreground layer — slow Ken Burns, parallax-reactive */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{ x: parallaxX, y: parallaxY, willChange: "transform" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.04 }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: [0.45, 0, 0.55, 1],
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                aria-hidden
                draggable={false}
                onError={() => setImgOk(false)}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </>
      ) : (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ x: parallaxX, y: parallaxY, willChange: "transform" }}
        >
          {/* Same Ken Burns language over the generative stack, so both
              variants breathe in the same way */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.04 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            {/* Orb A — primary mood light */}
            <div
              className="absolute -inset-[8%]"
              style={{
                background: `radial-gradient(circle at ${orbAPos}, ${orbA}, transparent 55%)`,
                filter: "blur(32px)",
              }}
            />
            {/* Orb B — counter weight */}
            <div
              className="absolute -inset-[8%] opacity-90"
              style={{
                background: `radial-gradient(circle at ${orbBPos}, ${orbB}, transparent 58%)`,
                filter: "blur(44px)",
              }}
            />
            {/* Highlight line — a single faint diagonal, editorial touch */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)",
                mixBlendMode: "overlay",
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Animated film grain — slow drift of the noise tile gives the
          artwork a living, photographed-under-warm-light quality */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "240px 120px", "0px 0px"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Vignette — pulls the eye to the center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Strengthened bottom fade — makes the title/metadata beneath the
          image read cleanly, even over warm or bright artwork */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Editorial metadata — top-left: key · bpm */}
      <div className="pointer-events-none absolute left-5 top-5 sm:left-6 sm:top-6">
        <p
          className="text-[10px] text-bone/70"
          style={{
            letterSpacing: "0.3em",
            fontVariant: "small-caps",
            textTransform: "uppercase",
          }}
        >
          <span>{beat.key}</span>
          <span className="mx-2 text-bone/35">·</span>
          <span>{beat.bpm} BPM</span>
        </p>
      </div>

      {/* Ornamental mark — bottom-right */}
      <div className="pointer-events-none absolute bottom-5 right-5 sm:bottom-6 sm:right-6">
        <svg
          viewBox="0 0 40 40"
          className="h-5 w-5 text-bone/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          aria-hidden
        >
          <line x1="2" y1="20" x2="14" y2="20" />
          <circle cx="20" cy="20" r="5" />
          <line x1="26" y1="20" x2="38" y2="20" />
        </svg>
      </div>

      {/* Roman numeral volume mark — bottom-left, very low opacity */}
      <div className="pointer-events-none absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
        <p
          className="font-display text-[10px] text-bone/40"
          style={{ letterSpacing: "0.3em" }}
        >
          I
        </p>
      </div>
    </div>
  );
}

// Silk curve kept on export to match the rest of the file family.
export { EASE_SILK };
