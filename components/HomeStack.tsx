"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, Laptop, Search } from "lucide-react";

export default function HomeStack() {
  const stackItems = [
    {
      num: "01",
      title: "AI Booking Agent",
      subtitle: "Primary Funnel Receptionist",
      desc: "Custom-trained chatbot receptionists operating on WhatsApp, Instagram DMs, and Web Chat. They reply instantly, answer treatment FAQs, filter out tyre-kickers, and book slots directly in your calendar.",
      icon: <Bot className="w-8 h-8 text-coral" />,
      link: "/ai-booking-agent",
      bgColor: "bg-[#070709]/80 backdrop-blur-2xl border-white/[0.05] hover:border-coral/20",
      glowColor: "rgba(255, 86, 64, 0.05)"
    },
    {
      num: "02",
      title: "Conversion Website",
      subtitle: "Speed-tuned Lead Capture",
      desc: "Super-fast, custom-coded landing pages designed to capture local search and ad traffic. Optimized to run at 100/100 Lighthouse performance scores and direct leads immediately into the chat receptionist.",
      icon: <Laptop className="w-8 h-8 text-violet" />,
      link: "/book",
      bgColor: "bg-[#070709]/80 backdrop-blur-2xl border-white/[0.05] hover:border-violet/20",
      glowColor: "rgba(139, 92, 246, 0.05)"
    },
    {
      num: "03",
      title: "Targeted Acquisition",
      subtitle: "High-Intent Pipeline Fuel",
      desc: "Local search SEO configurations and paid ad setups (Instagram/Facebook/Google Ads) tuned to generate qualified leads that feed directly into your WhatsApp and web chatbot funnels.",
      icon: <Search className="w-8 h-8 text-coral" />,
      link: "/book",
      bgColor: "bg-[#070709]/80 backdrop-blur-2xl border-white/[0.05] hover:border-coral/20",
      glowColor: "rgba(255, 86, 64, 0.05)"
    }
  ];

  return (
    <section className="py-24 border-b border-white/[0.05] bg-ink relative">
      {/* Background glowing particles */}
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-coral/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="max-w-2xl space-y-3">
          <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
            ACQUISITION PILLARS
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-paper tracking-tight leading-[1.05]">
            Integrated funnel technology for local service clinics
          </h2>
        </div>
      </div>

      {/* Stacking Cards Container */}
      <div className="max-w-4xl mx-auto px-6 flex flex-col gap-12 relative z-10">
        {stackItems.map((item, idx) => (
          <div
            key={idx}
            className={`sticky top-28 w-full border rounded-[32px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8 md:gap-16 items-start justify-between min-h-[300px] transition-all duration-500 hover:scale-[1.01] ${item.bgColor}`}
            style={{ 
              boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 0 30px ${item.glowColor}`
            }}
          >
            {/* Left part: Order & Title */}
            <div className="flex flex-col gap-6 md:max-w-md">
              <div className="flex items-center gap-4 text-xs font-mono tracking-widest">
                <span className="text-coral font-bold text-base">{item.num}</span>
                <span className="text-grey-dark uppercase font-semibold opacity-70">/ {item.subtitle}</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-display font-black text-2xl sm:text-3xl text-paper tracking-tight uppercase">
                  {item.title}
                </h3>
                <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <Link
                href={item.link}
                className="inline-flex items-center justify-center gap-2 bg-coral text-ink font-sans text-xs font-bold uppercase tracking-wider py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Learn more</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Right part: Icon representation */}
            <div className="w-24 h-24 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex items-center justify-center shrink-0 self-center md:self-auto shadow-inner">
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
