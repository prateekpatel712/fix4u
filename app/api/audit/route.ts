/**
 * POST /api/audit — free AI audit request (PRD §2.7).
 *
 * Captures the visitor's site/IG URL + main problem, stores them in the CRM, and notifies the
 * founder to record a personalised Loom. The visitor gets an autoresponder setting expectations.
 */

import { badRequest, enforceRateLimit, ok, readJson, serverError } from "@/lib/api";
import { clientIp } from "@/lib/rate-limit";
import { auditSchema, fieldErrors } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/integrations/turnstile";
import { upsertContact } from "@/lib/integrations/hubspot";
import { sendFounderAlert, sendToLead } from "@/lib/integrations/resend";
import { auditFounderAlert, auditLeadAutoresponder } from "@/lib/email-templates";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

const log = createLogger("api/audit");

export async function POST(req: Request): Promise<Response> {
  const limited = enforceRateLimit(req, "audit", 5, 60_000);
  if (limited) return limited;

  const body = await readJson(req);
  if (!body) return badRequest("Invalid request body.");

  const parsed = auditSchema.safeParse(body);
  if (!parsed.success) return badRequest("Please check the form.", { fields: fieldErrors(parsed.error) });

  const data = parsed.data;
  if (data.company) return ok(); // honeypot

  const turnstile = await verifyTurnstile(data.turnstileToken, clientIp(req));
  if (!turnstile.success) return badRequest("Spam check failed. Please retry.");

  try {
    await Promise.allSettled([
      upsertContact({
        email: data.email,
        firstName: data.name,
        company: data.business || undefined,
        niche: data.niche || undefined,
        message: `[Audit] ${data.url}\n${data.problem}`,
        source: "audit_request",
      }),
      sendFounderAlert({
        ...auditFounderAlert({
          name: data.name,
          email: data.email,
          business: data.business || undefined,
          niche: data.niche || undefined,
          url: data.url,
          problem: data.problem,
        }),
        replyTo: data.email,
      }),
      sendToLead({ to: data.email, ...auditLeadAutoresponder({ name: data.name }) }),
    ]);
    return ok();
  } catch (err) {
    log.error("Audit request failed", { error: String(err) });
    return serverError("We couldn't submit your request. Please try again or use WhatsApp.");
  }
}
