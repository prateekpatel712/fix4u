/**
 * Transactional email via Resend (Tech Spec §5: autoresponder to lead + alert to founder).
 *
 * Two intents:
 *  - `sendFounderAlert`  → notify the founder a lead/booking came in (CONTACT_TO_EMAIL).
 *  - `sendToLead`        → autoresponder / result email to the visitor.
 *
 * Degrades gracefully when RESEND_API_KEY is unset (logs + returns {skipped:true}) so a missing
 * email provider never fails a form submission — the lead is still saved to the CRM.
 */

import { Resend } from "resend";
import { optionalEnv, requireEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";

const log = createLogger("resend");

let client: Resend | null = null;
function getClient(): Resend | null {
  const key = optionalEnv("RESEND_API_KEY");
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export interface SendResult {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

async function send(args: SendArgs): Promise<SendResult> {
  const resend = getClient();
  if (!resend) {
    log.warn("RESEND_API_KEY missing — skipping email send.", { subject: args.subject });
    return { ok: true, skipped: true };
  }
  const from = requireEnv("EMAIL_FROM");
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    });
    if (error) {
      log.error("Resend send error", { error: error.message });
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    log.error("Resend send threw", { error: String(err) });
    return { ok: false, error: "resend_network_error" };
  }
}

/** Alert the founder. `replyTo` is set to the lead so the founder can reply directly. */
export function sendFounderAlert(
  args: { subject: string; html: string; text: string; replyTo?: string },
): Promise<SendResult> {
  const to = requireEnv("CONTACT_TO_EMAIL");
  return send({ to, ...args });
}

/** Send the autoresponder / result email to the visitor. */
export function sendToLead(
  args: { to: string; subject: string; html: string; text: string },
): Promise<SendResult> {
  return send(args);
}
