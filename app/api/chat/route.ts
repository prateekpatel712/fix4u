/**
 * POST /api/chat — streaming chatbot endpoint (PRD §2.4 live bot, §2.5 demo).
 *
 * Returns Server-Sent Events. Each line is `data: <json ChatEvent>\n\n`:
 *   { type: "text", delta }                          incremental assistant text
 *   { type: "action", action: "book_call", url }     open the scheduler
 *   { type: "action", action: "handoff_whatsapp", url }
 *   { type: "lead_captured", email }
 *   { type: "done" } | { type: "error", message }
 *
 * The frontend chat widget consumes this stream. The Anthropic call happens server-side, so the
 * API key never reaches the browser.
 */

import { badRequest, enforceRateLimit, json, readJson } from "@/lib/api";
import { chatSchema, fieldErrors } from "@/lib/validation";
import { runChat, chatConfigured } from "@/lib/chat/engine";

export const runtime = "nodejs";
// Don't let the platform cache a streamed conversation.
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const limited = enforceRateLimit(req, "chat", 30, 60_000);
  if (limited) return limited;

  if (!chatConfigured()) {
    return json(
      { ok: false, error: "The assistant isn't available right now. Please use the contact form or WhatsApp." },
      503,
    );
  }

  const body = await readJson(req);
  if (!body) return badRequest("Invalid request body.");

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid chat payload.", { fields: fieldErrors(parsed.error) });

  const { messages, demo } = parsed.data;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        for await (const event of runChat({ messages, demo })) {
          send(event);
        }
      } catch {
        send({ type: "error", message: "Stream interrupted. Please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
