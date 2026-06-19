"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import ChatDemo from "@/components/ChatDemo";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/AnimatedTitle";
import { motion } from "framer-motion";

export default function DemoPage() {
  const steps = [
    {
      title: "1. Capture",
      desc: "Lead initiates interaction via Web Chat, WhatsApp, or Instagram DM."
    },
    {
      title: "2. Engage & Qualify",
      desc: "AI replies in seconds, answers questions about pricing and services, and verifies suitability."
    },
    {
      title: "3. Calendar Schedule",
      desc: "Once qualified, the agent drops the meeting onto your calendar and triggers reminders."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-coral/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Context Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col gap-6 items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-coral text-xs font-mono font-semibold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5 text-coral" /> Sandbox Chatbot
            </div>
            
            <AnimatedTitle
              lines={[
                <span key="1">Experience the AI</span>,
                <span key="2" className="text-coral italic">Booking Receptionist</span>
              ]}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-paper leading-[1.05]"
            />
            
            <p className="text-grey-dark text-sm sm:text-base leading-relaxed max-w-xl">
              This is a live simulation of a custom AI assistant built for a local med spa. Try choosing the suggested prompts on the chat screen to experience how the agent handles client intent.
            </p>

            {/* Explanation box */}
            <div className="w-full border border-white/[0.05] rounded-3xl p-6 md:p-8 bg-white/[0.01] backdrop-blur-2xl space-y-4 hover:border-coral/25 transition-colors duration-500 shadow-2xl">
              <h3 className="font-display font-bold text-base text-paper flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-coral" /> What is happening behind the scenes?
              </h3>
              
              <div className="flex flex-col gap-4">
                {steps.map((st, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-coral/10 border border-coral/25 flex items-center justify-center text-coral shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-paper uppercase tracking-wider">{st.title}</h4>
                      <p className="text-[11px] text-grey-dark leading-relaxed mt-1">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Link CTA */}
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-coral text-ink font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-coral/10"
            >
              Train one for my business <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Interactive Chatbot */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-6 flex justify-center w-full"
          >
            <ChatDemo />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
