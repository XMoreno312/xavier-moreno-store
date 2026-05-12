import { getBeatById } from "@/config/beats";
import { getSignedStreamUrl, objectExists } from "@/lib/r2";

/**
 * GET /api/preview/[id]
 *
 * Returns a 1-hour signed R2 URL for the beat's MP3 master so the player
 * can stream it inline. The URL exposes the full file — known temporary
 * state; watermarked previews replace this when ready.
 *
 * Response (200): { url: string }
 * Response (404): { error: "unknown beat" } when the slug isn't in the
 *                 catalogue, or { error: "not yet available" } when the
 *                 beat exists but the MP3 hasn't been uploaded to R2 yet.
 * Response (500): { error: "preview unavailable" } on signing/R2 errors.
 */

// These are dynamic per-request and rely on env vars only available at
// runtime — no static caching.
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const id = params?.id;
  const beat = id ? getBeatById(id) : null;
  if (!beat) {
    return Response.json({ error: "unknown beat" }, { status: 404 });
  }

  const key = `${beat.id}.mp3`;
  try {
    const exists = await objectExists(key);
    if (!exists) {
      return Response.json({ error: "not yet available" }, { status: 404 });
    }
    const url = await getSignedStreamUrl(key, 3600);
    return Response.json({ url });
  } catch (err) {
    console.error("preview signing failed", err);
    return Response.json({ error: "preview unavailable" }, { status: 500 });
  }
}
