"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/AnimatedTitle";
import { motion } from "framer-motion";

interface CaseData {
  title: string;
  category: string;
  date: string;
  client: string;
  problem: string;
  lostCost: string;
  solution: string;
  quote: string;
  author: string;
  metrics: { label: string; val: string }[];
}

const cases: Record<string, CaseData> = {
  "sunrise-med-spa": {
    title: "Sunrise Medical Spa Lead-Gen + Booking Agent Integration",
    category: "Med Spa",
    date: "June 2026",
    client: "Sunrise Med Spa (a 6-figure local aesthetic clinic in California)",
    problem: "Sunrise was spending ~$2,500/month on Instagram and Facebook ads. While they got plenty of enquiries, their receptionist was busy treating clients, leaving messages unanswered for hours. Over 30% of qualified leads walked away simply because they didn't get an immediate reply.",
    lostCost: "$4,500 - $6,000 in monthly consultation value",
    solution: "We built a custom AI agent integrated with their WhatsApp Business API and Instagram DM account. We trained the model on their treatment pricing, treatment descriptions, safety guidelines, and calendar slots. The bot responded in under 10 seconds, answered FAQs, qualified leads, and booked them directly into their booking system.",
    quote: "Fix4U plugged the hole in our funnel. We are booking 38% more consultations without spending an extra dollar on ads, and the automated reminders cut our no-show rate in half.",
    author: "Dr. Catherine Vance, Founder of Sunrise Med Spa",
    metrics: [
      { label: "Bookings Increase", val: "+38%" },
      { label: "No-Show Rate Cut", val: "-50%" },
      { label: "AI Response Speed", val: "< 10s" }
    ]
  },
  "apex-dental-care": {
    title: "Apex Dental Care After-Hours Appointment Automations",
    category: "Dental Clinic",
    date: "May 2026",
    client: "Apex Dental Care (a multi-dentist local clinic in Boston)",
    problem: "Enquiries received after-hours (between 6 PM and 8 AM) or during weekends went cold. By the time the front desk followed up the next business day, prospects had already booked with competitors who had instant schedulers.",
    lostCost: "$3,500 in emergency & cosmetic dentistry appointments/mo",
    solution: "We deployed a timezone-aware AI booking agent on their website and WhatsApp Business. The bot was configured with a live two-way sync to their calendar database. It could register emergency slots immediately and book cosmetic consultation appointments on autopilot.",
    quote: "We used to lose 3-4 cosmetic clients every weekend. Now, the bot books them while we sleep. It's like having a receptionist on duty 24/7.",
    author: "Dr. Amit Patel, Lead Dentist at Apex Dental Care",
    metrics: [
      { label: "Automated Bookings", val: "42 /mo" },
      { label: "Response Speed", val: "~6s" },
      { label: "Staff Hours Saved", val: "15h /mo" }
    ]
  },
  "prime-aesthetics": {
    title: "Prime Aesthetics Response Speed & No-Show Reduction",
    category: "Wellness Clinic",
    date: "April 2026",
    client: "Prime Aesthetics Clinic (a wellness and weight-loss clinic in Texas)",
    problem: "A high volume of manual follow-ups led to a messy schedule, with high calendar friction and a no-show rate of nearly 24% for weight-loss consults.",
    lostCost: "$2,800 in lost doctor consult hours per month",
    solution: "We integrated a webhook system that connects their AI DM bot with Cal.com. The moment a client selects a slot, they receive instant SMS confirmations, calendar invites, and auto-reminders at the 24h and 1h mark, with a self-serve rescheduling link.",
    quote: "Our no-show rate crashed from 24% to under 12% in the first month. The automation handles everything, letting our medical staff focus purely on patients.",
    author: "Maya Rodriguez, Practice Manager at Prime Aesthetics",
    metrics: [
      { label: "No-Show Rate", val: "-50%" },
      { label: "Lead-to-Book Speed", val: "10s" },
      { label: "Conversion Lift", val: "+14%" }
    ]
  }
};

type Params = Promise<{ slug: string }>;

export default function CaseStudyDetail({ params }: { params: Params }) {
  const { slug } = use(params);
  const data = cases[slug];

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen bg-ink">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-display font-bold text-3xl text-paper">Case Study Not Found</h1>
          <Link href="/results" className="text-coral mt-4 font-mono text-sm uppercase underline">
            Back to all case studies
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-coral/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link
            href="/results"
            className="inline-flex items-center gap-2 text-xs text-grey hover:text-coral transition-colors uppercase font-mono tracking-wider mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to case studies
          </Link>

          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 mb-10"
          >
            <div className="flex justify-between items-center text-xs text-grey-dark font-mono uppercase tracking-wider">
              <span>{data.category}</span>
              <span>{data.date}</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-paper tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-grey text-xs sm:text-sm font-mono mt-1">
              Client: <span className="text-paper">{data.client}</span>
            </p>
          </motion.div>

          {/* Metrics Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 border border-white/[0.05] rounded-[24px] p-6 bg-white/[0.01] backdrop-blur-2xl mb-12 shadow-2xl"
          >
            {data.metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center py-4 border-b sm:border-b-0 sm:border-r last:border-0 border-white/[0.05] text-center">
                <span className="text-[10px] text-grey-dark uppercase tracking-wider font-mono">
                  {m.label}
                </span>
                <span className="font-display font-black text-3xl text-coral mt-1 block">
                  {m.val}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Detailed Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-10 text-grey-dark leading-relaxed text-sm sm:text-base border-t border-white/[0.05] pt-10"
          >
            {/* The Problem */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <h3 className="md:col-span-3 font-display font-bold text-lg text-paper flex items-center gap-1.5 uppercase tracking-wide">
                <DollarSign className="w-4 h-4 text-coral shrink-0" /> The Leak
              </h3>
              <div className="md:col-span-9 space-y-4">
                <p>{data.problem}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 font-mono text-[11px] uppercase tracking-wide">
                  Estimated Leak: {data.lostCost}
                </div>
              </div>
            </div>

            {/* The Solution */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/[0.05] pt-10">
              <h3 className="md:col-span-3 font-display font-bold text-lg text-paper flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-coral shrink-0" /> Solution
              </h3>
              <div className="md:col-span-9">
                <p>{data.solution}</p>
              </div>
            </div>

            {/* The Quote */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/[0.05] pt-10">
              <h3 className="md:col-span-3 font-display font-bold text-lg text-paper flex items-center gap-1.5 uppercase tracking-wide">
                <TrendingUp className="w-4 h-4 text-coral shrink-0" /> Outcome
              </h3>
              <div className="md:col-span-9">
                <blockquote className="border-l-2 border-coral pl-5 italic text-paper font-serif text-base sm:text-lg">
                  &ldquo;{data.quote}&rdquo;
                </blockquote>
                <cite className="block text-xs text-grey-dark font-mono mt-3 uppercase tracking-wider not-italic">
                  &mdash; {data.author}
                </cite>
              </div>
            </div>
          </motion.div>

          {/* CTA Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border border-white/[0.05] rounded-[32px] p-8 bg-white/[0.01] backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 mt-20 hover:border-coral/25 transition-colors duration-500"
          >
            <div>
              <h3 className="font-display font-bold text-xl text-paper mb-1">
                Ready to plug the leak in your funnel?
              </h3>
              <p className="text-grey-dark text-xs sm:text-sm">
                Get a custom booking agent demo built for your brand.
              </p>
            </div>
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-coral text-ink font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:scale-[1.02] transition-all shrink-0"
            >
              Book a call <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
