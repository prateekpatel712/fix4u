/**
 * HubSpot CRM integration (Tech Spec §5: "writes to HubSpot (contact + deal)").
 *
 * Uses the v3 CRM API with a Private App token. We upsert CONTACTS keyed by email (idempotent,
 * so repeat submissions don't create duplicates) and set lead-status / lifecycle properties.
 *
 * Deals are intentionally NOT created here: pipeline and deal-stage IDs are account-specific and
 * would 400 against a fresh portal. Track lead stage on the contact via `hs_lead_status`
 * ("NEW" → "CONNECTED" when a call is booked); wire deals in once the user shares their pipeline IDs.
 *
 * Every function degrades gracefully: if HUBSPOT_TOKEN is unset it logs and returns `{skipped:true}`
 * so a missing CRM never breaks a form submission.
 */

import { optionalEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";

const log = createLogger("hubspot");
const BASE = "https://api.hubapi.com";

export type LeadSource =
  | "contact_form"
  | "audit_request"
  | "newsletter"
  | "roi_calculator"
  | "chatbot"
  | "booking";

export interface UpsertContactInput {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  message?: string;
  niche?: string;
  source: LeadSource;
  /** HubSpot lead status; defaults to NEW on first touch. */
  leadStatus?: "NEW" | "OPEN" | "IN_PROGRESS" | "CONNECTED" | "UNQUALIFIED";
}

interface HubResult {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

/** Upsert a contact by email. Safe to call repeatedly for the same person. */
export async function upsertContact(input: UpsertContactInput): Promise<HubResult> {
  const token = optionalEnv("HUBSPOT_TOKEN");
  if (!token) {
    log.warn("HUBSPOT_TOKEN missing — skipping CRM upsert.", { source: input.source });
    return { ok: true, skipped: true };
  }

  // Map our fields onto standard HubSpot contact properties.
  const properties: Record<string, string> = {
    email: input.email,
    hs_lead_status: input.leadStatus ?? "NEW",
    lifecyclestage: "lead",
  };
  if (input.firstName) properties.firstname = input.firstName;
  if (input.lastName) properties.lastname = input.lastName;
  if (input.company) properties.company = input.company;
  // `message` and `niche` are stored on standard-ish fields; create custom props in HubSpot if desired.
  if (input.message) properties.message = input.message.slice(0, 65000);
  if (input.niche) properties.industry = input.niche;

  try {
    // Batch upsert keyed by email — creates or updates without duplicates.
    const res = await fetch(`${BASE}/crm/v3/objects/contacts/batch/upsert`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        inputs: [{ idProperty: "email", id: input.email, properties }],
      }),
    });

    if (!res.ok) {
      const detail = await safeText(res);
      log.error("HubSpot upsert failed", { status: res.status, detail });
      return { ok: false, error: `hubspot_${res.status}` };
    }
    const data = (await res.json()) as { results?: Array<{ id: string }> };
    return { ok: true, id: data.results?.[0]?.id };
  } catch (err) {
    log.error("HubSpot upsert threw", { error: String(err) });
    return { ok: false, error: "hubspot_network_error" };
  }
}

/**
 * Mark an existing contact as having booked a call (used by the Cal.com webhook).
 * No-op if the contact doesn't exist yet — the booking flow always upserts them first.
 */
export async function markCallBooked(email: string): Promise<HubResult> {
  const token = optionalEnv("HUBSPOT_TOKEN");
  if (!token) return { ok: true, skipped: true };

  try {
    const res = await fetch(
      `${BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          properties: { hs_lead_status: "CONNECTED", lifecyclestage: "salesqualifiedlead" },
        }),
      },
    );
    if (!res.ok) {
      const detail = await safeText(res);
      log.warn("markCallBooked update failed", { status: res.status, detail });
      return { ok: false, error: `hubspot_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    log.error("markCallBooked threw", { error: String(err) });
    return { ok: false, error: "hubspot_network_error" };
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return "";
  }
}
