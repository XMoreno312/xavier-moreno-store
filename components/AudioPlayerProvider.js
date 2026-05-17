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

// Signed R2 URLs live for an hour. Treat anything older than 50min as
// stale so we never hand back a URL that's about to expire mid-play.
const URL_FRESH_MS = 50 * 60 * 1000;

/**
 * Global audio player state. A single <audio> element lives here so playback
 * survives navigation and only ever plays one beat at a time — every card
 * and the persistent footer bar talk to the same provider.
 *
 * Source resolution:
 *   - If `beat.audioUrl` is set, play that URL directly.
 *   - Otherwise, fetch a 1h signed R2 URL from `/api/preview/[id]` and
 *     play that. Resolved URLs are cached per-beat (with a timestamp)
 *     so toggling pause/play doesn't hit the API again, and so callers
 *     can warm the cache via `prefetchBeat` on mount/hover.
 *
 * iOS Safari note:
 *   WebKit only honors `audio.play()` when it's called synchronously in
 *   the same call stack as a user gesture. Any `await` between the tap
 *   and `play()` strips that permission silently. The play path here is
 *   structured so that — when the URL is already cached and fresh — we
 *   set `audio.src` and call `audio.play()` synchronously inside the
 *   gesture handler. The async fetch path is only used as a fallback
 *   when the prefetch hasn't completed.
 *
 * Failure modes:
 *   - 404 from the preview API marks the beat as `errored`. The card
 *     visual switches to a dimmed / "not yet" state and refuses to play
 *     until the user picks a different beat (a future upload will clear
 *     the cached error on a fresh page load).
 */
export default function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  // beatId -> { url, fetchedAt }. Timestamp lets us prefetch on mount
  // and know when a cached URL has gone stale.
  const urlCacheRef = useRef(new Map());
  // Inflight prefetches keyed by beatId — dedupes mount + hover firing
  // concurrently so we only hit /api/preview once per fresh window.
  const inflightRef = useRef(new Map());
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

  // Volume control — kept in the provider so every player surface
  // (bottom bar, detail page, future card hover) reads from the same
  // source of truth. Persisted to localStorage so the listener's
  // chosen level survives page reloads.
  const [volume, setVolumeState] = useState(1); // 0..1
  const [muted, setMuted] = useState(false);

  // Avoid SSR mismatch — only render the <audio> after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Hydrate persisted volume + mute on mount. Wrapped in try/catch
  // because localStorage can throw in private-mode Safari and on
  // certain embedded webviews.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const v = window.localStorage.getItem("xm.player.volume");
      const m = window.localStorage.getItem("xm.player.muted");
      if (v != null) {
        const parsed = parseFloat(v);
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          setVolumeState(parsed);
        }
      }
      if (m != null) setMuted(m === "1");
    } catch {
      /* localStorage unavailable — fall back to defaults. */
    }
  }, []);

  // Push volume/mute changes to the underlying <audio> element so the
  // listener's setting takes effect immediately, and persist them.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = muted ? 0 : volume;
      audio.muted = muted;
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("xm.player.volume", String(volume));
        window.localStorage.setItem("xm.player.muted", muted ? "1" : "0");
      } catch {
        /* ignore */
      }
    }
  }, [volume, muted, mounted]);

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, Number(v) || 0));
    setVolumeState(clamped);
    // Any deliberate volume change un-mutes — matches the behavior of
    // every system player. If the listener drags to zero we keep the
    // explicit muted flag false so the next change reads as a "fade in".
    if (clamped > 0 && muted) setMuted(false);
  }, [muted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

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

  // Returns the cached URL for a beat if we have one that's still fresh.
  // Returns null otherwise — callers should fall back to async fetch.
  const getFreshCachedUrl = useCallback((beatId) => {
    const entry = urlCacheRef.current.get(beatId);
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > URL_FRESH_MS) return null;
    return entry.url;
  }, []);

  /**
   * Fire-and-forget URL warmer. Called on detail-page mount and on
   * first-hover of a card so by the time the user taps play, the
   * signed R2 URL is already cached and the play handler can run
   * synchronously (which is what iOS Safari requires).
   *
   * No-ops if:
   *   - we already have a fresh cached URL,
   *   - a prefetch is already inflight for this beat,
   *   - the beat is known-errored (don't re-pummel the 404 endpoint),
   *   - the beat has a static `audioUrl` (nothing to fetch).
   */
  const prefetchBeat = useCallback(
    (beatId) => {
      if (!beatId) return;
      if (getFreshCachedUrl(beatId)) return;
      if (inflightRef.current.has(beatId)) return;
      if (erroredBeats.has(beatId)) return;

      const p = (async () => {
        try {
          const res = await fetch(`/api/preview/${beatId}`);
          if (res.status === 404) {
            markErrored(beatId);
            return;
          }
          if (!res.ok) return;
          const data = await res.json();
          if (!data?.url) return;
          urlCacheRef.current.set(beatId, {
            url: data.url,
            fetchedAt: Date.now(),
          });
        } catch {
          // Swallow — prefetch is best-effort. The play handler will
          // surface real failures if/when the user actually taps.
        } finally {
          inflightRef.current.delete(beatId);
        }
      })();
      inflightRef.current.set(beatId, p);
    },
    [erroredBeats, getFreshCachedUrl, markErrored],
  );

  /**
   * Resolve a beat's playback URL — explicit `audioUrl`, then the
   * per-session cache, then the preview API. Throws on 404 with a
   * `code: 404` marker so callers can distinguish "not yet available"
   * from real failures.
   */
  const resolvePlaybackUrl = useCallback(
    async (beat) => {
      const cached = getFreshCachedUrl(beat.id);
      if (cached) return cached;
      if (beat.audioUrl) {
        urlCacheRef.current.set(beat.id, {
          url: beat.audioUrl,
          fetchedAt: Date.now(),
        });
        return beat.audioUrl;
      }
      // If a prefetch is already in flight, wait on it rather than
      // firing a duplicate request.
      const inflight = inflightRef.current.get(beat.id);
      if (inflight) {
        await inflight;
        const afterInflight = getFreshCachedUrl(beat.id);
        if (afterInflight) return afterInflight;
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
      urlCacheRef.current.set(beat.id, {
        url: data.url,
        fetchedAt: Date.now(),
      });
      return data.url;
    },
    [getFreshCachedUrl],
  );

  const playBeat = useCallback(
    async (beat) => {
      if (!beat) return;
      const isSame = currentBeat && currentBeat.id === beat.id;
      const audio = audioRef.current;

      if (isSame) {
        // Same beat — toggle, but don't toggle into "play" if we know it's
        // errored.
        if (erroredBeats.has(beat.id)) return;
        // Synchronous toggle path. When we're flipping from paused to
        // playing on a beat we already loaded, drive the <audio> element
        // directly from the gesture stack so iOS WebKit respects it.
        if (audio && !isPlaying) {
          // Defensive: if for any reason src drifted from resolvedUrl
          // (shouldn't, but cheap to assert), restore it before play.
          if (resolvedUrl && audio.src !== resolvedUrl) {
            audio.src = resolvedUrl;
          }
          const playPromise = audio.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => setIsPlaying(false));
          }
          setIsPlaying(true);
          return;
        }
        setIsPlaying((p) => !p);
        return;
      }

      // Switching beats — clear the stage.
      pendingBeatRef.current = beat.id;

      // FAST PATH (iOS-safe): we already have a fresh URL cached, so
      // set src + call play() synchronously from inside the gesture.
      // No awaits between here and audio.play() — that's the contract
      // iOS Safari enforces for user-initiated playback.
      const cachedUrl =
        getFreshCachedUrl(beat.id) ||
        (beat.audioUrl ? beat.audioUrl : null);
      if (cachedUrl && audio) {
        if (beat.audioUrl && !urlCacheRef.current.has(beat.id)) {
          urlCacheRef.current.set(beat.id, {
            url: beat.audioUrl,
            fetchedAt: Date.now(),
          });
        }
        setCurrentBeat(beat);
        setResolvedUrl(cachedUrl);
        setProgress(0);
        setDuration(0);
        if (audio.src !== cachedUrl) {
          audio.src = cachedUrl;
        }
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => setIsPlaying(false));
        }
        setIsPlaying(true);
        clearErrored(beat.id);
        return;
      }

      // SLOW PATH — no cached URL. We have to fetch first, which means
      // play() will be detached from the user gesture and iOS Safari
      // will refuse. Prefetch on mount/hover is the mitigation; this
      // branch should be the exception, not the rule.
      setCurrentBeat(beat);
      setResolvedUrl(null);
      setProgress(0);
      setDuration(0);
      setIsPlaying(false);

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
    [
      currentBeat,
      erroredBeats,
      isPlaying,
      resolvedUrl,
      getFreshCachedUrl,
      resolvePlaybackUrl,
      markErrored,
      clearErrored,
    ],
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
  //
  // For the iOS-safe fast path, audio.src + audio.play() are already
  // called synchronously inside playBeat — this effect is mostly a
  // no-op in that case (src already matches, isPlaying already true).
  // It still runs the slow-path play (post-fetch) and handles pause.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentBeat || !resolvedUrl) return;

    if (audio.src !== resolvedUrl) {
      audio.src = resolvedUrl;
    }

    if (isPlaying) {
      if (audio.paused) {
        audio.play().catch(() => setIsPlaying(false));
      }
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
      prefetchBeat,
      pause,
      resume,
      togglePlay,
      seek,
      volume,
      muted,
      setVolume,
      toggleMute,
    }),
    [
      currentBeat,
      isPlaying,
      progress,
      duration,
      loadingBeatId,
      isBeatErrored,
      playBeat,
      prefetchBeat,
      pause,
      resume,
      togglePlay,
      seek,
      volume,
      muted,
      setVolume,
      toggleMute,
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
