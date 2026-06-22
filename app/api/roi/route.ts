/**
 * POST /api/roi — ROI calculator (PRD §2.6).
 *
 * Always returns the computed result so the calculator can render it immediately. If the visitor
 * also supplied an email (and passed Turnstile), we email them the result, notify the founder,
 * and save them as a lead — turning the calculator into a capture point.
 */

import { badRequest, enforceRateLimit, json, readJson } from "@/lib/api";
import { clientIp } from "@/lib/rate-limit";
import { roiSchema, fieldErrors } from "@/lib/validation";
import { calculateRoi } from "@/lib/roi";
import { verifyTurnstile } from "@/lib/integrations/turnstile";
import { upsertContact } from "@/lib/integrations/hubspot";
import { sendFounderAlert, sendToLead } from "@/lib/integrations/resend";
import { roiFounderAlert, roiResultEmail } from "@/lib/email-templates";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

const log = createLogger("api/roi");

export async function POST(req: Request): Promise<Response> {
  const limited = enforceRateLimit(req, "roi", 20, 60_000);
  if (limited) return limited;

  const body = await readJson(req);
  if (!body) return badRequest("Invalid request body.");

  const parsed = roiSchema.safeParse(body);
  if (!parsed.success) return badRequest("Please check your numbers.", { fields: fieldErrors(parsed.error) });

  const data = parsed.data;
  const result = calculateRoi(data);

  // Email + lead capture only when an email is provided and spam-checked.
  let emailed = false;
  if (data.email) {
    const turnstile = await verifyTurnstile(data.turnstileToken, clientIp(req));
    if (turnstile.success) {
      const results = await Promise.allSettled([
        upsertContact({ email: data.email, source: "roi_calculator", message: `ROI lost/mo: ${result.lostRevenuePerMonth}` }),
        sendToLead({ to: data.email, ...roiResultEmail(result) }),
        sendFounderAlert(roiFounderAlert({ email: data.email, result })),
      ]);
      emailed = results.some((r) => r.status === "fulfilled");
      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length) log.warn("Some ROI integrations failed", { failures: failures.length });
    }
  }

  return json({ ok: true, result, emailed });
}
