"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAudioPlayer } from "../AudioPlayerProvider";
import CoverStill from "./CoverStill";

const EASE_SILK = [0.22, 1, 0.36, 1];

function PlayGlyph({ playing }) {
  return playing ? (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="0.8" />
      <rect x="14" y="5" width="4" height="14" rx="0.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
      <path d="M7 5v14l12-7L7 5z" />
    </svg>
  );
}

/**
 * A release — not a product line item. No price. No "add to cart".
 * Clicking anywhere on the title/card routes to /beats/[id] where
 * licensing is surfaced. The little play button on the cover is the
 * only transactional affordance on this page, and it's a preview only.
 */
export default function ProductionCard({ beat, index = 0 }) {
  const { currentBeat, isPlaying, playBeat } = useAudioPlayer();
  const isCurrent = currentBeat?.id === beat.id;
  const playingThis = isCurrent && isPlaying;

  // Alternate a gentle vertical offset on desktop to break the grid rhythm.
  // Keep offsets modest — this is editorial cadence, not art-directed chaos.
  const offsetClass = index % 2 === 1 ? "md:mt-24" : "md:mt-0";

  const handlePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playBeat(beat);
  };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 1.1, ease: EASE_SILK }}
      className={["group relative", offsetClass].join(" ")}
    >
      <Link
        href={`/beats/${beat.id}`}
        aria-label={`${beat.title} — ${beat.genre} production in ${beat.key}`}
        className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-silver/60"
      >
        {/* Cover — generative still, picks up public/beats/covers/{id}.jpg when present */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.012 }}
          transition={{ duration: 1.2, ease: EASE_SILK }}
        >
          <CoverStill
            beat={beat}
            image={`/beats/covers/${beat.id}.jpg`}
            aspect="portrait"
          />

          {/* Preview play — subtle, bottom-center, appears on hover */}
          <button
            onClick={handlePreview}
            aria-label={playingThis ? `Pause preview of ${beat.title}` : `Preview ${beat.title}`}
            className={[
              "absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-bone/25 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-bone/85 backdrop-blur-md transition-opacity duration-700",
              playingThis
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 focus:opacity-100",
            ].join(" ")}
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            <PlayGlyph playing={playingThis} />
            <span>{playingThis ? "Pause" : "Preview"}</span>
          </button>
        </motion.div>

        {/* Meta block — generous breathing room */}
        <div className="mt-6 sm:mt-8">
          {/* Eyebrow: genre, muted silver, small caps */}
          <p
            className="text-[10px] text-silver"
            style={{
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            {beat.genre}
          </p>

          {/* Title — serif display, generous spacing */}
          <h3
            className="mt-3 font-display text-2xl leading-[1.1] text-bone transition-colors duration-700 group-hover:text-bone/95 sm:text-3xl"
            style={{ letterSpacing: "-0.005em" }}
          >
            {beat.title}
          </h3>

          {/* Mood line — single sentence, editorial */}
          {beat.mood ? (
            <p
              className="mt-4 max-w-md text-[13px] leading-relaxed text-bone/55 sm:text-[14px]"
              style={{ fontStyle: "italic" }}
            >
              {beat.mood}
            </p>
          ) : null}

          {/* Metadata — subdued divider-style line */}
          <div className="mt-5 flex items-center gap-3 text-[10px] text-silver/90">
            <span style={{ letterSpacing: "0.28em", textTransform: "uppercase" }}>
              {beat.key}
            </span>
            <span className="h-px w-6 bg-silver/30" aria-hidden />
            <span style={{ letterSpacing: "0.28em", textTransform: "uppercase" }}>
              {beat.bpm} BPM
            </span>
            <span className="h-px w-6 bg-silver/30" aria-hidden />
            <span style={{ letterSpacing: "0.28em", textTransform: "uppercase" }}>
              {beat.genre}
            </span>
          </div>

          {/* Quiet CTA — appears on hover */}
          <div className="mt-6 h-4">
            <span
              className="inline-flex items-center gap-2 text-[10px] text-bone/70 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
              style={{
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              License this production
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
