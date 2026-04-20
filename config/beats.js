// Single source of truth for all beats in the store.
// Add, remove, or edit entries here and the rest of the site updates.
// When Stripe is wired in later, the `tiers` block can map to Price IDs
// (e.g. `stripePriceId: "price_xxx"`) without touching the UI.

export const LICENSE_TIERS = [
  {
    id: "mp3",
    name: "MP3 Lease",
    price: 25,
    priceLabel: "$25",
    delivery: "Untagged MP3 (320kbps)",
    rights: [
      "Use for 1 commercial recording",
      "Distribute up to 10,000 streams",
      "Non-exclusive — beat remains available",
      "Producer credit: prod. Xavier Moreno",
    ],
  },
  {
    id: "wav",
    name: "WAV Lease",
    price: 40,
    priceLabel: "$40",
    delivery: "Untagged WAV + MP3",
    rights: [
      "Use for 1 commercial recording",
      "Distribute up to 50,000 streams",
      "Monetization on YouTube allowed",
      "Non-exclusive — beat remains available",
      "Producer credit: prod. Xavier Moreno",
    ],
  },
  {
    id: "exclusive",
    name: "Exclusive",
    price: null,
    priceLabel: "Contact for pricing",
    delivery: "WAV + Trackouts/Stems",
    rights: [
      "Full ownership of master use rights",
      "Beat removed from store after sale",
      "Unlimited distribution & monetization",
      "Producer credit: prod. Xavier Moreno",
    ],
  },
];

export const GENRES = ["All", "Sierreño", "Indie", "R&B"];

export const beats = [
  {
    id: "tarde-de-lluvia",
    title: "Tarde de Lluvia",
    key: "C# minor",
    bpm: 74,
    genre: "Sierreño",
    mood: ["melancholic", "warm", "nostalgic"],
    // Hook up real audio when ready. Leave as null for placeholder.
    audioUrl: null,
    coverColor: "#3a2a1c",
  },
  {
    id: "cristal",
    title: "Cristal",
    key: "Bmaj7",
    bpm: 82,
    genre: "Indie",
    mood: ["dreamy", "airy", "shimmering"],
    audioUrl: null,
    coverColor: "#2a3340",
  },
  {
    id: "no-me-llames",
    title: "No Me Llames",
    key: "F# minor",
    bpm: 68,
    genre: "Sierreño",
    mood: ["heartbreak", "slow", "moody"],
    audioUrl: null,
    coverColor: "#412323",
  },
  {
    id: "silhouette",
    title: "Silhouette",
    key: "Ebm",
    bpm: 78,
    genre: "R&B",
    mood: ["sensual", "smooth", "late-night"],
    audioUrl: null,
    coverColor: "#1f1f2c",
  },
  {
    id: "verano-roto",
    title: "Verano Roto",
    key: "Db major",
    bpm: 90,
    genre: "Sierreño",
    mood: ["bittersweet", "summery", "open"],
    audioUrl: null,
    coverColor: "#3d2f1a",
  },
];

// Helper used by the dynamic beat page.
export function getBeatById(id) {
  return beats.find((b) => b.id === id) || null;
}
