"use client";

import { useState } from "react";
import { useAudioPlayer } from "@/components/AudioPlayerProvider";

export default function BeatDetailClient({ beat, tiers }) {
  const { currentBeat, isPlaying, playBeat } = useAudioPlayer();
  const [selectedTier, setSelectedTier] = useState(tiers[0].id);

  const isCurrent = currentBeat?.id === beat.id;
  const playingThis = isCurrent && isPlaying;
  const selected = tiers.find((t) => t.id === selectedTier);

  const handleCheckout = () => {
    if (selected.id === "exclusive") {
      window.location.href = `mailto:bishopxavier20@gmail.com?subject=Exclusive%20license%20inquiry%20—%20${encodeURIComponent(
        beat.title
      )}`;
      return;
    }
    // TODO: wire to Stripe checkout
    alert(`Checkout stub — ${beat.title} / ${selected.name}. Hook this up to Stripe next.`);
  };

  return (
    <article className="mt-6">
      {/* Hero */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div
          className="h-40 w-40 flex-shrink-0 rounded-xl border border-cream/10 sm:h-56 sm:w-56"
          style={{
            background: `linear-gradient(135deg, ${beat.coverColor || "#2a241c"}, #141210)`,
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            {beat.genre}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-cream sm:text-5xl">
            {beat.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-cream/60">
            <span>{beat.key}</span>
            <span className="text-cream/25">·</span>
            <span>{beat.bpm} BPM</span>
            {beat.mood?.length ? (
              <>
                <span className="text-cream/25">·</span>
                <span>{beat.mood.join(" / ")}</span>
              </>
            ) : null}
          </div>

          <button
            onClick={() => playBeat(beat)}
            className="mt-5 inline-flex items-center gap-3 rounded-full border border-gold/60 px-5 py-2 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            {playingThis ? (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pause preview
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                  <path d="M7 5v14l12-7L7 5z" />
                </svg>
                Play preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* License tier selector */}
      <section className="mt-12">
        <h2 className="font-display text-xl tracking-wide text-cream">
          Choose a license
        </h2>
        <p className="mt-1 text-sm text-cream/50">
          All leases come with untagged files. Exclusive removes the beat from the store.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {tiers.map((tier) => {
            const active = tier.id === selectedTier;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={[
                  "rounded-lg border p-4 text-left transition-all",
                  active
                    ? "border-gold bg-gold/5"
                    : "border-cream/10 bg-ink/40 hover:border-cream/25",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/60">
                    {tier.name}
                  </p>
                  <span
                    className={[
                      "h-3 w-3 rounded-full border",
                      active ? "border-gold bg-gold" : "border-cream/30",
                    ].join(" ")}
                  />
                </div>
                <p className="mt-2 font-display text-xl text-cream">
                  {tier.priceLabel}
                </p>
                <p className="mt-1 text-xs text-cream/50">{tier.delivery}</p>
              </button>
            );
          })}
        </div>

        {/* Selected tier details */}
        <div className="mt-6 rounded-lg border border-cream/10 bg-ink/40 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50">
            {selected.name} — what&apos;s included
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            {selected.rights.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-[7px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-gold" />
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            className={[
              "mt-6 w-full rounded-md px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors sm:w-auto",
              selected.id === "exclusive"
                ? "border border-gold/60 text-gold hover:bg-gold hover:text-ink"
                : "bg-gold text-ink hover:bg-cream",
            ].join(" ")}
          >
            {selected.id === "exclusive"
              ? "Contact for exclusive pricing"
              : `Checkout — ${selected.priceLabel}`}
          </button>
        </div>
      </section>
    </article>
  );
}
