/**
 * Sanity read client (Tech Spec §2/§4). Content is pulled at build/ISR time.
 *
 * `useCdn: true` serves cached, fast responses for published content. A read token is only
 * required for private datasets or draft/preview — public datasets read without one.
 */

import { createClient, type SanityClient } from "@sanity/client";
import { publicEnv, optionalEnv } from "@/lib/env";

export const sanityConfigured = Boolean(publicEnv.sanity.projectId);

let _client: SanityClient | null = null;

/** Returns the shared Sanity client, or null if the project isn't configured yet. */
export function getSanityClient(): SanityClient | null {
  if (!sanityConfigured) return null;
  if (_client) return _client;
  _client = createClient({
    projectId: publicEnv.sanity.projectId,
    dataset: publicEnv.sanity.dataset,
    apiVersion: publicEnv.sanity.apiVersion,
    useCdn: true,
    token: optionalEnv("SANITY_API_READ_TOKEN"),
    perspective: "published",
  });
  return _client;
}

/**
 * Run a GROQ query, returning `fallback` when Sanity isn't configured or the query throws.
 * Keeps callers (and the site) resilient before any CMS content exists.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  const client = getSanityClient();
  if (!client) return fallback;
  try {
    return await client.fetch<T>(query, params);
  } catch {
    return fallback;
  }
}
