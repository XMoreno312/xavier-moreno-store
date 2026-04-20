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

  const handleTierSelect = (tier) => {
    if (tier.id === "exclusive") {
      window.location.href = `mailto:bishopxavier20@gmail.com?subject=Exclusive%20license%20inquiry%20—%20${encodeURIComponent(
        beat.title
      )}`;
      return;
    }
    // TODO: wire to Stripe checkout
    // e.g. fetch("/api/checkout", { method: "POST", body: JSON.stringify({ beatId: beat.id, tier: tier.id })})
    alert(
      `Checkout stub — ${beat.title} / ${tier.name}. Hook this up to Stripe next.`
    );
  };

  return (
    <div
      className={[
        "group rounded-xl border bg-ink/60 p-4 transition-colors sm:p-5",
        isCurrent ? "border-gold/50" : "border-cream/10 hover:border-cream/25",
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
              "absolute inset-0 flex items-center justify-center text-gold transition-opacity",
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
            className="block truncate font-display text-base tracking-wide text-cream transition-colors hover:text-gold sm:text-lg"
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
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-cream/60 hover:text-gold"
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
