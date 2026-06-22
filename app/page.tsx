"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import HomeNav from "@/components/HomeNav";
import Hero from "@/components/Hero";
import HeroVideo from "@/components/HeroVideo";
import HomeVision from "@/components/HomeVision";
import HomeSchema from "@/components/HomeSchema";
import HomeStack from "@/components/HomeStack";
import ChatDemo from "@/components/ChatDemo";
import RoiCalculator from "@/components/RoiCalculator";
import HomeValue from "@/components/HomeValue";
import HomeSystem from "@/components/HomeSystem";
import HomeBacking from "@/components/HomeBacking";
import HomeCta from "@/components/HomeCta";
import BookingEmbed from "@/components/BookingEmbed";
import Footer from "@/components/Footer";
import { FIX4U_FAQS } from "@/lib/content/faqs";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = FIX4U_FAQS;

  return (
    <div className="flex flex-col min-h-screen bg-ink">
      <HomeNav />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Video Banner Section */}
        <HeroVideo />

        {/* Vision Section */}
        <HomeVision />

        {/* Schema Blueprint Section */}
        <HomeSchema />

        {/* Stacking Services Stack */}
        <HomeStack />

        {/* Live Chatbot Sandbox Trial */}
        <section className="border-b border-white/10 bg-ink relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">
            <div className="lg:col-span-5 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col gap-6 items-start justify-center">
              <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
                INTERACTIVE TRIAL
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-paper leading-tight uppercase tracking-tight">
                Don&apos;t take our word for it. Try talking to one.
              </h2>
              <p className="text-grey-dark text-sm leading-relaxed max-w-md">
                We set up a sandbox for a sample local business — <strong className="text-paper font-semibold">&quot;Sunrise Med Spa&quot;</strong>. 
                Use the quick action buttons on the chat console to ask questions, check pricing, and watch the bot schedule a consultation in real-time.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-1.5 text-coral hover:text-paper font-sans text-sm font-semibold mt-2 transition-colors group"
              >
                Open full-screen demo <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="lg:col-span-7 p-8 lg:p-16 flex justify-center w-full items-center bg-white/[0.005]">
              <ChatDemo />
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="border-b border-white/10 bg-ink relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">
            <div className="lg:col-span-5 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col justify-center space-y-3">
              <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
                THE NUMBERS
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-paper tracking-tight leading-[1.05] uppercase">
                Stop leaking revenue
              </h2>
              <p className="text-grey-dark text-sm leading-relaxed max-w-md">
                Use our interactive slider to calculate the monthly cost of slow lead response times.
              </p>
            </div>
            <div className="lg:col-span-7 p-8 lg:p-16 flex items-center justify-center bg-white/[0.005]">
              <RoiCalculator />
            </div>
          </div>
        </section>

        {/* Value Accordion (light) */}
        <HomeValue />

        {/* System Control (light, crosshair) */}
        <HomeSystem />

        {/* Backing / Guarantee (light) */}
        <HomeBacking />

        {/* FAQs */}
        <section className="border-b border-white/10 bg-ink relative w-full font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">
            <div className="lg:col-span-5 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col justify-start space-y-3">
              <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
                ANSWERS
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-paper tracking-tight leading-[1.05] uppercase">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col gap-3 justify-center bg-white/[0.005]">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border border-grey/15 rounded-2xl bg-ink/40 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left text-paper hover:text-coral transition-colors"
                  >
                    <span className="font-display font-bold text-sm sm:text-base pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-grey-dark shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180 text-coral" : ""
                    }`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      openFaq === idx ? "max-h-[300px] border-t border-grey/10" : "max-h-0"
                    }`}
                  >
                    <p className="p-6 text-grey-dark text-xs sm:text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section with Scheduler */}
        <section id="book" className="scroll-mt-20 border-b border-white/10 bg-ink relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">
            <div className="lg:col-span-5 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col justify-start space-y-3">
              <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
                GET STARTED
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-paper tracking-tight leading-[1.05] uppercase">
                Ready to stop losing leads?
              </h2>
              <p className="text-grey-dark text-sm leading-relaxed max-w-md">
                Book a 15-minute discovery call. We&apos;ll show you a custom demo of how this agent would answer your own clients.
              </p>
            </div>
            <div className="lg:col-span-7 p-8 lg:p-16 flex items-center justify-center bg-white/[0.005]">
              <BookingEmbed />
            </div>
          </div>
        </section>

        {/* Bold closing CTA */}
        <HomeCta />
      </main>

      <Footer />
    </div>
  );
}
