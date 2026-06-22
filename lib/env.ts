/**
 * Centralised environment access.
 *
 * Server-only secrets are read lazily through `requireEnv()` so a missing key fails loudly
 * at the call site (with a clear message) rather than silently sending `undefined` to an
 * integration. Public values are read from the statically-inlined NEXT_PUBLIC_* vars.
 */

/** Read a required server-side env var, throwing a clear error if absent. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local (see .env.example).`,
    );
  }
  return value;
}

/** Read an optional server-side env var. */
export function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

/** True when an integration is configured (its key is present). Use to degrade gracefully. */
export function hasEnv(name: string): boolean {
  return Boolean(process.env[name]);
}

/* ----------------------------------------------------------------------------------------- */
/* Public config — safe to import in client or server code (values inlined at build time).   */
/* ----------------------------------------------------------------------------------------- */

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  },
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  calcomLink: process.env.NEXT_PUBLIC_CALCOM_LINK || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
} as const;

/** The AI model powering the chatbot (Tech Spec §2 / chat engine). Defaults to the latest Opus. */
export const chatModel = process.env.CHAT_MODEL || "claude-opus-4-8";
