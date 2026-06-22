import type { MetadataRoute } from "next";

// Keep in sync with layout metadataBase. Falls back to the canonical domain so a deployed
// sitemap never lists localhost URLs if NEXT_PUBLIC_SITE_URL is forgotten.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fix4u.in";

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

const routes: Array<{ path: string; changeFrequency: ChangeFreq; priority: number }> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/ai-booking-agent", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/demo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
