import { beats } from "../config/beats";

// Treat the catalogue as a cyclic playlist — the player bar wraps in
// both directions so visitors can keep stepping through productions
// without hitting a dead-end at either edge of the array.
export function getAdjacentBeat(currentId, direction) {
  const idx = beats.findIndex((b) => b.id === currentId);
  if (idx === -1) return beats[0];
  const len = beats.length;
  const nextIdx =
    direction === "next" ? (idx + 1) % len : (idx - 1 + len) % len;
  return beats[nextIdx];
}
