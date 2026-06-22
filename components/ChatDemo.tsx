"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowUpRight } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  action?: { label: string; url: string };
}

const stamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const GREETING: Message = {
  sender: "bot",
  text: "Hi! I'm the AI assistant for Sunrise Med Spa. 🌸 How can I help you today?",
  timestamp: "12:00 PM",
};

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const suggestedPrompts = [
    "Do you have openings tomorrow?",
    "What services do you offer?",
    "How much is a Botox treatment?",
  ];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const container = chatContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    const history = [...messages, { sender: "user", text, timestamp: stamp() } as Message];
    setMessages(history);
    setInput("");
    setIsTyping(true);

    // Drop the seeded greeting and map to the API's role format.
    const payload = history.slice(1).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: payload, demo: true }),
      });

      if (!res.ok || !res.body) {
        let msg = "The assistant isn't available right now. Please use the contact form or WhatsApp.";
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

  const resetChat = () => {
    setMessages([GREETING]);
    setIsTyping(false);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[520px] w-full max-w-lg border border-white/[0.05] rounded-3xl bg-[#070709]/80 backdrop-blur-2xl shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-xs sm:text-sm text-paper flex items-center gap-1.5 uppercase tracking-wider">
              Sunrise Med Spa Bot
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald/65 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald"></span>
              </span>
            </h3>
            <p className="text-[9px] text-grey-dark uppercase tracking-widest font-mono mt-0.5 opacity-65">
              SECURE CONNECT &bull; F4U-AI
            </p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="text-[10px] text-grey hover:text-coral transition-colors duration-300 font-mono uppercase tracking-wider cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs ${
                msg.sender === "user"
                  ? "bg-coral/10 border-coral/20 text-coral"
                  : "bg-white/[0.02] border-white/[0.05] text-paper"
              }`}
            >
              {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className="flex flex-col gap-1">
              <div
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-coral text-ink font-semibold rounded-tr-none shadow-md shadow-coral/5"
                    : "bg-white/[0.01] border border-white/[0.05] text-paper rounded-tl-none"
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
              <span className="text-[9px] text-grey-dark self-start px-1 font-mono opacity-60">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-paper shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white/[0.01] border border-white/[0.05] text-paper px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce delay-200"></span>
                <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts (only before the conversation starts) */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-white/[0.03] bg-white/[0.01] flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="text-xs bg-ink hover:bg-coral hover:text-ink text-grey border border-white/[0.08] rounded-xl px-3.5 py-2 transition-all duration-300 font-semibold cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="px-6 py-4 border-t border-white/[0.05] bg-white/[0.01] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about services, pricing, or booking…"
          disabled={isTyping}
          className="flex-1 bg-ink/50 border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="p-2.5 bg-coral text-ink rounded-xl transition-all hover:scale-[1.03] disabled:bg-white/[0.02] disabled:text-grey-dark disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
