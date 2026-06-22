/**
 * WhatsApp Cloud API webhook — the AI agent's inbound door.
 *
 * GET  → Meta verification handshake (echo hub.challenge when the verify token matches).
 * POST → inbound message events. We verify Meta's signature, ack 200 immediately, then (via Next's
 *        after()) run the Gemini engine on the message + recent history and reply through the Cloud
 *        API. Acking fast avoids Meta's webhook retries; after() keeps the work alive past the response.
 *
 * Reuses the same Gemini brain as the website chat (lib/chat/engine) — WhatsApp is just another front door.
 */

import { after } from "next/server";
import { createLogger } from "@/lib/logger";
import {
  sendWhatsappText,
  verifyWhatsappSignature,
  whatsappVerifyToken,
  whatsappCloudConfigured,
} from "@/lib/integrations/whatsapp-cloud";
import { runChatToReply } from "@/lib/chat/engine";
import { appendTurn } from "@/lib/chat/whatsapp-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const log = createLogger("api/whatsapp");

// Dedupe Meta webhook retries (the same message id can be delivered more than once).
const seen = new Set<string>();
function markSeen(id: string): boolean {
  if (seen.has(id)) return true;
  seen.add(id);
  if (seen.size > 1000) seen.clear(); // crude bound; ids are short-lived
  return false;
}

// Minimal shape of the inbound webhook payload we care about (text messages only).
interface WaWebhook {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          type?: string;
          from?: string;
          id?: string;
          text?: { body?: string };
        }>;
      };
    }>;
  }>;
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = whatsappVerifyToken();
  if (mode === "subscribe" && expected && token === expected) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request): Promise<Response> {
  const raw = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  if (!verifyWhatsappSignature(raw, signature)) {
    log.warn("Invalid WhatsApp webhook signature");
    return new Response("Forbidden", { status: 403 });
  }

  let payload: WaWebhook;
  try {
    payload = JSON.parse(raw) as WaWebhook;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  // Pull inbound text messages out of the (possibly batched) payload.
  const tasks: Array<{ from: string; text: string; id: string }> = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const msg of change.value?.messages ?? []) {
        if (msg.type === "text" && msg.text?.body && msg.from && msg.id) {
          tasks.push({ from: msg.from, text: msg.text.body, id: msg.id });
        }
      }
    }
  }

  // Ack immediately; generate + send replies after the response so Meta never times out / retries.
  after(async () => {
    if (!whatsappCloudConfigured()) {
      log.warn("WhatsApp inbound received but Cloud API not configured — skipping reply.");
      return;
    }
    for (const t of tasks) {
      if (markSeen(t.id)) continue;
      try {
        const history = appendTurn(t.from, { role: "user", content: t.text });
        const { text, bookingUrl } = await runChatToReply({ messages: history, demo: false });
        let reply = text || "Sorry, I didn't catch that — could you rephrase?";
        if (bookingUrl) reply += `\n\nPick a time here: ${bookingUrl}`;
        appendTurn(t.from, { role: "assistant", content: reply });
        await sendWhatsappText(t.from, reply);
      } catch (err) {
        log.error("Failed to handle WhatsApp message", { error: String(err) });
      }
    }
  });

  return new Response("OK", { status: 200 });
}
