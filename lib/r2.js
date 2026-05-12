import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * R2 (Cloudflare's S3-compatible object store) helpers.
 *
 * Beat masters live in a single R2 bucket using the convention:
 *   `{slug}.mp3`  — always present
 *   `{slug}.wav`  — present for productions sold with the WAV lease
 *
 * The webhook calls `getSignedDownloadUrl` after a paid checkout and
 * emails the buyer a 24h link. We use the AWS SDK's S3 presigner because
 * R2 implements the S3 SigV4 protocol — no Cloudflare-specific client
 * needed.
 *
 * The preview API uses `getSignedStreamUrl` instead — same signing path
 * but without the forced `attachment` disposition, so an <audio> element
 * can stream the bytes inline. Previews are watermark-free for now and
 * expire in 1h; watermarked variants will replace this when ready.
 */

let cachedClient = null;

function getClient() {
  if (cachedClient) return cachedClient;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 not configured (missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)",
    );
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cachedClient;
}

function getBucket() {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME not set");
  return bucket;
}

/**
 * Returns a time-limited download URL for a single object key.
 *
 * @param {string} key - Object key inside the bucket (e.g. "cristal.mp3").
 * @param {number} [expiresInSeconds=86400] - Link lifetime; defaults to 24h.
 * @returns {Promise<string>} A signed HTTPS URL the buyer can GET directly.
 */
export async function getSignedDownloadUrl(key, expiresInSeconds = 86400) {
  const client = getClient();
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
    // Force a download with a friendlier filename. R2 supports the standard
    // response-content-disposition override the same way S3 does.
    ResponseContentDisposition: `attachment; filename="${key}"`,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Returns a time-limited streaming URL — same key, but without the
 * `attachment` disposition, so an <audio> element can play it inline.
 * Used by the preview API; defaults to 1h since these are short-lived
 * by design.
 *
 * @param {string} key
 * @param {number} [expiresInSeconds=3600]
 * @returns {Promise<string>}
 */
export async function getSignedStreamUrl(key, expiresInSeconds = 3600) {
  const client = getClient();
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ResponseContentDisposition: `inline; filename="${key}"`,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Returns true if an object exists in the bucket. Used so we can email
 * what's actually available and flag what's still pending in R2 instead
 * of handing the buyer a link that 404s.
 *
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function objectExists(key) {
  const client = getClient();
  try {
    await client.send(
      new HeadObjectCommand({ Bucket: getBucket(), Key: key }),
    );
    return true;
  } catch (err) {
    // S3/R2 returns NotFound (404) when the key is absent. Anything else
    // (auth, network) we propagate so the webhook can log it.
    const status = err?.$metadata?.httpStatusCode;
    const name = err?.name;
    if (status === 404 || name === "NotFound" || name === "NoSuchKey") {
      return false;
    }
    throw err;
  }
}
