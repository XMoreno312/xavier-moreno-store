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
 * survives navigation and only ever plays one beat at a time — every card
 * and the persistent footer bar talk to the same provider.
 *
 * Source resolution:
 *   - If `beat.audioUrl` is set, play that URL directly.
 *   - Otherwise, fetch a 1h signed R2 URL from `/api/preview/[id]` and
 *     play that. Resolved URLs are cached per-beat for the session so
 *     toggling pause/play doesn't hit the API again.
 *
 * Failure modes:
 *   - 404 from the preview API marks the beat as `errored`. The card
 *     visual switches to a dimmed / "not yet" state and refuses to play
 *     until the user picks a different beat (a future upload will clear
 *     the cached error on a fresh page load).
 */
export default function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const urlCacheRef = useRef(new Map()); // beatId -> resolved playback URL
  // The most recent beat the user asked to play. Used to ignore stale
  // fetches when the user clicks a second card before the first resolves.
  const pendingBeatRef = useRef(null);

  const [currentBeat, setCurrentBeat] = useState(null);
  const [resolvedUrl, setResolvedUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0); // seconds
  const [loadingBeatId, setLoadingBeatId] = useState(null);
  const [erroredBeats, setErroredBeats] = useState(() => new Set());

  // Avoid SSR mismatch — only render the <audio> after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isBeatErrored = useCallback(
    (beatId) => erroredBeats.has(beatId),
    [erroredBeats],
  );

  const markErrored = useCallback((beatId) => {
    setErroredBeats((prev) => {
      if (prev.has(beatId)) return prev;
      const next = new Set(prev);
      next.add(beatId);
      return next;
    });
  }, []);

  const clearErrored = useCallback((beatId) => {
    setErroredBeats((prev) => {
      if (!prev.has(beatId)) return prev;
      const next = new Set(prev);
      next.delete(beatId);
      return next;
    });
  }, []);

  /**
   * Resolve a beat's playback URL — explicit `audioUrl`, then the
   * per-session cache, then the preview API. Throws on 404 with a
   * `code: 404` marker so callers can distinguish "not yet available"
   * from real failures.
   */
  const resolvePlaybackUrl = useCallback(async (beat) => {
    if (urlCacheRef.current.has(beat.id)) {
      return urlCacheRef.current.get(beat.id);
    }
    if (beat.audioUrl) {
      urlCacheRef.current.set(beat.id, beat.audioUrl);
      return beat.audioUrl;
    }
    const res = await fetch(`/api/preview/${beat.id}`);
    if (res.status === 404) {
      const err = new Error("not yet available");
      err.code = 404;
      throw err;
    }
    if (!res.ok) {
      throw new Error(`preview HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data?.url) {
      throw new Error("preview missing url");
    }
    urlCacheRef.current.set(beat.id, data.url);
    return data.url;
  }, []);

  const playBeat = useCallback(
    async (beat) => {
      if (!beat) return;
      const isSame = currentBeat && currentBeat.id === beat.id;

      if (isSame) {
        // Same beat — toggle, but don't toggle into "play" if we know it's
        // errored.
        if (erroredBeats.has(beat.id)) return;
        setIsPlaying((p) => !p);
        return;
      }

      // Switching beats — clear the stage.
      pendingBeatRef.current = beat.id;
      setCurrentBeat(beat);
      setResolvedUrl(null);
      setProgress(0);
      setDuration(0);
      // Don't set isPlaying yet — wait for URL.
      setIsPlaying(false);

      // Cached path — synchronous resolution, no loading flash.
      if (urlCacheRef.current.has(beat.id)) {
        setResolvedUrl(urlCacheRef.current.get(beat.id));
        setIsPlaying(true);
        return;
      }

      // If we previously errored this beat, don't try again this session.
      if (erroredBeats.has(beat.id)) return;

      setLoadingBeatId(beat.id);
      try {
        const url = await resolvePlaybackUrl(beat);
        if (pendingBeatRef.current !== beat.id) return; // user clicked elsewhere
        setResolvedUrl(url);
        setIsPlaying(true);
        clearErrored(beat.id);
      } catch (err) {
        if (pendingBeatRef.current !== beat.id) return;
        if (err?.code === 404) {
          markErrored(beat.id);
        } else {
          // Surface in console — non-404 failures shouldn't be silent.
          console.error("preview fetch failed", err);
        }
        setIsPlaying(false);
        setCurrentBeat(null);
        setResolvedUrl(null);
      } finally {
        setLoadingBeatId((id) => (id === beat.id ? null : id));
      }
    },
    [currentBeat, erroredBeats, resolvePlaybackUrl, markErrored, clearErrored],
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

  // Wire playback state to the <audio> element. Fires whenever the
  // resolved URL or play/pause intent changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentBeat || !resolvedUrl) return;

    if (audio.src !== resolvedUrl) {
      audio.src = resolvedUrl;
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentBeat, resolvedUrl, isPlaying]);

  // Listen for time/duration updates and end-of-track. We have to wait
  // for `mounted` to flip before the <audio> element renders — running
  // this on first mount would find `audioRef.current === null` and bail,
  // which is exactly the bug that left progress + duration stuck at 0.
  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted]);

  const value = useMemo(
    () => ({
      currentBeat,
      isPlaying,
      progress,
      duration,
      loadingBeatId,
      isBeatErrored,
      playBeat,
      pause,
      resume,
      togglePlay,
      seek,
    }),
    [
      currentBeat,
      isPlaying,
      progress,
      duration,
      loadingBeatId,
      isBeatErrored,
      playBeat,
      pause,
      resume,
      togglePlay,
      seek,
    ],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      {/* Client-only <audio> — rendered after mount to avoid SSR mismatch.
          preload="none" because the URL is resolved lazily on first play. */}
      {mounted ? (
        <audio ref={audioRef} preload="none" className="hidden" />
      ) : null}
    </AudioPlayerContext.Provider>
  );
}
