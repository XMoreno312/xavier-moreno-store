const SITE_URL = "https://zaemoreno.com";

/**
 * Next.js generates /robots.txt from this export. Allow everything
 * except internal/API routes; point crawlers at the sitemap.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
