"use client";

import { useState } from "react";
import Link from "next/link";
import { useAudioPlayer } from "./AudioPlayerProvider";
import TierDrawer from "./TierDrawer";
import { LICENSE_TIERS } from "@/config/beats";

function PlayIcon({ playing }) {
  return playing ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M7 5v14l12-7L7 5z" />
    </svg>
  );
}

export default function BeatCard({ beat }) {
  const { currentBeat, isPlaying, playBeat } = useAudioPlayer();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isCurrent = currentBeat?.id === beat.id;
  const playingThis = isCurrent && isPlaying;
  const basePrice = LICENSE_TIERS[0].priceLabel;

  const [checkoutBusy, setCheckoutBusy] = useState(false);

  const handleTierSelect = async (tier) => {
    if (tier.id === "exclusive") {
      // Exclusive is contact-only — route to the application form rather
      // than open a mailto. Keeps the inquiry inside the site experience.
      window.location.href = `/work-with-me?beat=${encodeURIComponent(beat.id)}`;
      return;
    }
    if (checkoutBusy) return;
    setCheckoutBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beatId: beat.id, tierId: tier.id }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      window.location.href = data.url;
    } catch (e) {
      setCheckoutBusy(false);
      // eslint-disable-next-line no-alert
      alert("Couldn't start checkout. Please try again or email bishopxavier20@gmail.com.");
    }
  };

  return (
    <div
      className={[
        "group rounded-xl border bg-ink/60 p-4 transition-colors sm:p-5",
        isCurrent ? "border-iris/60 shadow-[0_0_24px_rgba(124,91,216,0.18)]" : "border-cream/10 hover:border-iris/40",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        {/* Play button / cover */}
        <button
          onClick={() => playBeat(beat)}
          aria-label={playingThis ? `Pause ${beat.title}` : `Play ${beat.title}`}
          className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-cream/10 transition-transform hover:scale-[1.02] sm:h-16 sm:w-16"
          style={{
            background: `linear-gradient(135deg, ${beat.coverColor || "#2a241c"}, #141210)`,
          }}
        >
          <span
            className={[
              "absolute inset-0 flex items-center justify-center text-iris-mist transition-opacity",
              playingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            ].join(" ")}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/80">
              <PlayIcon playing={playingThis} />
            </span>
          </span>
        </button>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/beats/${beat.id}`}
            className="block truncate font-display text-base tracking-wide text-cream transition-colors hover:text-iris-mist sm:text-lg"
          >
            {beat.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-cream/50 sm:text-xs">
            <span>{beat.key}</span>
            <span className="text-cream/25">·</span>
            <span>{beat.bpm} BPM</span>
            <span className="text-cream/25">·</span>
            <span className="rounded-full border border-cream/15 px-2 py-[2px] text-[10px] tracking-[0.2em] text-cream/60">
              {beat.genre}
            </span>
          </div>
        </div>

        {/* Price + expand */}
        <div className="flex flex-col items-end gap-2">
          <span className="font-display text-sm text-gold sm:text-base">
            from {basePrice}
          </span>
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            aria-expanded={drawerOpen}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-cream/60 hover:text-iris-mist"
          >
            {drawerOpen ? "Hide" : "License"}
            <svg
              viewBox="0 0 24 24"
              className={[
                "h-3 w-3 transition-transform",
                drawerOpen ? "rotate-180" : "rotate-0",
              ].join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <TierDrawer beat={beat} open={drawerOpen} onSelect={handleTierSelect} />
    </div>
  );
}
