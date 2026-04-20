# Hero asset drop-in slots

The landing hero auto-detects files in this folder. Drop them in with these exact names and they activate on the next deploy — no code changes needed.

The logo itself is the canonical `XM_TM5.png` at `/public/XM_TM5.png`, shared with the site header via `components/Logo.jsx`. Update that file to refresh the mark everywhere at once.

## Slots

**`loop.mp4`** — Cinematic background video loop. Muted, silent-safe, slow. Fades in over the parallax layers the moment it can play. Recommended: 1080p (or 720p for faster load), 10–20s clean loop, H.264 MP4, under ~6MB. Think abstract texture / light / landscape, not a storyline.

**`ambient.mp3`** — Optional ambient audio loop. Muted by default; a subtle unmute toggle appears in the bottom-right corner when the file exists. Keep it quiet, textural, and loop-safe.

## Notes

- Files are served from `/hero/<filename>` at runtime.
- If a file is missing, the hero silently falls back (parallax-only background, no audio toggle). Nothing breaks.
- To preview locally: `npm run dev`, then open `http://localhost:3000`.
