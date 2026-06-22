/**
 * WhatsApp click-to-chat link builder (PRD §2.8).
 *
 * Produces a wa.me deep link with a pre-filled message that opens WhatsApp web/app on both
 * desktop and mobile. Pure function — used by the (frontend) floating button and any server
 * response that wants to hand a visitor off to WhatsApp (e.g. the chatbot's handoff tool).
 */

import { publicEnv } from "@/lib/env";

/** Strip everything but digits — wa.me requires an international number with no '+' or spaces. */
function normalizeNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function whatsappLink(message?: string, numberOverride?: string): string {
  const number = normalizeNumber(numberOverride || publicEnv.whatsappNumber);
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Default pre-filled message, optionally personalised with the visitor's business/niche. */
export function defaultWhatsappMessage(opts?: { business?: string; niche?: string }): string {
  const who = opts?.business ? ` I run ${opts.business}.` : "";
  const what = opts?.niche ? ` (${opts.niche})` : "";
  return `Hi Fix4U 👋 I'd like to know how an AI booking agent could work for my business${what}.${who}`;
}
