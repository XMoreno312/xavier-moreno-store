"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  if (!currentBeat) return null;

  const currentSeconds = progress * duration;

  // Mirrors the inline CTA on the beat detail page. If the visitor is
  // already on the current beat's page, smooth-scroll to the licensing
  // section in place. Otherwise route to that page with the hash so
  // the browser scrolls after the navigation settles.
  const handleLicense = () => {
    const targetPath = `/beats/${currentBeat.id}`;
    if (pathname === targetPath) {
      if (typeof document === "undefined") return;
      const el = document.getElementById("license");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`${targetPath}#license`);
  };

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

        {/* Inline license CTA — same vocabulary as the beat detail
            page. Compact label on mobile so it still fits next to the
            title; full label once the scrub line appears. */}
        <button
          type="button"
          onClick={handleLicense}
          aria-label={`Jump to licensing options for ${currentBeat.title}`}
          className="flex-shrink-0 border border-[rgba(239,233,221,0.3)] bg-[rgba(239,233,221,0.04)] px-3 py-1.5 text-[10px] text-bone transition-[border-color,background-color,box-shadow] duration-200 hover:border-[rgba(239,233,221,0.6)] hover:bg-[rgba(239,233,221,0.07)] hover:shadow-[0_0_18px_rgba(239,233,221,0.10)] sm:px-4 sm:py-2"
          style={{
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <span className="sm:hidden">License</span>
          <span className="hidden sm:inline">License this production</span>
        </button>
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
