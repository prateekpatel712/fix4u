/**
 * POST /api/calcom-webhook — Cal.com booking webhook (PRD §2.2, Tech Spec §5 step 4).
 *
 * On a verified BOOKING_CREATED, we move the lead's CRM stage to "Call booked" and alert the
 * founder. Cal.com itself sends the attendee confirmation + reminders, so we don't duplicate those.
 *
 * Signature is verified against the RAW body (Cal.com signs the exact bytes) before we trust it.
 */

import { ok, json } from "@/lib/api";
import { parseCalcomPayload, verifyCalcomSignature } from "@/lib/integrations/calcom";
import { markCallBooked } from "@/lib/integrations/hubspot";
import { sendFounderAlert } from "@/lib/integrations/resend";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const log = createLogger("api/calcom-webhook");

export async function POST(req: Request): Promise<Response> {
  const raw = await req.text();
  const signature = req.headers.get("x-cal-signature-256");

  if (!verifyCalcomSignature(raw, signature)) {
    log.warn("Rejected Cal.com webhook: bad signature.");
    return json({ ok: false, error: "Invalid signature." }, 401);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, 400);
  }

  const booking = parseCalcomPayload(payload);

  // Only react to created/rescheduled bookings.
  if (booking.trigger !== "BOOKING_CREATED" && booking.trigger !== "BOOKING_RESCHEDULED") {
    return ok({ ignored: booking.trigger });
  }

  try {
    const tasks: Promise<unknown>[] = [];
    if (booking.attendeeEmail) tasks.push(markCallBooked(booking.attendeeEmail));

    tasks.push(
      sendFounderAlert({
        subject: `Call booked: ${booking.attendeeName || "Unknown"} — ${booking.startTime || ""}`,
        html: `<p><strong>New discovery call booked.</strong></p>
          <ul>
            <li>Name: ${escapeHtml(booking.attendeeName)}</li>
            <li>Email: ${escapeHtml(booking.attendeeEmail)}</li>
            <li>When: ${escapeHtml(booking.startTime)}</li>
            ${booking.videoCallUrl ? `<li>Link: ${escapeHtml(booking.videoCallUrl)}</li>` : ""}
          </ul>`,
        text: `New discovery call booked.\nName: ${booking.attendeeName}\nEmail: ${booking.attendeeEmail}\nWhen: ${booking.startTime}\nLink: ${booking.videoCallUrl || "-"}`,
        replyTo: booking.attendeeEmail,
      }),
    );

    await Promise.allSettled(tasks);
    return ok({ handled: booking.trigger });
  } catch (err) {
    log.error("Cal.com webhook handling failed", { error: String(err) });
    // Return 200 so Cal.com doesn't retry forever on a non-retryable error; we've logged it.
    return ok({ handled: false });
  }
}

function escapeHtml(input?: string): string {
  if (!input) return "-";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
