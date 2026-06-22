/**
 * Canonical conversion-event names (PRD §2.13) plus a thin GA4 wrapper.
 *
 * Centralising the names stops the codebase drifting into `call_booked` vs `booked_call`.
 * `trackEvent` is a no-op until the visitor has granted analytics consent (PRD §2.14) and
 * the GA script has loaded — so it's always safe to call.
 */

export const AnalyticsEvent = {
  CALL_BOOKED: "call_booked",
  FORM_SUBMIT: "form_submit",
  DEMO_PLAYED: "demo_played",
  WHATSAPP_CLICK: "whatsapp_click",
  ROI_COMPLETED: "roi_completed",
  AUDIT_REQUESTED: "audit_requested",
  NEWSLETTER_SIGNUP: "newsletter_signup",
  CHAT_STARTED: "chat_started",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fire a GA4 event from the browser. Safe to call before consent/script-load — it simply
 * returns. (Server-side conversions should be sent via the GA4 Measurement Protocol instead.)
 */
export function trackEvent(name: AnalyticsEventName, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}
