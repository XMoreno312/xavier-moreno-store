// Single source of truth for all beats in the store.
// Add, remove, or edit entries here and the rest of the site updates.
// When Stripe is wired in later, the `tiers` block can map to Price IDs
// (e.g. `stripePriceId: "price_xxx"`) without touching the UI.

export const LICENSE_TIERS = [
  {
    id: "mp3",
    name: "MP3 Lease",
    stripePriceId: "price_1TVR7hBWayOomr4lCxDk7SIi",
    price: 25,
    priceLabel: "$25",
    delivery: "Untagged MP3 (320 kbps)",
    rights: [
      "Non-exclusive license",
      "MP3 file delivery (untagged, 320 kbps)",
      "Allowed for one commercial recording",
      "Up to 10,000 streams across all platforms",
      "Producer credit required: “Produced by Xavier Moreno”",
      "No ownership transfer",
    ],
  },
  {
    id: "wav",
    name: "WAV Lease",
    stripePriceId: "price_1TVR9KBWayOomr4lHFawQ0zR",
    price: 40,
    priceLabel: "$40",
    delivery: "Untagged WAV + MP3",
    rights: [
      "Non-exclusive license",
      "High-quality WAV file delivery (with MP3)",
      "Allowed for one commercial recording",
      "Up to 50,000 streams across all platforms",
      "Monetization on YouTube permitted",
      "Producer credit required: “Produced by Xavier Moreno”",
      "No ownership transfer",
    ],
  },
  {
    id: "exclusive",
    name: "Exclusive License",
    price: null,
    priceLabel: "Contact for pricing",
    delivery: "WAV + Trackouts / Stems",
    rights: [
      "Exclusive usage rights for one released recording",
      "Production removed from public sale after the exclusive license is completed",
      "No further non-exclusive licenses sold after the exclusive license is completed",
      "Previously sold non-exclusive licenses remain valid",
      "Xavier Moreno retains ownership, copyright, authorship, publishing interest, producer rights, and intellectual property in the original production",
      "Producer credit required: “Produced by Xavier Moreno”",
      "Final exclusive terms must be confirmed in writing",
    ],
  },
];

export const GENRES = ["All", "Sierreño", "Indie", "R&B"];

// Each `signature` is a tuned gradient recipe that tints the generative
// CoverStill when no real cover art is present. Keep recipes inside a
// coherent family (warm→cool→plum) so the 5 releases read as a series.
// Replace public/beats/covers/{id}.jpg with real art at any time — the card
// will switch automatically via CoverStill's image prop.
export const beats = [
  {
    id: "tarde-de-lluvia",
    title: "Tarde de Lluvia",
    key: "C♯m",
    bpm: 74,
    genre: "Sierreño",
    mood: "La luz que queda cuando ya se fue el sol.",
    moodTags: ["melancholic", "warm", "nostalgic"],
    audioUrl: null,
    signature: {
      base: "#1a120d",
      orbA: "rgba(201, 168, 124, 0.42)", // warm gold
      orbB: "rgba(140, 74, 54, 0.38)",  // bronze
      orbAPos: "28% 38%",
      orbBPos: "74% 72%",
      tone: "warm",
    },
  },
  {
    id: "cristal",
    title: "Cristal",
    key: "Bmaj7",
    bpm: 82,
    genre: "Indie",
    mood: "Glass through morning light — refracted, untouched.",
    moodTags: ["dreamy", "airy", "shimmering"],
    audioUrl: null,
    signature: {
      base: "#0f1218",
      orbA: "rgba(168, 174, 190, 0.36)", // silver
      orbB: "rgba(120, 144, 168, 0.32)", // cool steel
      orbAPos: "70% 30%",
      orbBPos: "28% 70%",
      tone: "silver",
    },
  },
  {
    id: "no-me-llames",
    title: "No Me Llames",
    key: "F♯m",
    bpm: 68,
    genre: "Sierreño",
    mood: "Para las noches en que jurabas no contestar.",
    moodTags: ["heartbreak", "slow", "moody"],
    audioUrl: null,
    signature: {
      base: "#140d11",
      orbA: "rgba(108, 70, 88, 0.46)",  // plum
      orbB: "rgba(72, 34, 48, 0.52)",   // burgundy
      orbAPos: "32% 34%",
      orbBPos: "72% 76%",
      tone: "plum",
    },
  },
  {
    id: "silhouette",
    title: "Silhouette",
    key: "E♭m",
    bpm: 78,
    genre: "R&B",
    mood: "A slow contour, traced in smoke and low light.",
    moodTags: ["sensual", "smooth", "late-night"],
    audioUrl: null,
    signature: {
      base: "#0e0d12",
      orbA: "rgba(124, 92, 122, 0.40)", // muted plum
      orbB: "rgba(60, 62, 78, 0.50)",   // graphite
      orbAPos: "62% 40%",
      orbBPos: "30% 68%",
      tone: "plum",
    },
  },
  {
    id: "verano-roto",
    title: "Verano Roto",
    key: "D♭",
    bpm: 90,
    genre: "Sierreño",
    mood: "Un verano que casi se queda — roto donde duele.",
    moodTags: ["bittersweet", "summery", "open"],
    audioUrl: null,
    signature: {
      base: "#17110d",
      orbA: "rgba(210, 132, 92, 0.40)", // sunburn orange
      orbB: "rgba(164, 108, 108, 0.34)", // dusty rose
      orbAPos: "34% 30%",
      orbBPos: "72% 74%",
      tone: "warm",
    },
  },
];

// Helper used by the dynamic beat page.
export function getBeatById(id) {
  return beats.find((b) => b.id === id) || null;
}
