"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroVideo from "@/components/HeroVideo";
import HomeVision from "@/components/HomeVision";
import HomeSchema from "@/components/HomeSchema";
import HomeStack from "@/components/HomeStack";
import ChatDemo from "@/components/ChatDemo";
import RoiCalculator from "@/components/RoiCalculator";
import HomeCarousel from "@/components/HomeCarousel";
import BookingEmbed from "@/components/BookingEmbed";
import Footer from "@/components/Footer";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How much does a custom AI agent cost?",
      a: "We offer simple, upfront pricing consisting of a one-time setup fee (for training and integrating the bot with your systems) and a flat monthly hosting/maintenance fee. We also offer low-risk pilot programs. Book a call for a custom quote based on your lead volume."
    },
    {
      q: "How long does it take to go live?",
      a: "Typically, we can build, train, test, and deploy your custom AI agent in under 2 weeks. This includes training it on your exact pricing, services, and FAQ, plus integrating it with your CRM and calendar."
    },
    {
      q: "Where are you based?",
      a: "We are based in India, operating globally. We sync with your timezone for communications and ensure 24/7 technical monitoring of your AI agents so they never go offline."
    },
    {
      q: "Is my customer data secure?",
      a: "Yes. All customer data collected via the AI chatbots is encrypted and directly synced to your CRM (e.g. HubSpot). We do not store or resell your leads' data."
    },
    {
      q: "What do you need from me to start?",
      a: "We just need your service menu, pricing list, and a list of frequently asked questions. We build, train, and test the agent ourselves, then send you a private link to try it out before it goes live."
    },
    {
      q: "What if the AI makes a mistake or doesn't work?",
      a: "We build strict guardrails into our AI prompts so it only answers questions about your services. If a query is outside its scope, it politely flags it and hands off the conversation to a human. Plus, we back our work with a performance guarantee."
    }
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-ink">
      <Header isOpen={menuOpen} setIsOpen={setMenuOpen} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero isOpen={menuOpen} setIsOpen={setMenuOpen} />

        {/* Video Banner Section */}
        <HeroVideo />

        {/* Vision Section */}
        <HomeVision />

        {/* Schema Blueprint Section */}
        <HomeSchema />

        {/* Stacking Services Stack */}
        <HomeStack />

        {/* Live Chatbot Sandbox Trial */}
        <section className="py-24 border-b border-grey/10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col gap-6 items-start">
              <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
                INTERACTIVE TRIAL
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-paper leading-tight">
                Don&apos;t take our word for it. Try talking to one.
              </h2>
              <p className="text-grey-dark text-sm leading-relaxed">
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
            <div className="lg:col-span-6 flex justify-center w-full">
              <ChatDemo />
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="py-24 border-b border-grey/10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-mono text-xs text-coral tracking-widest uppercase">
              THE NUMBERS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-paper mt-2">
              Stop leaking revenue
            </h2>
            <p className="text-grey-dark text-sm mt-3">
              Use our interactive slider to calculate the monthly cost of slow lead response times.
            </p>
          </div>

          <RoiCalculator />
        </section>

        {/* Case Studies Carousel */}
        <HomeCarousel />

        {/* FAQs */}
        <section className="py-24 border-b border-grey/10 max-w-4xl mx-auto px-6 font-sans">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-coral tracking-widest uppercase">
              ANSWERS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-paper mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-grey/15 rounded-2xl bg-ink/40 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left text-paper hover:text-coral transition-colors"
                >
                  <span className="font-display font-bold text-sm sm:text-base pr-4">{faq.q}</span>
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
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section with Scheduler */}
        <section id="book" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4 font-sans">
            <span className="font-mono text-xs text-coral tracking-widest uppercase">
              GET STARTED
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-paper">
              Ready to stop losing leads?
            </h2>
            <p className="text-grey-dark text-sm max-w-lg mx-auto">
              Book a 15-minute discovery call below. We&apos;ll show you a custom demo of how this agent would answer your own clients.
            </p>
          </div>

          <BookingEmbed />
        </section>
      </main>

      <Footer />
    </div>
  );
}
