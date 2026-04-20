# xavier-moreno-store

Beat store for Xavier Moreno — Next.js (App Router), Tailwind, no TypeScript.

## Quick start

```bash
cd xavier-moreno-store
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  page.js                  Store / beat listing
  beats/[id]/page.js       Individual beat (expanded tier selection)
  beats/[id]/BeatDetailClient.js   Client piece for the detail page
  licensing/page.js        Licensing terms, comparison table, FAQ
  layout.js                Root layout + global audio player mounted here
  globals.css              Tailwind + a few custom bits (range slider, grain)
components/
  Header.js                Top nav + crown logo
  Footer.js                Contact email + copyright
  CrownLogo.js             SVG crown
  BeatCard.js              Row card with expandable tier drawer
  TierDrawer.js            MP3 / WAV / Exclusive drawer
  FilterPills.js           All / Sierreño / Indie / R&B
  AudioPlayerProvider.js   React context holding playback state
  AudioPlayerBar.js        Fixed-bottom player bar (hidden until you press play)
config/
  beats.js                 Single source of truth — all beats + tier definitions
```

## Updating beats

Edit `config/beats.js`. Every beat has:

```js
{
  id: "tarde-de-lluvia",      // URL slug
  title: "Tarde de Lluvia",
  key: "C# minor",
  bpm: 74,
  genre: "Sierreño",          // must be one of GENRES
  mood: ["melancholic"],
  audioUrl: null,              // drop in a URL or /public path when ready
  coverColor: "#3a2a1c",       // fallback gradient color
}
```

Placeholder audio: if `audioUrl` is `null`, the player simulates a 30-second
preview so the UI still works. Wire in real files later — the `<audio>` element
and state machine are already in place.

## Design tokens

Defined in `tailwind.config.js`:

- `bg-ink` → `#141210` (background)
- `text-gold` / `bg-gold` → `#c9a87c` (accent)
- `text-cream` / `bg-cream` → `#e8dfc8` (foreground)
- `text-muted` → `#6b6258`

Display font is serif (`font-display`), body is sans. Swap to real typefaces by
editing `tailwind.config.js > theme.extend.fontFamily`.

## Stripe hookup (later)

Two spots to wire checkout:

1. `components/BeatCard.js` → `handleTierSelect`
2. `app/beats/[id]/BeatDetailClient.js` → `handleCheckout`

Both currently show an `alert()` stub. Replace with a fetch to a Next.js Route
Handler that creates a Stripe Checkout Session, e.g.:

```js
const res = await fetch("/api/checkout", {
  method: "POST",
  body: JSON.stringify({ beatId: beat.id, tier: tier.id }),
});
const { url } = await res.json();
window.location.href = url;
```

Add `stripePriceId` to each tier in `config/beats.js` to map tiers → Stripe
prices. Beat-level pricing overrides can live alongside the beat.

## Supabase hookup (later)

Replace the hardcoded `beats` export in `config/beats.js` with a fetch from
Supabase. Because every component imports from `@/config/beats`, swapping
storage is a one-file change (or introduce a thin `lib/beats.js` wrapper that
reads from Supabase on the server and falls back to the config file in dev).

## Notes

- ESLint: `npm run lint`
- Build: `npm run build && npm run start`
- Mobile-first layout. The audio bar stays pinned at the bottom once a beat is
  playing and survives navigation thanks to `AudioPlayerProvider` sitting in
  the root layout.
