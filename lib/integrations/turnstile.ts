/**
 * Cloudflare Turnstile server-side verification (PRD §2.3, Tech Spec §9).
 *
 * Every form route calls `verifyTurnstile()` before doing any work. If the secret isn't
 * configured we fail OPEN in development (so local testing isn't blocked) but fail CLOSED in
 * production (so a misconfigured deploy can't silently disable spam protection).
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
    if (process.env.NODE_ENV === "production") {
      log.error("TURNSTILE_SECRET_KEY missing in production — rejecting submission.");
      return { success: false, reason: "spam_protection_unconfigured" };
    }
    log.warn("TURNSTILE_SECRET_KEY missing — skipping verification (dev only).");
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
