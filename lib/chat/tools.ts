/**
 * Chatbot tool definitions (PRD §2.4 — the bot can book a call or hand off to WhatsApp).
 *
 * These are Gemini function declarations: the model decides when to call them; our engine
 * executes them. `book_call` and `handoff_whatsapp` are *UI-action* tools (the engine signals
 * the frontend to open the scheduler / WhatsApp). `capture_lead` is a *side-effect* tool
 * (writes to CRM + email).
 *
 * Descriptions are prescriptive about WHEN to call each tool so the model reaches for them at
 * the right moment (booking intent, WhatsApp preference, follow-up request).
 */

import { Type, type FunctionDeclaration } from "@google/genai";

export const chatTools: FunctionDeclaration[] = [
  {
    name: "book_call",
    description:
      "Open the booking scheduler so the visitor can book a free 15-minute discovery call. " +
      "Call this as soon as the visitor signals buying intent: asks to book, wants a call/demo " +
      "for their own business, wants to discuss pricing seriously, or asks to talk to a human. " +
      "Prefer booking over endless Q&A once intent is clear.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        reason: {
          type: Type.STRING,
          description: "Short note on why they're booking (their goal or main problem).",
        },
        name: { type: Type.STRING, description: "Visitor's name, if known." },
        email: { type: Type.STRING, description: "Visitor's email, if shared." },
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
    parameters: {
      type: Type.OBJECT,
      properties: {
        message: {
          type: Type.STRING,
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
    parameters: {
      type: Type.OBJECT,
      properties: {
        email: { type: Type.STRING, description: "Visitor's email (required)." },
        name: { type: Type.STRING, description: "Visitor's name." },
        business: { type: Type.STRING, description: "Their business name." },
        niche: { type: Type.STRING, description: "Their industry/niche, e.g. med spa, dental, gym." },
        note: { type: Type.STRING, description: "What they want / their main problem." },
      },
      required: ["email"],
    },
  },
];
