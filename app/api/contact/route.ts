/**
 * POST /api/contact — primary lead-capture form (PRD §2.3).
 *
 * Flow: rate-limit → validate → honeypot → Turnstile → CRM upsert + founder alert + autoresponder.
 * Notifications are best-effort (Promise.allSettled) so a flaky integration never loses the lead
 * or shows the visitor an error after a valid submission.
 */

import { badRequest, enforceRateLimit, ok, readJson, serverError } from "@/lib/api";
import { clientIp } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/integrations/turnstile";
import { upsertContact } from "@/lib/integrations/hubspot";
import { sendFounderAlert, sendToLead } from "@/lib/integrations/resend";
import { contactFounderAlert, contactLeadAutoresponder } from "@/lib/email-templates";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

const log = createLogger("api/contact");

export async function POST(req: Request): Promise<Response> {
  const limited = enforceRateLimit(req, "contact", 5, 60_000);
  if (limited) return limited;

  const body = await readJson(req);
  if (!body) return badRequest("Invalid request body.");

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return badRequest("Please check the form.", { fields: fieldErrors(parsed.error) });

  const data = parsed.data;

  // Honeypot tripped → pretend success, do nothing (don't tip off bots).
  if (data.company) return ok();

  const turnstile = await verifyTurnstile(data.turnstileToken, clientIp(req));
  if (!turnstile.success) return badRequest("Spam check failed. Please retry.");

  try {
    const results = await Promise.allSettled([
      upsertContact({
        email: data.email,
        firstName: data.name,
        company: data.business || undefined,
        niche: data.niche || undefined,
        message: data.message,
        source: "contact_form",
      }),
      sendFounderAlert({
        ...contactFounderAlert({
          name: data.name,
          email: data.email,
          business: data.business || undefined,
          niche: data.niche || undefined,
          message: data.message,
        }),
        replyTo: data.email,
      }),
      sendToLead({ to: data.email, ...contactLeadAutoresponder({ name: data.name }) }),
    ]);

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length) log.warn("Some contact integrations failed", { failures: failures.length });

    return ok();
  } catch (err) {
    log.error("Contact submission failed", { error: String(err) });
    return serverError("We couldn't send your message. Please try again or use WhatsApp.");
  }
}
