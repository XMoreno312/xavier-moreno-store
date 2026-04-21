"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAudioPlayer } from "@/components/AudioPlayerProvider";
import CoverStill from "@/components/beats/CoverStill";

const EASE_SILK = [0.22, 1, 0.36, 1];

export default function BeatDetailClient({ beat, tiers }) {
  const { currentBeat, isPlaying, playBeat } = useAudioPlayer();
  const [selectedTier, setSelectedTier] = useState(tiers[0].id);

  const isCurrent = currentBeat?.id === beat.id;
  const playingThis = isCurrent && isPlaying;
  const selected = tiers.find((t) => t.id === selectedTier);

  const handleLicense = () => {
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
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE_SILK }}
      className="mt-10 sm:mt-14"
    >
      {/* Masthead of the release */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] md:gap-16">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE_SILK }}
          className="md:sticky md:top-28 md:self-start"
        >
          <CoverStill
            beat={beat}
            image={`/beats/covers/${beat.id}.jpg`}
            aspect="portrait"
          />
        </motion.div>

        {/* Info */}
        <div className="flex flex-col">
          <p
            className="text-[10px] text-silver"
            style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
          >
            Volume I — {beat.genre}
          </p>

          <h1
            className="mt-5 font-display text-4xl leading-[1.05] text-bone sm:text-6xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            {beat.title}
          </h1>

          {beat.mood ? (
            <p
              className="mt-6 max-w-md text-[14px] leading-relaxed text-bone/65 sm:text-[15px]"
              style={{ fontStyle: "italic" }}
            >
              {beat.mood}
            </p>
          ) : null}

          {/* Metadata row */}
          <div className="mt-8 flex items-center gap-4 text-[10px] text-silver">
            <span style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {beat.key}
            </span>
            <span className="h-px w-6 bg-silver/30" aria-hidden />
            <span style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {beat.bpm} BPM
            </span>
            <span className="h-px w-6 bg-silver/30" aria-hidden />
            <span style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {beat.genre}
            </span>
          </div>

          {/* Preview button — same editorial language as the bar */}
          <button
            onClick={() => playBeat(beat)}
            className="mt-10 inline-flex items-center gap-3 self-start border-b border-bone/30 pb-2 text-[10px] text-bone transition-colors duration-500 hover:border-bone hover:text-bone"
            style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            {playingThis ? (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <rect x="7" y="5" width="3" height="14" rx="0.6" />
                  <rect x="14" y="5" width="3" height="14" rx="0.6" />
                </svg>
                Pause preview
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="M7 5v14l12-7L7 5z" />
                </svg>
                Play preview
              </>
            )}
          </button>

          {/* Licensing block */}
          <section className="mt-16">
            <p
              className="text-[10px] text-silver"
              style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
            >
              Licensing
            </p>
            <h2
              className="mt-4 font-display text-2xl text-bone sm:text-3xl"
              style={{ letterSpacing: "-0.005em" }}
            >
              Choose a license.
            </h2>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-bone/55">
              All leases are delivered untagged. An exclusive removes the
              production from the catalogue and transfers master use rights.
            </p>

            {/* Tier selector — editorial, not storefront */}
            <div className="mt-8 divide-y divide-bone/10 border-y border-bone/10">
              {tiers.map((tier) => {
                const active = tier.id === selectedTier;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className="group flex w-full items-center justify-between py-5 text-left transition-colors duration-500"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className={[
                          "h-2 w-2 rounded-full border transition-all duration-500",
                          active
                            ? "border-bone bg-bone"
                            : "border-bone/30 bg-transparent group-hover:border-bone/60",
                        ].join(" ")}
                      />
                      <span>
                        <span
                          className="block text-[11px] text-bone"
                          style={{
                            letterSpacing: "0.32em",
                            textTransform: "uppercase",
                          }}
                        >
                          {tier.name}
                        </span>
                        <span className="mt-1 block text-[12px] text-silver">
                          {tier.delivery}
                        </span>
                      </span>
                    </div>
                    <span
                      className="font-display text-[18px] text-bone"
                      style={{ letterSpacing: "-0.005em" }}
                    >
                      {tier.priceLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* What's included */}
            <div className="mt-8">
              <p
                className="text-[10px] text-silver"
                style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}
              >
                {selected.name} — Included
              </p>
              <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-bone/80">
                {selected.rights.map((r) => (
                  <li key={r} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-[10px] h-px w-3 flex-shrink-0 bg-silver/50"
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary CTA — editorial, single line */}
            <button
              onClick={handleLicense}
              className="group mt-10 inline-flex items-center gap-4 border border-bone/30 px-6 py-4 text-[10px] text-bone transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-stage"
              style={{ letterSpacing: "0.35em", textTransform: "uppercase" }}
            >
              {selected.id === "exclusive"
                ? "Inquire for Exclusive"
                : "License This Production"}
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
              >
                →
              </span>
            </button>

            <p className="mt-6 max-w-md text-[11px] text-silver/80">
              Prefer to talk first?{" "}
              <a
                href={`mailto:bishopxavier20@gmail.com?subject=${encodeURIComponent(
                  beat.title + " — licensing inquiry"
                )}`}
                className="underline decoration-silver/40 underline-offset-4 transition-colors duration-500 hover:text-bone hover:decoration-bone/60"
              >
                Write directly.
              </a>
            </p>
          </section>
        </div>
      </div>
    </motion.article>
  );
}
