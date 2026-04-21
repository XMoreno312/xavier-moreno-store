"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundVisual from "./BackgroundVisual";
import LogoAnimation from "./LogoAnimation";
import EnterButton from "./EnterButton";

// Long, restrained easings. Nothing snappy lives here on purpose.
const EASE_SILK = [0.22, 0.6, 0.24, 1];

export default function Hero() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef(null);

  // Prefetch /beats so the transition lands instantly after the fade.
  useEffect(() => {
    router.prefetch("/beats");
  }, [router]);

  // Try to start the ambient loop (muted) — browsers permit muted autoplay.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const handleReady = () => setHasAudio(true);
    const handleError = () => setHasAudio(false);
    a.addEventListener("canplay", handleReady);
    a.addEventListener("error", handleError);
    a.play().catch(() => {
      /* autoplay blocked — user can still unmute manually */
    });
    return () => {
      a.removeEventListener("canplay", handleReady);
      a.removeEventListener("error", handleError);
    };
  }, []);

  // Navigate only after the exit fade completes.
  useEffect(() => {
    if (!isExiting) return;
    const t = setTimeout(() => router.push("/beats"), 1100);
    return () => clearTimeout(t);
  }, [isExiting, router]);

  const handleEnter = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {
        /* noop */
      }
    }
    setIsExiting(true);
  }, []);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    const next = !a.muted;
    a.muted = next;
    setMuted(next);
    if (!next) {
      a.play().catch(() => {});
    }
  }, []);

  return (
    <div
      // Outer wrapper is fully opaque and never fades — guarantees no
      // header/body bg peeks through during the intro fade-in. Sits in
      // normal flow so the bio section below it becomes scrollable.
      className="relative z-40 h-[100svh] w-full overflow-hidden bg-[#0B0B0B]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{
          duration: isExiting ? 1.1 : 1.6,
          ease: EASE_SILK,
        }}
        className="absolute inset-0"
      >
        {/* Cinematic background: parallax layers + optional video drop-in */}
        <BackgroundVisual />

        {/* Film-grain overlay — very subtle */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
          }}
        />

        {/* Vignette — pulls the eye center */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Content column */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <LogoAnimation />

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.6,
              delay: 2.2,
              ease: EASE_SILK,
            }}
            className="mt-7 max-w-md text-[10.5px] uppercase text-white/55 sm:mt-9 sm:text-[12px]"
            style={{
              fontWeight: 200,
              letterSpacing: "0.42em",
              lineHeight: 1.8,
            }}
          >
            Productions for artists who feel everything
          </motion.p>

          <EnterButton onClick={handleEnter} delay={3.3} disabled={isExiting} />
        </div>

        {/* Ambient audio — muted by default; tasteful unmute toggle */}
        <audio
          ref={audioRef}
          src="/hero/ambient.mp3"
          loop
          muted
          preload="auto"
          playsInline
        />

        {/* Scroll hint — subtle "scroll" text + down arrow, centered bottom.
            Users didn't know there was anything below the fold. */}
        <ScrollHint />

        <motion.button
          type="button"
          aria-label={muted ? "Unmute ambient" : "Mute ambient"}
          onClick={toggleMute}
          initial={{ opacity: 0 }}
          animate={{ opacity: hasAudio ? 0.55 : 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 4, ease: EASE_SILK }}
          className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 backdrop-blur-md sm:bottom-8 sm:right-8 sm:h-11 sm:w-11"
          style={{ pointerEvents: hasAudio ? "auto" : "none" }}
        >
          {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
        </motion.button>
      </motion.div>
    </div>
  );
}

function ScrollHint() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      transition={{ duration: 1.6, delay: 4.2, ease: EASE_SILK }}
      className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 sm:bottom-7"
    >
      <motion.div
        className="flex flex-col items-center gap-2 text-white/70"
        animate={{ y: [0, 6, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span
          className="uppercase text-[9px] sm:text-[10px]"
          style={{
            fontWeight: 300,
            letterSpacing: "0.42em",
          }}
        >
          Scroll
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v14" />
          <path d="m6 14 6 6 6-6" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function VolumeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}
