/**
 * Fix4U chatbot engine (PRD §2.4 live bot + §2.5 sandboxed demo).
 *
 * Runs a streaming agentic loop against the Google Gemini API: streams the model's text to the
 * caller token-by-token, and when the model calls a function it executes the tool, feeds the
 * result back, and continues — until the model finishes. UI-action tools (book_call,
 * handoff_whatsapp) are surfaced to the frontend as `action` events; `capture_lead` writes to
 * CRM + email.
 *
 * Model: `CHAT_MODEL` env (default gemini-2.5-flash). Thinking is disabled for low chat latency.
 */

import { GoogleGenAI, type Content, type FunctionCall, type Part } from "@google/genai";
import { chatModel, optionalEnv, publicEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";
import { chatTools } from "@/lib/chat/tools";
import { buildDemoSystemPrompt, buildLiveSystemPrompt } from "@/lib/chat/system-prompt";
import { getFaqs } from "@/lib/sanity/queries";
import { upsertContact } from "@/lib/integrations/hubspot";
import { sendFounderAlert, sendToLead } from "@/lib/integrations/resend";
import { contactFounderAlert, contactLeadAutoresponder } from "@/lib/email-templates";
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
  return Boolean(optionalEnv("GEMINI_API_KEY"));
}

export async function* runChat(opts: RunChatOptions): AsyncGenerator<ChatEvent> {
  const apiKey = optionalEnv("GEMINI_API_KEY");
  if (!apiKey) {
    yield { type: "error", message: "The assistant isn't configured yet. Please use the contact form or WhatsApp." };
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const system = opts.demo
    ? buildDemoSystemPrompt()
    : buildLiveSystemPrompt(await getFaqs().catch(() => []));

  // Gemini history uses roles "user" and "model".
  const contents: Content[] = opts.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const stream = await ai.models.generateContentStream({
        model: chatModel,
        contents,
        config: {
          systemInstruction: system,
          tools: [{ functionDeclarations: chatTools }],
          maxOutputTokens: MAX_TOKENS,
          // Disable thinking on flash for snappy first-token latency.
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      // Stream assistant text to the caller as it arrives; collect any function calls.
      let assistantText = "";
      const calls: FunctionCall[] = [];
      for await (const chunk of stream) {
        const delta = chunk.text;
        if (delta) {
          assistantText += delta;
          yield { type: "text", delta };
        }
        const fns = chunk.functionCalls;
        if (fns?.length) calls.push(...fns);
      }

      // No function calls → the assistant is done.
      if (!calls.length) break;

      // Record the model turn (its text + functionCall parts) before sending results back.
      const modelParts: Part[] = [];
      if (assistantText) modelParts.push({ text: assistantText });
      for (const call of calls) modelParts.push({ functionCall: call });
      contents.push({ role: "model", parts: modelParts });

      const responseParts: Part[] = [];
      for (const call of calls) {
        const { result, events } = await executeTool(call, opts.demo ?? false);
        for (const ev of events) yield ev;
        responseParts.push({
          functionResponse: { name: call.name ?? "", response: { result } },
        });
      }

      // Feed function results back so the model can compose its follow-up reply.
      contents.push({ role: "user", parts: responseParts });
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

/**
 * Collect a full (non-streaming) reply from the engine — used by the WhatsApp agent, which sends
 * one complete message rather than a token stream. Returns the assistant text plus a booking URL
 * if the model opened the scheduler (so the webhook can append the link to its reply).
 */
export async function runChatToReply(
  opts: RunChatOptions,
): Promise<{ text: string; bookingUrl?: string; error: boolean }> {
  let text = "";
  let bookingUrl: string | undefined;
  let error = false;
  for await (const ev of runChat(opts)) {
    if (ev.type === "text") text += ev.delta;
    else if (ev.type === "action" && ev.action === "book_call") bookingUrl = ev.url;
    else if (ev.type === "error") {
      error = true;
      if (!text) text = ev.message;
    }
  }
  return { text: text.trim(), bookingUrl, error };
}

/** Execute one function call. Returns the result text for the model + any UI events to emit. */
async function executeTool(
  call: FunctionCall,
  demo: boolean,
): Promise<{ result: string; events: ChatEvent[] }> {
  const input = (call.args ?? {}) as Record<string, unknown>;

  switch (call.name) {
    case "book_call": {
      const reason = str(input.reason);
      // Point visitors at our own booking page (the custom calendar → /api/book), not Cal.com.
      const url = `${publicEnv.siteUrl}/book`;
      if (demo) {
        return {
          result:
            "Demo booking confirmed. (In a real deployment this writes the appointment into the client's calendar and sends confirmations + reminders.)",
          events: [{ type: "action", action: "book_call", url, reason }],
        };
      }
      return {
        result: "The booking page has been shared with the visitor. Encourage them to pick a time.",
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
      return { result: `Unknown tool: ${call.name}`, events: [] };
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
