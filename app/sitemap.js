import { beats } from "@/config/beats";

const SITE_URL = "https://zaemoreno.com";

/**
 * Next.js generates /sitemap.xml from this export at build time. We
 * include the marketing routes, the legal pages, and every beat in the
 * catalogue (so search engines can index each production individually).
 */
export default function sitemap() {
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/beats",
    "/licensing",
    "/work-with-me",
    "/terms-of-service",
    "/privacy-policy",
    "/license-agreement",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.7,
  }));

  const beatRoutes = beats.map((b) => ({
    url: `${SITE_URL}/beats/${b.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...beatRoutes];
}
