"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAudioPlayer } from "../AudioPlayerProvider";
import CoverStill from "./CoverStill";

// Single cinematic curve — landing → masthead → cards all share this.
const EASE_SILK = [0.22, 0.6, 0.24, 1];

// Composed offsets — not an alternating pattern. The rhythm has variation,
// so the grid reads as intentionally laid-out rather than algorithmic.
const OFFSETS = ["md:mt-0", "md:mt-28", "md:mt-8", "md:mt-32", "md:mt-4"];

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
export default function ProductionCard({ beat, index = 0, releaseNo, showLicenseCta = false }) {
  const { currentBeat, isPlaying, playBeat } = useAudioPlayer();
  const isCurrent = currentBeat?.id === beat.id;
  const playingThis = isCurrent && isPlaying;

  const offsetClass = OFFSETS[index % OFFSETS.length];

  const handlePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playBeat(beat);
  };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 1.2, ease: EASE_SILK }}
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
          whileHover={{ scale: 1.008 }}
          transition={{ duration: 1.4, ease: EASE_SILK }}
        >
          <CoverStill
            beat={beat}
            image={`/beats/covers/${beat.id}.jpg`}
            aspect="portrait"
          />

          {/* Soft overlay — fades in on hover before the CTA appears */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/0 opacity-0 transition-opacity duration-[800ms] group-hover:bg-black/15 group-hover:opacity-100"
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
          />

          {/* Preview play — center, appears on hover, deliberate fade */}
          <button
            onClick={handlePreview}
            aria-label={playingThis ? `Pause preview of ${beat.title}` : `Preview ${beat.title}`}
            className={[
              "absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-bone/25 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-bone/85 backdrop-blur-md transition-opacity duration-[800ms]",
              playingThis
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 focus:opacity-100",
            ].join(" ")}
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
          >
            <PlayGlyph playing={playingThis} />
            <span>{playingThis ? "Pause" : "Preview"}</span>
          </button>
        </motion.div>

        {/* Meta block — more generous breathing room than before */}
        <div className="mt-8 sm:mt-10">
          {/* Catalog number — editorial mark, sits quietly above the genre */}
          {releaseNo ? (
            <div className="mb-5 flex items-center gap-3">
              <span
                className="text-[9.5px] text-silver/75"
                style={{
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  fontVariant: "small-caps",
                }}
              >
                № {releaseNo}
              </span>
              <span className="h-px w-4 bg-silver/20" aria-hidden />
              <span
                className="text-[9.5px] text-silver/60"
                style={{ letterSpacing: "0.42em", textTransform: "uppercase" }}
              >
                {beat.genre}
              </span>
            </div>
          ) : (
            <p
              className="text-[10px] text-silver"
              style={{
                letterSpacing: "0.42em",
                textTransform: "uppercase",
              }}
            >
              {beat.genre}
            </p>
          )}

          {/* Title — release-poster scale, confident, refined tracking */}
          <h3
            className="font-display text-[1.9rem] leading-[1.04] text-bone transition-colors duration-[800ms] group-hover:text-white sm:text-[2.35rem]"
            style={{ letterSpacing: "-0.012em" }}
          >
            {beat.title}
          </h3>

          {/* Mood line — plays second fiddle: smaller, lighter, italic */}
          {beat.mood ? (
            <p
              className="mt-5 max-w-md text-[12.5px] leading-[1.65] text-bone/45 sm:text-[13px]"
              style={{ fontStyle: "italic", letterSpacing: "0.005em" }}
            >
              {beat.mood}
            </p>
          ) : null}

          {/* Metadata row — even more subdued, thinner divider, smaller type */}
          <div className="mt-7 flex items-center gap-3 text-[9.5px] text-silver/65">
            <span style={{ letterSpacing: "0.34em", textTransform: "uppercase" }}>
              {beat.key}
            </span>
            <span className="h-px w-5 bg-silver/20" aria-hidden />
            <span style={{ letterSpacing: "0.34em", textTransform: "uppercase" }}>
              {beat.bpm} BPM
            </span>
          </div>

          {/* Quiet CTA — always visible on the homepage variant, hover-only
              in the full catalogue so the /beats grid still breathes. */}
          <div className="mt-7 h-4">
            <span
              className={[
                "inline-flex items-center gap-2 text-[10px] text-bone/75 transition-opacity duration-[800ms]",
                showLicenseCta
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
              ].join(" ")}
              style={{
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)",
              }}
            >
              License This Production
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
