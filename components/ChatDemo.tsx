"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! I'm the AI assistant for Sunrise Med Spa. 🌸 How can I help you today?",
      timestamp: "12:00 PM",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const suggestedPrompts = [
    "Do you have openings tomorrow?",
    "What services do you offer?",
    "How much is a Botox treatment?",
  ];

  const conversationFlow: Record<string, { reply: string[]; nextPrompts: string[] }> = {
    "Do you have openings tomorrow?": {
      reply: [
        "Yes, we do! We have openings for consultations or treatments tomorrow at 10:00 AM, 1:30 PM, and 4:00 PM.",
        "Which of those times works best for you?",
      ],
      nextPrompts: ["1:30 PM works!", "What is your pricing first?"],
    },
    "What services do you offer?": {
      reply: [
        "We specialize in premium aesthetic treatments: Dermal Fillers, Botox, Laser Skin Resurfacing, and Custom Facials.",
        "Would you like to book a free 15-minute consultation to see which is right for you?",
      ],
      nextPrompts: ["Yes, let's book a consultation", "Botox pricing please"],
    },
    "How much is a Botox treatment?": {
      reply: [
        "Botox is $12 per unit, and typical treatments range from $180 to $360 depending on your goals.",
        "We also offer a complimentary consultation for first-time clients. Shall we get you scheduled?",
      ],
      nextPrompts: ["Yes, let's schedule it", "No thanks, just looking"],
    },
    "1:30 PM works!": {
      reply: [
        "Awesome! To reserve 1:30 PM tomorrow, could you please provide your full name and email address?",
      ],
      nextPrompts: ["Maya Lin, maya@example.com"],
    },
    "What is your pricing first?": {
      reply: [
        "Of course! Consultation is free. Botox is $12/unit, Fillers start at $550/syringe, and Facials are $120.",
        "Would you like to reserve that 1:30 PM slot while it's still available?",
      ],
      nextPrompts: ["Yes, let's do 1:30 PM", "No, too expensive"],
    },
    "Yes, let's book a consultation": {
      reply: [
        "Excellent choice! I have slots open tomorrow at 10:00 AM and 1:30 PM. Which works best?",
      ],
      nextPrompts: ["10:00 AM works", "1:30 PM works!"],
    },
    "Botox pricing please": {
      reply: [
        "Botox is $12 per unit, with first-time consultations being completely free.",
        "Would you like to book a slot for a Botox consultation tomorrow?",
      ],
      nextPrompts: ["Yes, let's book a consultation"],
    },
    "Yes, let's schedule it": {
      reply: [
        "Perfect! I have slots open tomorrow at 1:30 PM and 4:00 PM. Which works best?",
      ],
      nextPrompts: ["1:30 PM works!", "4:00 PM works"],
    },
    "No thanks, just looking": {
      reply: [
        "No problem at all! Feel free to ask if you have any questions. Have a wonderful day!",
      ],
      nextPrompts: ["Actually, what services do you have?"],
    },
    "Maya Lin, maya@example.com": {
      reply: [
        "Perfect, Maya! I have locked in your Botox Consultation for tomorrow (Friday) at 1:30 PM. 🎉",
        "A calendar invite has been sent to maya@example.com, and we'll send a text reminder 2 hours before. See you soon!",
      ],
      nextPrompts: ["Awesome, thank you!"],
    },
    "Yes, let's do 1:30 PM": {
      reply: [
        "Great! To finalize, could you share your name and email?",
      ],
      nextPrompts: ["Maya Lin, maya@example.com"],
    },
    "No, too expensive": {
      reply: [
        "We understand! We occasionally run promotions. Would you like us to notify you next time we do?",
      ],
      nextPrompts: ["Yes, notify me", "No thanks"],
    },
    "10:00 AM works": {
      reply: [
        "Great! Can I get your name and email to finalize the booking?",
      ],
      nextPrompts: ["Maya Lin, maya@example.com"],
    },
    "4:00 PM works": {
      reply: [
        "Great! Can I get your name and email to finalize the booking?",
      ],
      nextPrompts: ["Maya Lin, maya@example.com"],
    },
    "Awesome, thank you!": {
      reply: [
        "You're very welcome! If you need to reschedule, just click the link in your email. See you tomorrow!",
      ],
      nextPrompts: [],
    },
    "Yes, notify me": {
      reply: [
        "Perfect! Please enter your phone number to get added to our promo list.",
      ],
      nextPrompts: ["+1 (555) 019-2834"],
    },
    "+1 (555) 019-2834": {
      reply: [
        "Got it! You're all set. We'll text you when our next special runs. Have a great day!",
      ],
      nextPrompts: [],
    },
  };

  const [activePrompts, setActivePrompts] = useState<string[]>(suggestedPrompts);

  useEffect(() => {
    // Skip the initial mount so a page refresh never yanks the window down to
    // this below-the-fold chat. After that, keep the chat panel itself pinned
    // to the latest message — scroll the container only, not the page.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handlePromptClick = (prompt: string) => {
    const userMsg: Message = {
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setActivePrompts([]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const flow = conversationFlow[prompt];

      if (flow) {
        const botMsgs: Message[] = flow.reply.map((txt) => ({
          sender: "bot",
          text: txt,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
        setMessages((prev) => [...prev, ...botMsgs]);
        setActivePrompts(flow.nextPrompts);
      } else {
        const fallbackMsg: Message = {
          sender: "bot",
          text: "I'd be happy to assist you with that! Let's connect you with our booking page so you can select the perfect slot.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setActivePrompts([]);
      }
    }, 1200);
  };

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! I'm the AI assistant for Sunrise Med Spa. 🌸 How can I help you today?",
        timestamp: "12:00 PM",
      },
    ]);
    setActivePrompts(suggestedPrompts);
    setIsTyping(false);
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
          className="text-[10px] text-grey hover:text-coral transition-colors duration-300 font-mono uppercase tracking-wider"
        >
          Reset
        </button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
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
                {msg.text.includes("Appointment booked") || msg.text.includes("locked in") ? (
                  <span className="flex flex-col gap-2">
                    <span className="flex items-center gap-1.5 text-coral font-bold font-display uppercase text-xs tracking-wider">
                      <Sparkles className="w-4 h-4 text-coral shrink-0" />
                      Slot Confirmed
                    </span>
                    <span>{msg.text}</span>
                  </span>
                ) : (
                  msg.text
                )}
              </div>
              <span className="text-[9px] text-grey-dark self-start px-1 font-mono opacity-60">
                {msg.timestamp}
              </span>
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

      {/* Suggested Prompts */}
      {activePrompts.length > 0 && (
        <div className="px-6 py-3 border-t border-white/[0.03] bg-white/[0.01] flex flex-wrap gap-2">
          {activePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              className="text-xs bg-ink hover:bg-coral hover:text-ink text-grey border border-white/[0.08] rounded-xl px-3.5 py-2 transition-all duration-300 font-semibold cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Placeholder */}
      <div className="px-6 py-4 border-t border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
        <input
          type="text"
          placeholder="Use the quick actions above to chat..."
          disabled
          className="flex-1 bg-ink/50 border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs text-grey-dark cursor-not-allowed"
        />
        <button
          disabled
          className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl text-grey-dark cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
