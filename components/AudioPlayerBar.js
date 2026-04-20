"use client";

import Link from "next/link";
import { useAudioPlayer } from "./AudioPlayerProvider";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayerBar() {
  const { currentBeat, isPlaying, progress, duration, togglePlay, seek } =
    useAudioPlayer();

  if (!currentBeat) return null;

  const currentSeconds = progress * duration;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 sm:py-4">
        {/* Cover tile */}
        <div
          className="h-11 w-11 flex-shrink-0 rounded-md border border-cream/10 sm:h-12 sm:w-12"
          style={{
            background: `linear-gradient(135deg, ${currentBeat.coverColor || "#2a241c"}, #141210)`,
          }}
        />

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/beats/${currentBeat.id}`}
            className="block truncate font-display text-sm tracking-wide text-cream hover:text-gold sm:text-base"
          >
            {currentBeat.title}
          </Link>
          <p className="truncate text-[11px] uppercase tracking-[0.18em] text-cream/50 sm:text-xs">
            {currentBeat.genre} · {currentBeat.key} · {currentBeat.bpm} BPM
          </p>
        </div>

        {/* Play/pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-ink sm:h-11 sm:w-11"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M7 5v14l12-7L7 5z" />
            </svg>
          )}
        </button>

        {/* Progress — hidden on small screens to keep bar clean */}
        <div className="hidden flex-1 items-center gap-3 sm:flex">
          <span className="w-10 text-right text-[11px] tabular-nums text-cream/50">
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
          <span className="w-10 text-[11px] tabular-nums text-cream/50">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Thin progress bar shown on mobile */}
      <div className="h-[2px] w-full bg-cream/10 sm:hidden">
        <div
          className="h-full bg-gold transition-[width] duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
