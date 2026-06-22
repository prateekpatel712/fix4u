/**
 * Cookie-consent state (PRD §2.14, GDPR/UK).
 *
 * Non-essential scripts (GA4, Clarity, ad pixels) must NOT load before the visitor opts in.
 * This module is the single source of truth for that decision; the (frontend) cookie banner
 * reads/writes it and the analytics loaders gate on `hasConsent("analytics")`.
 *
 * Storage is a first-party cookie (so the choice survives reloads and is readable server-side
 * if ever needed for SSR gating). No third-party storage, no tracking until granted.
 */

export type ConsentCategory = "analytics" | "marketing";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the decision, for audit/expiry. */
  decidedAt: string;
  /** Schema version so you can re-prompt if the policy materially changes. */
  version: number;
}

export const CONSENT_COOKIE = "fix4u_consent";
export const CONSENT_VERSION = 1;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const DENY_ALL: ConsentState = {
  analytics: false,
  marketing: false,
  decidedAt: "",
  version: CONSENT_VERSION,
};

/** Parse a raw cookie value into a ConsentState, defaulting to deny-all on anything invalid. */
export function parseConsent(raw: string | undefined | null): ConsentState {
  if (!raw) return DENY_ALL;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return DENY_ALL; // policy changed → re-prompt
    return {
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
      version: CONSENT_VERSION,
    };
  } catch {
    return DENY_ALL;
  }
}

/** Read consent from the browser's cookies. Returns deny-all on the server or when unset. */
export function getConsent(): ConsentState {
  if (typeof document === "undefined") return DENY_ALL;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.split("=").slice(1).join("="));
}

/** Persist a consent decision as a first-party cookie (client-side). */
export function setConsent(choice: { analytics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = {
    analytics: choice.analytics,
    marketing: choice.marketing,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  if (typeof document !== "undefined") {
    const value = encodeURIComponent(JSON.stringify(state));
    document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax; Secure`;
  }
  return state;
}

export function hasConsent(category: ConsentCategory, state?: ConsentState): boolean {
  return (state ?? getConsent())[category];
}

/** Whether the visitor has made any decision yet (controls whether the banner shows). */
export function hasDecided(state?: ConsentState): boolean {
  return Boolean((state ?? getConsent()).decidedAt);
}
