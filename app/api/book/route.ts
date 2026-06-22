/**
 * POST /api/book — discovery-call booking from the custom calendar.
 *
 * Flow: rate-limit → validate → honeypot → Turnstile → CRM upsert + founder alert
 * + lead confirmation. Notifications are best-effort so a flaky integration never
 * drops the booking after a valid submission.
 */

import { badRequest, enforceRateLimit, ok, readJson, serverError } from "@/lib/api";
import { clientIp } from "@/lib/rate-limit";
import { bookingSchema, fieldErrors } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/integrations/turnstile";
import { upsertContact } from "@/lib/integrations/hubspot";
import { sendFounderAlert, sendToLead } from "@/lib/integrations/resend";
import { bookingFounderAlert, bookingLeadConfirmation } from "@/lib/email-templates";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

const log = createLogger("api/book");

export async function POST(req: Request): Promise<Response> {
  const limited = enforceRateLimit(req, "book", 5, 60_000);
  if (limited) return limited;

  const body = await readJson(req);
  if (!body) return badRequest("Invalid request body.");

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return badRequest("Please check the form.", { fields: fieldErrors(parsed.error) });

  const data = parsed.data;

  // Honeypot tripped → pretend success, do nothing.
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
        message: `Booked discovery call: ${data.date} at ${data.time}.${data.notes ? ` Leak: ${data.notes}` : ""}`,
        source: "booking",
      }),
      sendFounderAlert({
        ...bookingFounderAlert({
          name: data.name,
          email: data.email,
          business: data.business || undefined,
          niche: data.niche || undefined,
          date: data.date,
          time: data.time,
          notes: data.notes || undefined,
        }),
        replyTo: data.email,
      }),
      sendToLead({
        to: data.email,
        ...bookingLeadConfirmation({ name: data.name, date: data.date, time: data.time }),
      }),
    ]);

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length) log.warn("Some booking integrations failed", { failures: failures.length });

    return ok();
  } catch (err) {
    log.error("Booking submission failed", { error: String(err) });
    return serverError("We couldn't confirm your booking. Please try again or use WhatsApp.");
  }
}
