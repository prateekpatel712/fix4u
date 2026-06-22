/**
 * Zod schemas for every public input surface (PRD §2.3, §2.6, §2.7, §2.9, §2.4).
 * Server-side validation is the security boundary — never trust the client. Each form also
 * carries a Turnstile token verified separately in `lib/integrations/turnstile.ts`.
 */

import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(254);
const name = z.string().trim().min(1, "Name is required.").max(120);
const business = z.string().trim().max(160).optional().or(z.literal(""));
const turnstileToken = z.string().min(1, "Spam check failed. Please retry.").max(2048);

/** Honeypot: a hidden field real users never fill. If present, silently drop. */
const honeypot = z.string().max(0).optional();

/** 2.3 — primary contact form. */
export const contactSchema = z.object({
  name,
  email,
  business,
  message: z.string().trim().min(1, "Tell us what you need.").max(4000),
  // Optional niche so we can route/segment leads.
  niche: z.string().trim().max(80).optional().or(z.literal("")),
  turnstileToken,
  company: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

/** 2.7 — free AI audit request (their IG/site URL + main problem). */
export const auditSchema = z.object({
  name,
  email,
  business,
  url: z.string().trim().url("Enter a valid URL (your site or Instagram).").max(500),
  problem: z.string().trim().min(1, "Describe your main problem.").max(2000),
  niche: z.string().trim().max(80).optional().or(z.literal("")),
  turnstileToken,
  company: honeypot,
});
export type AuditInput = z.infer<typeof auditSchema>;

/** Discovery-call booking from the custom calendar. */
export const bookingSchema = z.object({
  name,
  email,
  business,
  niche: z.string().trim().max(80).optional().or(z.literal("")),
  date: z.string().trim().min(1, "Pick a date.").max(40),
  time: z.string().trim().min(1, "Pick a time.").max(20),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  turnstileToken,
  company: honeypot,
});
export type BookingInput = z.infer<typeof bookingSchema>;

/** 2.9 — newsletter / nurture signup. */
export const newsletterSchema = z.object({
  email,
  turnstileToken,
  company: honeypot,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** 2.6 — ROI calculator inputs. */
export const roiSchema = z.object({
  enquiriesPerMonth: z.coerce.number().int().min(0).max(1_000_000),
  // Fraction missed/slow, accepted as 0–100 (percent) and normalised by the calculator.
  percentMissed: z.coerce.number().min(0).max(100),
  avgCustomerValue: z.coerce.number().min(0).max(10_000_000),
  // Optional close rate (percent of answered enquiries that become customers). Defaults applied in lib/roi.
  closeRatePercent: z.coerce.number().min(0).max(100).optional(),
  // Optional: email the result to the lead and notify the founder.
  email: email.optional(),
  turnstileToken: turnstileToken.optional(),
});
export type RoiInput = z.infer<typeof roiSchema>;

/** 2.4 — chatbot turn payload. */
const chatRole = z.enum(["user", "assistant"]);
export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: chatRole,
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1, "No messages provided.")
    .max(40, "Conversation too long."),
  // When true, the engine loads the sandboxed sample-business persona (PRD §2.5 interactive demo).
  demo: z.boolean().optional(),
});
export type ChatInput = z.infer<typeof chatSchema>;

/**
 * Flatten a ZodError into a `{ field: message }` map for the client's inline validation UI.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
