/**
 * Cloudflare Turnstile server-side verification (PRD §2.3, Tech Spec §9).
 *
 * Every form route calls `verifyTurnstile()` before doing any work. If the secret isn't
 * configured we fail OPEN (spam protection simply off — the honeypot field still guards forms),
 * and it auto-enforces the moment TURNSTILE_SECRET_KEY is set. Once configured, a failed/invalid
 * token is rejected.
 */

import { optionalEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";

const log = createLogger("turnstile");
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  success: boolean;
  reason?: string;
}

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = optionalEnv("TURNSTILE_SECRET_KEY");

  if (!secret) {
    log.warn("TURNSTILE_SECRET_KEY not set — skipping spam verification (honeypot still active). Set it to enable Turnstile.");
    return { success: true };
  }

  if (!token) return { success: false, reason: "missing_token" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };

    if (!data.success) {
      const reason = (data["error-codes"] || []).join(",") || "verification_failed";
      log.warn("Turnstile verification failed", { reason });
      return { success: false, reason };
    }
    return { success: true };
  } catch (err) {
    log.error("Turnstile verification threw", { error: String(err) });
    return { success: false, reason: "verification_error" };
  }
}
