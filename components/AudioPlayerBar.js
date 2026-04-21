"use client";

import Link from "next/link";
import { useAudioPlayer } from "./AudioPlayerProvider";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Editorial audio bar — concert program, not media player.
 * Thin, quiet, off-white on near-black. No heavy buttons.
 */
export default function AudioPlayerBar() {
  const { currentBeat, isPlaying, progress, duration, togglePlay, seek } =
    useAudioPlayer();

  if (!currentBeat) return null;

  const currentSeconds = progress * duration;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bone/10 bg-stage/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:gap-6 sm:px-8 sm:py-4">
        {/* Minimal play/pause — a thin circular glyph */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-bone/30 text-bone/85 transition-colors duration-500 hover:border-bone hover:text-bone"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
              <rect x="7" y="5" width="3" height="14" rx="0.6" />
              <rect x="14" y="5" width="3" height="14" rx="0.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
              <path d="M7 5v14l12-7L7 5z" />
            </svg>
          )}
        </button>

        {/* Title + meta — editorial ellipsis */}
        <div className="min-w-0 flex-shrink sm:w-64">
          <Link
            href={`/beats/${currentBeat.id}`}
            className="block truncate font-display text-[15px] text-bone transition-colors duration-500 hover:text-bone/80 sm:text-base"
            style={{ letterSpacing: "-0.005em" }}
          >
            {currentBeat.title}
          </Link>
          <p
            className="mt-0.5 truncate text-[10px] text-silver"
            style={{ letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            {currentBeat.genre}
            <span className="mx-2 text-silver/40">·</span>
            {currentBeat.key}
            <span className="mx-2 text-silver/40">·</span>
            {currentBeat.bpm} BPM
          </p>
        </div>

        {/* Scrub line — thin, hidden on small screens */}
        <div className="hidden flex-1 items-center gap-4 sm:flex">
          <span
            className="w-10 text-right text-[10px] tabular-nums text-silver"
            style={{ letterSpacing: "0.1em" }}
          >
            {formatTime(currentSeconds)}
          </span>
          <input
            type="range"
            className="progress flex-1"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={(e) => seek(parseFloat(e.target.value))}
            aria-label="Playback progress"
          />
          <span
            className="w-10 text-[10px] tabular-nums text-silver"
            style={{ letterSpacing: "0.1em" }}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Thin mobile progress — a single hairline at the bar's bottom */}
      <div className="h-px w-full bg-bone/10 sm:hidden">
        <div
          className="h-full bg-bone/70 transition-[width] duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
