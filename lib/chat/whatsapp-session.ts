/**
 * In-memory conversation memory for the WhatsApp AI agent.
 *
 * The Cloud API delivers only the new inbound message, so we keep recent turns per customer phone
 * to give the Gemini engine context for multi-turn booking. This store is process-local: it works
 * while the serverless function stays warm and for local testing, but resets on cold starts /
 * redeploys. For production durability, back this with Upstash Redis / Vercel KV (swap the Map).
 */

import type { ChatTurn } from "@/lib/chat/engine";

const TTL_MS = 2 * 60 * 60 * 1000; // 2h idle → the conversation resets
const MAX_TURNS = 20; // keep the last N turns to bound token cost

interface Session {
  messages: ChatTurn[];
  updatedAt: number;
}

const sessions = new Map<string, Session>();

/** Recent turns for a phone, or [] if none / expired. */
export function getSession(phone: string): ChatTurn[] {
  const s = sessions.get(phone);
  if (!s) return [];
  if (Date.now() - s.updatedAt > TTL_MS) {
    sessions.delete(phone);
    return [];
  }
  return s.messages;
}

/** Append a turn and return the updated (trimmed) history. */
export function appendTurn(phone: string, turn: ChatTurn): ChatTurn[] {
  const existing = getSession(phone);
  const messages = [...existing, turn].slice(-MAX_TURNS);
  sessions.set(phone, { messages, updatedAt: Date.now() });
  return messages;
}
