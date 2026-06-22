/**
 * POST /api/newsletter — newsletter / nurture signup (PRD §2.9).
 *
 * Adds the subscriber to the CRM (marketing source) and sends a welcome email. Double opt-in is
 * optional and can be layered on later by sending a confirm link instead of the welcome directly.
 */

import { badRequest, enforceRateLimit, ok, readJson, serverError } from "@/lib/api";
import { clientIp } from "@/lib/rate-limit";
import { newsletterSchema, fieldErrors } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/integrations/turnstile";
import { upsertContact } from "@/lib/integrations/hubspot";
import { sendToLead } from "@/lib/integrations/resend";
import { newsletterWelcome } from "@/lib/email-templates";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

const log = createLogger("api/newsletter");

export async function POST(req: Request): Promise<Response> {
  const limited = enforceRateLimit(req, "newsletter", 5, 60_000);
  if (limited) return limited;

  const body = await readJson(req);
  if (!body) return badRequest("Invalid request body.");

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return badRequest("Please enter a valid email.", { fields: fieldErrors(parsed.error) });

  const data = parsed.data;
  if (data.company) return ok(); // honeypot

  const turnstile = await verifyTurnstile(data.turnstileToken, clientIp(req));
  if (!turnstile.success) return badRequest("Spam check failed. Please retry.");

  try {
    await Promise.allSettled([
      upsertContact({ email: data.email, source: "newsletter" }),
      sendToLead({ to: data.email, ...newsletterWelcome() }),
    ]);
    return ok();
  } catch (err) {
    log.error("Newsletter signup failed", { error: String(err) });
    return serverError("We couldn't sign you up. Please try again.");
  }
}
