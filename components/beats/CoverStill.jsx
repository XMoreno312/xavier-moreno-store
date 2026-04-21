"use client";

import { useState } from "react";

/**
 * Editorial generative still for each release.
 *
 * Each beat has a signature gradient recipe in `config/beats.js`. We layer:
 *   1. A deep base wash (per-release tint)
 *   2. Two slow-drift orbs that compose the beat's emotional color
 *   3. A tight SVG film-grain overlay
 *   4. A radial vignette that pulls the eye to the center
 *   5. Corner metadata (key · BPM) set small caps / tight tracking
 *   6. A minimal serif ornamental mark opposite the metadata
 *
 * If a real cover image exists at `/public/beats/covers/{id}.jpg`, pass it
 * via the `image` prop and the generative layers quietly step aside.
 *
 * Keep this restrained — it is art direction, not a pattern library.
 */
export default function CoverStill({ beat, image, aspect = "portrait" }) {
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

  return (
    <div
      className={[
        "relative w-full overflow-hidden",
        aspectClass,
      ].join(" ")}
      style={{ backgroundColor: base }}
    >
      {/* Real cover art — swaps in the moment public/beats/covers/{id}.jpg exists */}
      {image && imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden
          draggable={false}
          onError={() => setImgOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          {/* Orb A — primary mood light */}
          <div
            aria-hidden
            className="absolute -inset-[8%]"
            style={{
              background: `radial-gradient(circle at ${orbAPos}, ${orbA}, transparent 55%)`,
              filter: "blur(32px)",
            }}
          />
          {/* Orb B — counter weight */}
          <div
            aria-hidden
            className="absolute -inset-[8%] opacity-90"
            style={{
              background: `radial-gradient(circle at ${orbBPos}, ${orbB}, transparent 58%)`,
              filter: "blur(44px)",
            }}
          />
          {/* Highlight line — a single faint diagonal, editorial touch */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background:
                "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)",
              mixBlendMode: "overlay",
            }}
          />
        </>
      )}

      {/* Film grain — always on, even over real photography */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
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
