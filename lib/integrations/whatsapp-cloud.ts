/**
 * WhatsApp Cloud API integration — send messages + verify Meta webhooks.
 *
 * This is the OUTBOUND/verification side of the AI agent on WhatsApp. The inbound webhook
 * (app/api/whatsapp) parses customer messages, runs the Gemini engine, then calls sendWhatsappText
 * here to reply. Distinct from lib/integrations/whatsapp.ts (which only builds wa.me click-to-chat
 * links for the website buttons).
 *
 * Degrades gracefully: if the Cloud API env vars are absent, whatsappCloudConfigured() is false and
 * the webhook short-circuits, so a missing config never throws.
 */

import crypto from "crypto";
import { optionalEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";

const log = createLogger("whatsapp-cloud");

function graphVersion(): string {
  return optionalEnv("WHATSAPP_GRAPH_VERSION") || "v21.0";
}

/** True when the Cloud API can actually send (token + phone number id present). */
export function whatsappCloudConfigured(): boolean {
  return Boolean(optionalEnv("WHATSAPP_TOKEN") && optionalEnv("WHATSAPP_PHONE_NUMBER_ID"));
}

/** The token you set in Meta's webhook config; echoed back during the GET verification handshake. */
export function whatsappVerifyToken(): string | undefined {
  return optionalEnv("WHATSAPP_VERIFY_TOKEN");
}

/**
 * Verify Meta's `X-Hub-Signature-256` header against the raw request body using the app secret.
 * If no app secret is configured we can't verify — allowed through in dev (with a warning) so the
 * flow is testable, but you MUST set WHATSAPP_APP_SECRET in production.
 */
export function verifyWhatsappSignature(rawBody: string, signature: string | null): boolean {
  const secret = optionalEnv("WHATSAPP_APP_SECRET");
  if (!secret) {
    log.warn("WHATSAPP_APP_SECRET not set — skipping signature verification (dev only).");
    return true;
  }
  if (!signature) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Send a plain-text WhatsApp message to a customer (E.164 digits, no '+'). Best-effort. */
export async function sendWhatsappText(to: string, body: string): Promise<void> {
  const token = optionalEnv("WHATSAPP_TOKEN");
  const phoneNumberId = optionalEnv("WHATSAPP_PHONE_NUMBER_ID");
  if (!token || !phoneNumberId) {
    log.warn("WhatsApp Cloud API not configured — cannot send.", { to });
    return;
  }
  const url = `https://graph.facebook.com/${graphVersion()}/${phoneNumberId}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        // WhatsApp caps text bodies at 4096 chars; preview_url lets booking links render a card.
        text: { preview_url: true, body: body.slice(0, 4096) },
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      log.error("WhatsApp send failed", { status: res.status, err: err.slice(0, 500) });
    }
  } catch (err) {
    log.error("WhatsApp send threw", { error: String(err) });
  }
}
