/**
 * Sanity image URL builder. Turns an image reference into a CDN URL with AVIF/WebP + resizing
 * (Tech Spec §3 image strategy). Returns null when Sanity isn't configured.
 */

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { getSanityClient } from "@/lib/sanity/client";

export function urlForImage(source: SanityImageSource | undefined | null) {
  const client = getSanityClient();
  if (!client || !source) return null;
  return imageUrlBuilder(client).image(source).auto("format").fit("max");
}
