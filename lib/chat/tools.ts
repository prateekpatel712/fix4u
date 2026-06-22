/**
 * Chatbot tool definitions (PRD §2.4 — the bot can book a call or hand off to WhatsApp).
 *
 * These are user-defined tools: Claude decides when to call them; our engine executes them.
 * `book_call` and `handoff_whatsapp` are *UI-action* tools (the engine signals the frontend to
 * open the scheduler / WhatsApp). `capture_lead` is a *side-effect* tool (writes to CRM + email).
 *
 * Descriptions are prescriptive about WHEN to call each tool — recent Claude models reach for
 * tools conservatively, so the trigger conditions matter (per the API tool-use guidance).
 */

import type Anthropic from "@anthropic-ai/sdk";

export const chatTools: Anthropic.Tool[] = [
  {
    name: "book_call",
    description:
      "Open the booking scheduler so the visitor can book a free 15-minute discovery call. " +
      "Call this as soon as the visitor signals buying intent: asks to book, wants a call/demo " +
      "for their own business, wants to discuss pricing seriously, or asks to talk to a human. " +
      "Prefer booking over endless Q&A once intent is clear.",
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Short note on why they're booking (their goal or main problem).",
        },
        name: { type: "string", description: "Visitor's name, if known." },
        email: { type: "string", description: "Visitor's email, if shared." },
      },
      required: [],
    },
  },
  {
    name: "handoff_whatsapp",
    description:
      "Hand the visitor off to WhatsApp with a prefilled message. Call this when the visitor " +
      "says they prefer WhatsApp/messaging, asks to continue there, or is clearly a mobile/DM user " +
      "who wants a quick human chat.",
    input_schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Prefilled WhatsApp message text tailored to the conversation.",
        },
      },
      required: [],
    },
  },
  {
    name: "capture_lead",
    description:
      "Save the visitor's contact details for follow-up. Call this ONLY after the visitor has " +
      "shared a valid email and wants Fix4U to follow up (e.g. they can't book now but are interested). " +
      "Always include the email; include name/business/niche when known.",
    input_schema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Visitor's email (required)." },
        name: { type: "string", description: "Visitor's name." },
        business: { type: "string", description: "Their business name." },
        niche: { type: "string", description: "Their industry/niche, e.g. med spa, dental, gym." },
        note: { type: "string", description: "What they want / their main problem." },
      },
      required: ["email"],
    },
  },
];
