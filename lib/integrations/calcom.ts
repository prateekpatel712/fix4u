/**
 * Cal.com booking helpers (PRD §2.2, Tech Spec §5).
 *
 * - `calcomBookingUrl()` builds the public scheduler URL (prefilled where possible).
 * - `verifyCalcomSignature()` validates the HMAC-SHA256 signature on inbound webhooks so the
 *   /api/calcom-webhook route can trust a payload before moving a CRM deal to "Call booked".
 *
 * Cal.com signs the raw request body with your webhook secret and sends it in the
 * `X-Cal-Signature-256` header. We MUST verify against the raw bytes (not a re-serialized JSON).
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { optionalEnv, publicEnv } from "@/lib/env";

export function calcomBookingUrl(prefill?: {
  name?: string;
  email?: string;
  notes?: string;
}): string {
  const link = publicEnv.calcomLink;
  const base = link ? `https://cal.com/${link}` : "https://cal.com";
  const params = new URLSearchParams();
  if (prefill?.name) params.set("name", prefill.name);
  if (prefill?.email) params.set("email", prefill.email);
  if (prefill?.notes) params.set("notes", prefill.notes);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** Verify a Cal.com webhook signature against the raw request body. */
export function verifyCalcomSignature(rawBody: string, signature: string | null): boolean {
  const secret = optionalEnv("CALCOM_WEBHOOK_SECRET");
  if (!secret) {
    // No secret configured → cannot trust the webhook. Reject in prod, allow in dev.
    return process.env.NODE_ENV !== "production";
  }
  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** The webhook trigger events we act on. */
export type CalcomTrigger =
  | "BOOKING_CREATED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REQUESTED"
  | (string & {});

export interface CalcomBooking {
  trigger: CalcomTrigger;
  bookingId?: number | string;
  title?: string;
  startTime?: string;
  endTime?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  videoCallUrl?: string;
}

/** Normalise the (loosely-typed) Cal.com webhook payload into the fields we care about. */
export function parseCalcomPayload(payload: unknown): CalcomBooking {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (payload ?? {}) as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (p.payload ?? {}) as Record<string, any>;
  const attendee = Array.isArray(data.attendees) ? data.attendees[0] : undefined;

  return {
    trigger: p.triggerEvent ?? "UNKNOWN",
    bookingId: data.bookingId ?? data.uid ?? data.id,
    title: data.title,
    startTime: data.startTime,
    endTime: data.endTime,
    attendeeName: attendee?.name,
    attendeeEmail: attendee?.email,
    videoCallUrl:
      data.videoCallData?.url ?? data.metadata?.videoCallUrl ?? data.location,
  };
}
