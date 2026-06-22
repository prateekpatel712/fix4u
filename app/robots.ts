import type { MetadataRoute } from "next";

// Prefer the configured site URL; fall back to the canonical domain (matches layout metadataBase)
// so a deployed robots.txt never points at localhost even if NEXT_PUBLIC_SITE_URL is unset.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fix4u.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes are server endpoints, not pages — keep them out of the index.
      disallow: "/api/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
