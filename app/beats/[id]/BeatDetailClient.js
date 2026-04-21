"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAudioPlayer } from "@/components/AudioPlayerProvider";
import CoverStill from "@/components/beats/CoverStill";

// Same curve as the landing + masthead + cards — one vocabulary.
const EASE_SILK = [0.22, 0.6, 0.24, 1];

export default function BeatDetailClient({ beat, tiers, releaseNo }) {
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.3, ease: EASE_SILK }}
      className="mt-16 sm:mt-24"
    >
      {/* Masthead of the release */}
      <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] md:gap-20">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.995, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, delay: 0.15, ease: EASE_SILK }}
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
          {/* Eyebrow — catalog number + volume + genre, editorial */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.25, ease: EASE_SILK }}
            className="flex items-center gap-3"
          >
            {releaseNo ? (
              <>
                <span
                  className="text-[9.5px] text-silver/75"
                  style={{
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    fontVariant: "small-caps",
                  }}
                >
                  № {releaseNo}
                </span>
                <span className="h-px w-4 bg-silver/25" aria-hidden />
              </>
            ) : null}
            <span
              className="text-[10px] text-silver"
              style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
            >
              Volume I · {beat.genre}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.7, delay: 0.45, ease: EASE_SILK }}
            className="mt-6 font-display text-[2.6rem] leading-[1.02] text-bone sm:text-[4rem]"
            style={{ letterSpacing: "-0.015em" }}
          >
            {beat.title}
          </motion.h1>

          {beat.mood ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.7, ease: EASE_SILK }}
              className="mt-7 max-w-md text-[13.5px] leading-[1.65] text-bone/55 sm:text-[14.5px]"
              style={{ fontStyle: "italic", letterSpacing: "0.005em" }}
            >
              {beat.mood}
            </motion.p>
          ) : null}

          {/* Metadata row — subdued, thinner dividers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.9, ease: EASE_SILK }}
            className="mt-10 flex items-center gap-3 text-[10px] text-silver/80"
          >
            <span style={{ letterSpacing: "0.36em", textTransform: "uppercase" }}>
              {beat.key}
            </span>
            <span className="h-px w-5 bg-silver/25" aria-hidden />
            <span style={{ letterSpacing: "0.36em", textTransform: "uppercase" }}>
              {beat.bpm} BPM
            </span>
            <span className="h-px w-5 bg-silver/25" aria-hidden />
            <span style={{ letterSpacing: "0.36em", textTransform: "uppercase" }}>
              {beat.genre}
            </span>
          </motion.div>

          {/* Preview — editorial line, not a media-player button */}
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.1, ease: EASE_SILK }}
            onClick={() => playBeat(beat)}
            className="group mt-12 inline-flex items-center gap-4 self-start pb-2 text-[10px] text-bone/85 transition-colors duration-[700ms] hover:text-bone"
            style={{
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)",
            }}
          >
            {playingThis ? (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <rect x="7" y="5" width="3" height="14" rx="0.6" />
                  <rect x="14" y="5" width="3" height="14" rx="0.6" />
                </svg>
                Pause Preview
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="M7 5v14l12-7L7 5z" />
                </svg>
                Play Preview
              </>
            )}
            <span
              aria-hidden
              className="inline-block h-px w-6 bg-bone/30 transition-all duration-[700ms] group-hover:w-10 group-hover:bg-bone/70"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
            />
          </motion.button>

          {/* Licensing block — more breathing room, quieter dividers */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, ease: EASE_SILK }}
            className="mt-24 sm:mt-28"
          >
            <p
              className="text-[10px] text-silver"
              style={{ letterSpacing: "0.52em", textTransform: "uppercase" }}
            >
              Licensing
            </p>
            <h2
              className="mt-5 font-display text-[1.7rem] leading-[1.1] text-bone sm:text-[2.1rem]"
              style={{ letterSpacing: "-0.008em" }}
            >
              Choose a license.
            </h2>
            <p className="mt-5 max-w-md text-[13px] leading-[1.7] text-bone/55">
              All leases are delivered untagged. An exclusive removes the
              production from the catalogue and transfers master use rights.
            </p>

            {/* Tier selector — editorial, not storefront. More vertical rhythm,
                quieter dividers (bone/5 instead of bone/10). */}
            <div className="mt-10 divide-y divide-bone/5 border-y border-bone/5">
              {tiers.map((tier) => {
                const active = tier.id === selectedTier;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className="group flex w-full items-center justify-between py-7 text-left transition-colors duration-[700ms]"
                    style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        aria-hidden
                        className={[
                          "h-[7px] w-[7px] rounded-full border transition-all duration-[700ms]",
                          active
                            ? "border-bone bg-bone"
                            : "border-bone/25 bg-transparent group-hover:border-bone/55",
                        ].join(" ")}
                      />
                      <span>
                        <span
                          className="block text-[11px] text-bone"
                          style={{
                            letterSpacing: "0.36em",
                            textTransform: "uppercase",
                          }}
                        >
                          {tier.name}
                        </span>
                        <span className="mt-1.5 block text-[11.5px] text-silver/85">
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
            <div className="mt-10">
              <p
                className="text-[10px] text-silver/85"
                style={{ letterSpacing: "0.36em", textTransform: "uppercase" }}
              >
                {selected.name} — Included
              </p>
              <ul className="mt-5 space-y-4 text-[13.5px] leading-[1.65] text-bone/80">
                {selected.rights.map((r) => (
                  <li key={r} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-[10px] h-px w-3 flex-shrink-0 bg-silver/40"
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary CTA — editorial, single line, slower transition */}
            <button
              onClick={handleLicense}
              className="group mt-14 inline-flex items-center gap-4 border border-bone/25 px-7 py-4 text-[10px] text-bone transition-colors duration-[700ms] hover:border-bone hover:bg-bone hover:text-stage"
              style={{
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)",
              }}
            >
              {selected.id === "exclusive"
                ? "Inquire for Exclusive"
                : "License This Production"}
              <span
                aria-hidden
                className="transition-transform duration-[700ms] group-hover:translate-x-1"
                style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
              >
                →
              </span>
            </button>

            <p className="mt-7 max-w-md text-[11px] text-silver/75">
              Prefer to talk first?{" "}
              <a
                href={`mailto:bishopxavier20@gmail.com?subject=${encodeURIComponent(
                  beat.title + " — licensing inquiry"
                )}`}
                className="underline decoration-silver/30 underline-offset-4 transition-colors duration-[700ms] hover:text-bone hover:decoration-bone/60"
              >
                Write directly.
              </a>
            </p>
          </motion.section>
        </div>
      </div>
    </motion.article>
  );
}
