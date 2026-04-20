"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const AudioPlayerContext = createContext(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer must be used inside <AudioPlayerProvider>");
  }
  return ctx;
}

/**
 * Global audio player state. A single <audio> element lives here so playback
 * survives navigation. When a beat has no audioUrl yet, we simulate playback
 * with a timer so the UI still behaves correctly — swap in real files when ready.
 */
export default function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const fakeTimerRef = useRef(null);

  const [currentBeat, setCurrentBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0); // seconds (fake fallback = 30s)
  // Tracks whether we're past hydration so the <audio> element only renders
  // on the client without causing a server/client tree mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stopFakeTimer = useCallback(() => {
    if (fakeTimerRef.current) {
      clearInterval(fakeTimerRef.current);
      fakeTimerRef.current = null;
    }
  }, []);

  const startFakeTimer = useCallback(() => {
    stopFakeTimer();
    const fakeDuration = 30; // placeholder song length
    setDuration(fakeDuration);
    fakeTimerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 1 / fakeDuration;
        if (next >= 1) {
          stopFakeTimer();
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [stopFakeTimer]);

  const playBeat = useCallback(
    (beat) => {
      const isSame = currentBeat && currentBeat.id === beat.id;

      if (isSame) {
        // toggle
        setIsPlaying((prev) => !prev);
        return;
      }

      setCurrentBeat(beat);
      setProgress(0);
      setIsPlaying(true);
    },
    [currentBeat]
  );

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => setIsPlaying(true), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const seek = useCallback((ratio) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    setProgress(clamped);
    const audio = audioRef.current;
    if (audio && audio.duration && !Number.isNaN(audio.duration)) {
      audio.currentTime = audio.duration * clamped;
    }
  }, []);

  // Wire playback state to the real <audio> element when we have a URL.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentBeat) return;

    if (!currentBeat.audioUrl) {
      // Placeholder mode — use the fake timer
      if (isPlaying) startFakeTimer();
      else stopFakeTimer();
      return () => stopFakeTimer();
    }

    // Real audio mode
    stopFakeTimer();
    if (audio.src !== currentBeat.audioUrl) {
      audio.src = currentBeat.audioUrl;
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentBeat, isPlaying, startFakeTimer, stopFakeTimer]);

  // Listen to real <audio> events for progress/duration.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (audio.duration && !Number.isNaN(audio.duration)) {
        setDuration(audio.duration);
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onEnd = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const value = useMemo(
    () => ({
      currentBeat,
      isPlaying,
      progress,
      duration,
      playBeat,
      pause,
      resume,
      togglePlay,
      seek,
    }),
    [currentBeat, isPlaying, progress, duration, playBeat, pause, resume, togglePlay, seek]
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      {/* Client-only <audio> — rendered after mount to avoid any SSR/hydration mismatch */}
      {mounted ? (
        <audio ref={audioRef} preload="metadata" className="hidden" />
      ) : null}
    </AudioPlayerContext.Provider>
  );
}
