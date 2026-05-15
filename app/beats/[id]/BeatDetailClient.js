"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAudioPlayer } from "@/components/AudioPlayerProvider";
import CoverStill from "@/components/beats/CoverStill";
import { getAdjacentBeat } from "@/lib/collection";

// Same curve as the landing + masthead + cards — one vocabulary.
const EASE_SILK = [0.22, 0.6, 0.24, 1];
// Slightly snappier easing for transport hover states — these are
// utilitarian controls, so the response should feel immediate rather
// than the long, editorial 700ms used elsewhere on the page.
const EASE_SNAP = "cubic-bezier(0.22, 1, 0.36, 1)";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds) || !Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function BeatDetailClient({ beat, tiers, releaseNo }) {
  const router = useRouter();
  const {
    currentBeat,
    isPlaying,
    progress,
    duration,
    loadingBeatId,
    isBeatErrored,
    playBeat,
    prefetchBeat,
    seek,
  } = useAudioPlayer();
  const [selectedTier, setSelectedTier] = useState(tiers[0].id);

  const isCurrent = currentBeat?.id === beat.id;
  const playingThis = isCurrent && isPlaying;
  const loadingThis = loadingBeatId === beat.id;
  const erroredThis = isBeatErrored(beat.id);
  const selected = tiers.find((t) => t.id === selectedTier);

  // Prefetch the signed R2 URL on mount so by the time the visitor taps
  // play, the URL is already in the provider's cache and the play call
  // can run synchronously inside the user-gesture stack — which is what
  // iOS Safari requires to actually start playback.
  useEffect(() => {
    prefetchBeat(beat.id);
  }, [beat.id, prefetchBeat]);

  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const handleLicense = async () => {
    if (selected.id === "exclusive") {
      // Exclusive routes through the application form, not a mailto.
      window.location.href = `/work-with-me?beat=${encodeURIComponent(beat.id)}`;
      return;
    }
    if (checkoutBusy) return;
    setCheckoutBusy(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beatId: beat.id, tierId: selected.id }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      window.location.href = data.url;
    } catch (e) {
      setCheckoutBusy(false);
      setCheckoutError(
        "Couldn't start checkout. Please try again or write directly.",
      );
    }
  };

  const handlePreview = () => {
    if (erroredThis) return;
    playBeat(beat);
  };

  // Click-to-seek on the progress bar. Only meaningful when this beat
  // is loaded — silently no-ops otherwise.
  const handleScrub = (e) => {
    if (!isCurrent || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio);
  };

  // Current playback position in seconds — only meaningful when this
  // beat is the one actually playing in the provider. Used by the
  // prev/replay logic below to decide between "restart" and "navigate".
  const currentTime = isCurrent && duration ? duration * progress : 0;

  // Spotify-style behavior: if we're more than 3 seconds into the
  // current track, the prev button restarts it. Otherwise it steps to
  // the previous production in the catalogue.
  const handlePrev = () => {
    if (isCurrent && currentTime > 3) {
      seek(0);
      return;
    }
    const prev = getAdjacentBeat(beat.id, "prev");
    router.push(`/beats/${prev.id}`);
  };

  const handleNext = () => {
    const next = getAdjacentBeat(beat.id, "next");
    router.push(`/beats/${next.id}`);
  };

  const handleScrollToLicense = () => {
    if (typeof document === "undefined") return;
    const el = document.getElementById("license");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Progress is 0..1 globally, but only reflects this beat when it's
  // current — otherwise the bar should sit empty regardless of what
  // else is playing.
  const visualProgress = isCurrent ? progress : 0;
  const elapsed = isCurrent && duration ? duration * progress : 0;

  const isReplayMode = isCurrent && currentTime > 3;

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

          {/* Prominent preview control — sits just above the licensing
              section so it reads as the "audition this" gesture before
              you commit to a license. Larger play glyph than the card,
              thin bone progress line, scrubbable when audio is loaded.
              Same provider as the cards, so playback coordinates across
              the whole site. */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.1, ease: EASE_SILK }}
            className="mt-16 sm:mt-20"
          >
            <p
              className="text-[10px] text-silver"
              style={{ letterSpacing: "0.52em", textTransform: "uppercase" }}
            >
              Preview
            </p>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-7">
              {/* Transport cluster — prev | play | next */}
              <div className="flex items-center justify-center gap-4 sm:justify-start sm:gap-5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={
                    isReplayMode
                      ? `Restart ${beat.title}`
                      : "Previous production"
                  }
                  className="group flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-bone/30 bg-transparent text-bone/85 transition-[border-color,background-color,color,box-shadow] duration-200 hover:border-bone/60 hover:text-bone hover:shadow-[0_0_18px_rgba(239,233,221,0.10)]"
                  style={{ transitionTimingFunction: EASE_SNAP }}
                >
                  {isReplayMode ? (
                    // Circular replay glyph — communicates "restart this track"
                    // when we're far enough in that prev would be jarring.
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M3 12a9 9 0 1 0 3-6.7" />
                      <polyline points="3 4 3 9 8 9" />
                    </svg>
                  ) : (
                    // Skip-back: vertical bar + triangle pointing left.
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="currentColor"
                      aria-hidden
                    >
                      <rect x="5" y="5" width="2" height="14" rx="0.5" />
                      <path d="M19 5L8 12l11 7V5z" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={erroredThis}
                  aria-label={
                    erroredThis
                      ? `Preview not yet available for ${beat.title}`
                      : playingThis
                        ? `Pause preview of ${beat.title}`
                        : loadingThis
                          ? `Loading preview of ${beat.title}`
                          : `Play preview of ${beat.title}`
                  }
                  title={erroredThis ? "Not yet — coming soon" : undefined}
                  className={[
                    "group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,color,box-shadow,transform] duration-[700ms] sm:h-14 sm:w-14",
                    erroredThis
                      ? "cursor-default border-bone/15 bg-transparent text-bone/35"
                      : "border-bone/30 bg-transparent text-bone hover:border-bone hover:bg-bone hover:text-stage",
                    playingThis && !erroredThis
                      ? "border-bone/60 shadow-[0_0_36px_rgba(239,233,221,0.16)]"
                      : "",
                  ].join(" ")}
                  style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
                >
                  {/* Pulsing ring while playing — gentle bone breath */}
                  {playingThis && !erroredThis ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-[-6px] rounded-full"
                      style={{
                        boxShadow: "0 0 0 1px rgba(239,233,221,0.22)",
                        animation:
                          "xm-detail-pulse 2.4s cubic-bezier(0.22, 0.6, 0.24, 1) infinite",
                      }}
                    />
                  ) : null}

                  {loadingThis ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 animate-spin sm:h-[18px] sm:w-[18px]"
                      fill="none"
                      aria-hidden
                      style={{ animationDuration: "1.4s" }}
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeOpacity="0.85"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : playingThis ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                      fill="currentColor"
                      aria-hidden
                    >
                      <rect x="7" y="5" width="3.2" height="14" rx="0.6" />
                      <rect x="13.8" y="5" width="3.2" height="14" rx="0.6" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 translate-x-[1px] sm:h-[18px] sm:w-[18px]"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M7 5v14l12-7L7 5z" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next production"
                  className="group flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-bone/30 bg-transparent text-bone/85 transition-[border-color,background-color,color,box-shadow] duration-200 hover:border-bone/60 hover:text-bone hover:shadow-[0_0_18px_rgba(239,233,221,0.10)]"
                  style={{ transitionTimingFunction: EASE_SNAP }}
                >
                  {/* Skip-forward: triangle pointing right + vertical bar. */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M5 5l11 7L5 19V5z" />
                    <rect x="17" y="5" width="2" height="14" rx="0.5" />
                  </svg>
                </button>
              </div>

              {/* Progress strip + time readout. Thin, bone-tinted, and
                  click-to-scrub. Reads "Not yet — coming soon" when the
                  master hasn't been uploaded to R2. */}
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <button
                  type="button"
                  onClick={handleScrub}
                  disabled={!isCurrent || !duration || erroredThis}
                  aria-label="Seek preview"
                  className={[
                    "relative h-px w-full cursor-pointer bg-bone/15 transition-colors duration-[700ms]",
                    !isCurrent || !duration || erroredThis
                      ? "cursor-default"
                      : "hover:bg-bone/25",
                  ].join(" ")}
                  style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
                >
                  <span
                    aria-hidden
                    className="block h-px bg-bone/85 transition-[width] duration-200 ease-linear"
                    style={{ width: `${visualProgress * 100}%` }}
                  />
                </button>

                {/* Status + time + inline license CTA.
                    Mobile: status row on top, then time, then CTA below.
                    Desktop: status left, time + CTA grouped on the right. */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                  <span
                    className="text-[10px] text-silver/70"
                    style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}
                  >
                    {erroredThis
                      ? "Not Yet · Coming Soon"
                      : loadingThis
                        ? "Loading"
                        : playingThis
                          ? "Now Playing"
                          : isCurrent
                            ? "Paused"
                            : "Tap Play"}
                  </span>

                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-silver/60">
                      {formatTime(elapsed)} / {isCurrent ? formatTime(duration) : "0:00"}
                    </span>

                    <button
                      type="button"
                      onClick={handleScrollToLicense}
                      aria-label="Jump to licensing options"
                      className="border border-[rgba(239,233,221,0.3)] bg-[rgba(239,233,221,0.04)] px-4 py-2 text-[10px] text-bone transition-[border-color,background-color,box-shadow] duration-200 hover:border-[rgba(239,233,221,0.6)] hover:bg-[rgba(239,233,221,0.07)] hover:shadow-[0_0_18px_rgba(239,233,221,0.10)]"
                      style={{
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        transitionTimingFunction: EASE_SNAP,
                      }}
                    >
                      License this production
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Licensing block — more breathing room, quieter dividers */}
          <motion.section
            id="license"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, ease: EASE_SILK }}
            className="mt-24 scroll-mt-24 sm:mt-28"
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
              disabled={checkoutBusy}
              className="group mt-14 inline-flex items-center gap-4 border border-bone/25 px-7 py-4 text-[10px] text-bone transition-colors duration-[700ms] hover:border-bone hover:bg-bone hover:text-stage disabled:cursor-default disabled:opacity-60"
              style={{
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)",
              }}
            >
              {checkoutBusy
                ? "Opening Checkout…"
                : selected.id === "exclusive"
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
            {checkoutError ? (
              <p className="mt-5 max-w-md text-[12px] text-silver">
                {checkoutError}
              </p>
            ) : null}

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

      {/* Pulse keyframes for the play button ring */}
      <style jsx>{`
        @keyframes xm-detail-pulse {
          0% {
            box-shadow: 0 0 0 1px rgba(239, 233, 221, 0.22);
            opacity: 0.85;
          }
          50% {
            box-shadow: 0 0 32px rgba(239, 233, 221, 0.14);
            opacity: 1;
          }
          100% {
            box-shadow: 0 0 0 1px rgba(239, 233, 221, 0.22);
            opacity: 0.85;
          }
        }
      `}</style>
    </motion.article>
  );
}
