# Hero asset drop-in slots

The landing hero auto-detects files in this folder. Drop them in with these exact names and they activate on the next deploy — no code changes needed.

## Slots

**`logo.svg`** — Your custom wordmark / logo. Replaces the "XAVIER MORENO" placeholder. SVG preferred so it stays crisp at any size. Keep it roughly 4:1 to 6:1 aspect ratio (wide wordmark) for best layout. Target height at display: 80–96px.

**`loop.mp4`** — Cinematic background video loop. Muted, silent-safe, slow. Fades in over the parallax layers the moment it can play. Recommended: 1080p (or 720p for faster load), 10–20s clean loop, H.264 MP4, under ~6MB. Think abstract texture / light / landscape, not a storyline.

**`ambient.mp3`** — Optional ambient audio loop. Muted by default; a subtle unmute toggle appears in the bottom-right corner when the file exists. Keep it quiet, textural, and loop-safe.

## Notes

- Files are served from `/hero/<filename>` at runtime.
- If a file is missing, the hero silently falls back (placeholder logo, parallax-only background, no audio toggle). Nothing breaks.
- To preview locally: `npm run dev`, then open `http://localhost:3000`.
