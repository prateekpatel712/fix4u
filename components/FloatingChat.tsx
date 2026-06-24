"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ArrowUpRight } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  action?: { label: string; url: string };
}

const stamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Keep in sync with MAX_CHAT_USER_MESSAGES on the server (lib/env.ts). */
const MAX_USER_MESSAGES = 10;

const GREETING: Message = {
  sender: "bot",
  text: "Hi! 👋 I'm the Fix4U assistant. Ask me anything about getting an AI agent for your business — or I can book you a quick call.",
  timestamp: stamp(),
};

const SUGGESTED = ["How does it work?", "How much does it cost?", "Does it work on WhatsApp?"];

/**
 * Persistent floating chat widget (bottom-right, all pages). Talks to the LIVE Fix4U assistant
 * (no `demo` flag) via the streaming /api/chat SSE endpoint — answers, qualifies, books, in any
 * language. Distinct from the homepage ChatDemo, which role-plays a sample client's bot.
 */
export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  // True when the launcher sits over a coral background (hero/footer) — flip it dark so it stays visible.
  const [onCoral, setOnCoral] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userMessageCount = messages.filter((m) => m.sender === "user").length;
  const limitReached = userMessageCount >= MAX_USER_MESSAGES;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, open]);

  // Sample the background directly behind the launcher and adapt only when it's coral.
  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      const x = window.innerWidth - 34;
      const y = window.innerHeight - 34;
      for (const el of document.elementsFromPoint(x, y)) {
        if ((el as HTMLElement).closest("[data-chat-widget]")) continue;
        const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
        if (!m) continue;
        if ((m[4] === undefined ? 1 : Number(m[4])) === 0) continue; // transparent → look deeper
        const r = Number(m[1]);
        const g = Number(m[2]);
        const b = Number(m[3]);
        setOnCoral(r > 200 && g < 150 && b < 150); // coral-ish, distinct from ink + paper
        return;
      }
      setOnCoral(false);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sample);
    };
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || isTyping || limitReached) return;

    const history = [...messages, { sender: "user", text, timestamp: stamp() } as Message];
    setMessages(history);
    setInput("");
    setIsTyping(true);

    // Drop the seeded greeting; map to the API's role format. No `demo` flag → live Fix4U assistant.
    const payload = history.slice(1).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok || !res.body) {
        let msg = "I'm having trouble right now. Please use the contact form or WhatsApp.";
        try {
          const j = (await res.json()) as { error?: string };
          if (j?.error) msg = j.error;
        } catch {}
        setIsTyping(false);
        setMessages((p) => [...p, { sender: "bot", text: msg, timestamp: stamp() }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let botText = "";
      let botAction: Message["action"];
      let started = false;

      const paint = () =>
        setMessages((p) => {
          const next = [...p];
          const last = next[next.length - 1];
          if (last?.sender === "bot") next[next.length - 1] = { ...last, text: botText, action: botAction };
          return next;
        });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          let evt: { type?: string; delta?: string; action?: string; url?: string; message?: string };
          try {
            evt = JSON.parse(line.slice(5).trim());
          } catch {
            continue;
          }
          if (evt.type === "text") {
            if (!started) {
              started = true;
              setIsTyping(false);
              setMessages((p) => [...p, { sender: "bot", text: "", timestamp: stamp() }]);
            }
            botText += evt.delta || "";
            paint();
          } else if (evt.type === "action" && evt.url) {
            botAction = {
              label:
                evt.action === "book_call"
                  ? "Book a call"
                  : evt.action === "handoff_whatsapp"
                  ? "Chat on WhatsApp"
                  : "Open",
              url: evt.url,
            };
            if (started) paint();
          } else if (evt.type === "error" && !started) {
            setIsTyping(false);
            setMessages((p) => [...p, { sender: "bot", text: evt.message || "Something went wrong.", timestamp: stamp() }]);
          }
        }
      }
      setIsTyping(false);
    } catch {
      setIsTyping(false);
      setMessages((p) => [...p, { sender: "bot", text: "Connection error. Please try again.", timestamp: stamp() }]);
    }
  };

  return (
    <>
      {/* Chat panel */}
      <div
        data-chat-widget
        className={`fixed z-[100] bottom-24 right-4 left-4 sm:left-auto sm:w-[380px] transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-[62vh] max-h-[540px] border border-ink/10 rounded-3xl bg-white shadow-2xl overflow-hidden font-sans">
          {/* Header — branded coral bar */}
          <div className="flex items-center justify-between px-5 py-4 bg-coral">
            <div className="flex items-center gap-3">
              <span className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-coral" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald border-2 border-coral" />
              </span>
              <div>
                <h3 className="font-display font-bold text-[15px] text-ink leading-tight">Fix4U Assistant</h3>
                <p className="text-[11px] text-ink/65 mt-0.5">Online · replies in seconds</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="w-8 h-8 flex items-center justify-center rounded-full text-ink/70 hover:bg-ink/10 hover:text-ink transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 max-w-[88%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    msg.sender === "user"
                      ? "bg-coral/15 border-coral/30 text-coral"
                      : "bg-ink/[0.04] border-ink/10 text-ink"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col gap-1">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-coral text-ink font-semibold rounded-tr-none"
                        : "bg-ink/[0.04] border border-ink/10 text-ink rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                    {msg.action && (
                      <a
                        href={msg.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 bg-coral text-ink font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-lg hover:scale-[1.02] transition-transform"
                      >
                        {msg.action.label} <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-ink/[0.04] border border-ink/10 flex items-center justify-center text-ink shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-ink/[0.04] border border-ink/10 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts (before the conversation starts) */}
          {messages.length === 1 && !limitReached && (
            <div className="px-5 py-3 border-t border-ink/[0.08] bg-white flex flex-wrap gap-2">
              {SUGGESTED.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-xs bg-white hover:bg-coral hover:text-ink text-ink/80 border border-ink/15 rounded-xl px-3 py-2 transition-all font-semibold cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input — or booking CTA once the demo limit is reached */}
          {limitReached ? (
            <div className="px-5 py-4 border-t border-ink/[0.08] bg-white flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-[11px] text-ink/60 flex-1 leading-relaxed">Let&apos;s keep going on a quick call — it&apos;s free.</p>
              <a
                href="/book"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-coral text-ink font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-transform"
              >
                Book a call <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="px-5 py-4 border-t border-ink/[0.08] bg-white flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                disabled={isTyping}
                className="flex-1 bg-ink/[0.03] border border-ink/15 rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-coral transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="p-2.5 bg-coral text-ink rounded-xl transition-all hover:scale-[1.03] disabled:bg-ink/10 disabled:text-ink/30 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Floating launcher button — flips dark over coral backgrounds so it stays visible */}
      <button
        data-chat-widget
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`fixed z-[100] bottom-5 right-5 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
          onCoral ? "bg-ink text-paper shadow-black/40" : "bg-coral text-ink shadow-coral/30"
        }`}
      >
        {!open && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping ${
              onCoral ? "bg-ink" : "bg-coral"
            }`}
          />
        )}
        <span className="relative">{open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}</span>
      </button>
    </>
  );
}
