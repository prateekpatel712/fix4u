/**
 * Fix4U chatbot engine (PRD §2.4 live bot + §2.5 sandboxed demo).
 *
 * Runs a streaming agentic loop against the Anthropic API: streams the model's text to the
 * caller token-by-token, and when the model calls a tool it executes the tool, feeds the result
 * back, and continues — until the model finishes. UI-action tools (book_call, handoff_whatsapp)
 * are surfaced to the frontend as `action` events; `capture_lead` writes to CRM + email.
 *
 * Model: `CHAT_MODEL` env (default claude-opus-4-8). Thinking is omitted for low chat latency;
 * effort is left at the model default so the engine stays valid if CHAT_MODEL is switched to
 * Haiku/Sonnet for cost. See the claude-api guidance.
 */

import Anthropic from "@anthropic-ai/sdk";
import { chatModel, optionalEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";
import { chatTools } from "@/lib/chat/tools";
import { buildDemoSystemPrompt, buildLiveSystemPrompt } from "@/lib/chat/system-prompt";
import { getFaqs } from "@/lib/sanity/queries";
import { upsertContact } from "@/lib/integrations/hubspot";
import { sendFounderAlert, sendToLead } from "@/lib/integrations/resend";
import { contactFounderAlert, contactLeadAutoresponder } from "@/lib/email-templates";
import { calcomBookingUrl } from "@/lib/integrations/calcom";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/integrations/whatsapp";

const log = createLogger("chat-engine");

const MAX_TOOL_ITERATIONS = 5;
const MAX_TOKENS = 1024;

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Events streamed out of the engine; the API route serialises these as SSE. */
export type ChatEvent =
  | { type: "text"; delta: string }
  | { type: "action"; action: "book_call"; url: string; reason?: string }
  | { type: "action"; action: "handoff_whatsapp"; url: string }
  | { type: "lead_captured"; email: string }
  | { type: "done" }
  | { type: "error"; message: string };

export interface RunChatOptions {
  messages: ChatTurn[];
  demo?: boolean;
}

/** True when the chatbot can run (API key present). */
export function chatConfigured(): boolean {
  return Boolean(optionalEnv("ANTHROPIC_API_KEY"));
}

export async function* runChat(opts: RunChatOptions): AsyncGenerator<ChatEvent> {
  const apiKey = optionalEnv("ANTHROPIC_API_KEY");
  if (!apiKey) {
    yield { type: "error", message: "The assistant isn't configured yet. Please use the contact form or WhatsApp." };
    return;
  }

  const client = new Anthropic({ apiKey });
  const system = opts.demo
    ? buildDemoSystemPrompt()
    : buildLiveSystemPrompt(await getFaqs().catch(() => []));

  const messages: Anthropic.MessageParam[] = opts.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const stream = client.messages.stream({
        model: chatModel,
        max_tokens: MAX_TOKENS,
        system,
        tools: chatTools,
        messages,
      });

      // Stream assistant text to the caller as it arrives.
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta" &&
          event.delta.text
        ) {
          yield { type: "text", delta: event.delta.text };
        }
      }

      const final = await stream.finalMessage();

      // No tool calls → the assistant is done.
      if (final.stop_reason !== "tool_use") break;

      // Record the assistant turn (with its tool_use blocks) before sending results.
      // The SDK's response content blocks round-trip back as request params; the cast bridges
      // the response/param type split (e.g. citation field shapes) without losing the blocks.
      messages.push({
        role: "assistant",
        content: final.content as unknown as Anthropic.ContentBlockParam[],
      });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of final.content) {
        if (block.type !== "tool_use") continue;
        const { result, events } = await executeTool(block, opts.demo ?? false);
        for (const ev of events) yield ev;
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }

      // Feed tool results back so the model can compose its follow-up reply.
      messages.push({ role: "user", content: toolResults });
    }

    yield { type: "done" };
  } catch (err) {
    log.error("runChat failed", { error: String(err) });
    yield {
      type: "error",
      message: "Something went wrong on our end. Please try again, or book a call / message us on WhatsApp.",
    };
  }
}

/** Execute one tool call. Returns the tool_result text for the model + any UI events to emit. */
async function executeTool(
  block: Anthropic.ToolUseBlock,
  demo: boolean,
): Promise<{ result: string; events: ChatEvent[] }> {
  const input = (block.input ?? {}) as Record<string, unknown>;

  switch (block.name) {
    case "book_call": {
      const name = str(input.name);
      const email = str(input.email);
      const reason = str(input.reason);
      const url = calcomBookingUrl({ name, email, notes: reason });
      if (demo) {
        return {
          result:
            "Demo booking confirmed. (In a real deployment this writes the appointment into the client's calendar and sends confirmations + reminders.)",
          events: [{ type: "action", action: "book_call", url, reason }],
        };
      }
      return {
        result: "The booking scheduler has been opened for the visitor. Encourage them to pick a time.",
        events: [{ type: "action", action: "book_call", url, reason }],
      };
    }

    case "handoff_whatsapp": {
      const message = str(input.message) || defaultWhatsappMessage();
      const url = whatsappLink(message);
      return {
        result: "A WhatsApp link has been shown to the visitor.",
        events: [{ type: "action", action: "handoff_whatsapp", url }],
      };
    }

    case "capture_lead": {
      const email = str(input.email);
      if (!email) {
        return { result: "No email was provided, so nothing was saved. Ask the visitor for their email.", events: [] };
      }
      if (demo) {
        return {
          result: "Demo lead captured (not actually stored in the sandbox).",
          events: [{ type: "lead_captured", email }],
        };
      }
      await captureLead({
        email,
        name: str(input.name),
        business: str(input.business),
        niche: str(input.niche),
        note: str(input.note),
      });
      return {
        result: "The visitor's details were saved and the team was notified. Confirm we'll follow up shortly.",
        events: [{ type: "lead_captured", email }],
      };
    }

    default:
      return { result: `Unknown tool: ${block.name}`, events: [] };
  }
}

/** Persist a chatbot-sourced lead to CRM + notify founder + autorespond. Best-effort. */
async function captureLead(lead: {
  email: string;
  name?: string;
  business?: string;
  niche?: string;
  note?: string;
}): Promise<void> {
  const displayName = lead.name || "there";
  await Promise.allSettled([
    upsertContact({
      email: lead.email,
      firstName: lead.name,
      company: lead.business,
      niche: lead.niche,
      message: lead.note,
      source: "chatbot",
    }),
    sendFounderAlert({
      ...contactFounderAlert({
        name: lead.name || "Chatbot lead",
        email: lead.email,
        business: lead.business,
        niche: lead.niche,
        message: lead.note || "(captured via website chatbot)",
      }),
      replyTo: lead.email,
    }),
    sendToLead({ to: lead.email, ...contactLeadAutoresponder({ name: displayName }) }),
  ]);
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}
