"use client";

import Link from "next/link";
import { 
  ArrowUpRight, 
  Bot, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Bell, 
  UserX, 
  Layers, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AiBookingAgent() {
  const features = [
    {
      icon: <Clock className="w-5 h-5 text-coral" />,
      title: "Instant 10s Responses",
      desc: "Answers enquiries day or night, ensuring prospects stay engaged and don't head to competitors."
    },
    {
      icon: <Layers className="w-5 h-5 text-coral" />,
      title: "Lead Qualification",
      desc: "Filters out tyre-kickers by asking targeted pre-booking questions about budget, service interest, and constraints."
    },
    {
      icon: <Calendar className="w-5 h-5 text-coral" />,
      title: "Seamless Booking",
      desc: "Drops consultations and appointments directly into Google Calendar, Outlook, or your Booking System."
    },
    {
      icon: <Bell className="w-5 h-5 text-coral" />,
      title: "SMS & Email Reminders",
      desc: "Sends confirmations and pre-filled reminders 24h and 1h prior to slash your no-show rates."
    },
    {
      icon: <UserX className="w-5 h-5 text-coral" />,
      title: "No-Show Minimizer",
      desc: "Provides instant links for rescheduling or cancellation, keeping your schedule clean and organized."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-coral" />,
      title: "Multi-channel Integration",
      desc: "Operates seamlessly across WhatsApp, Instagram Direct Messages, and website chat screens."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Discovery & Setup",
      desc: "We analyze your menu, FAQs, and calendar layout. Together we define the tone, pricing rules, and qualification steps."
    },
    {
      num: "02",
      title: "Custom Training",
      desc: "We build your AI agent using advanced LLMs (Claude/OpenAI), training it specifically on your brand assets and constraints."
    },
    {
      num: "03",
      title: "Secure Deploy",
      desc: "We embed the bot on your website, WhatsApp API, or IG profile. We link it directly to your calendar system."
    },
    {
      num: "04",
      title: "24/7 Monitoring",
      desc: "We review conversations, optimize prompts, and make sure the bot runs smoothly without errors."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-ink">
      <Header />

      <main className="flex-grow font-sans relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-coral/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Service Hero */}
        <section className="relative overflow-hidden pt-28 pb-20 border-b border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-coral text-xs font-mono font-semibold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5 text-coral" /> Hero Service Offer
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-paper leading-[1.1]">
              The AI Appointment <span className="text-coral italic">Booking Agent</span>
            </h1>
            <p className="text-grey-dark text-sm sm:text-base max-w-2xl leading-relaxed">
              We build, train, and host a custom AI receptionist for your business. It works across WhatsApp, Instagram, and Web Chat to reply instantly, qualify prospects, and book bookings 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-coral text-ink font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-coral/10"
              >
                Book a free consultation <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-white/[0.08] bg-white/[0.01] hover:border-paper/40 hover:bg-white/[0.04] text-paper font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300"
              >
                Try the live bot demo
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 border-b border-white/[0.05] max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
              CAPABILITIES
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-paper tracking-tight leading-[1.05]">
              What the agent does
            </h2>
            <p className="text-grey-dark text-sm">
              It carries out receptionist tasks instantly, with none of the admin friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="p-8 border border-white/[0.05] rounded-[24px] bg-white/[0.01] backdrop-blur-2xl flex flex-col gap-4 hover:border-coral/25 transition-all duration-500 shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-paper uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How We Build It (Deliverables / Roadmap) */}
        <section className="py-24 border-b border-white/[0.05] max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
              THE ROADMAP
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-paper tracking-tight leading-[1.05]">
              How we build it
            </h2>
            <p className="text-grey-dark text-sm">
              From kickoff to active deployment takes less than two weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="p-6 border border-white/[0.05] rounded-[24px] bg-white/[0.01] backdrop-blur-2xl flex flex-col gap-4 relative shadow-xl"
              >
                <span className="font-mono font-bold text-coral/40 text-3xl">
                  {step.num}
                </span>
                <h3 className="font-display font-bold text-lg text-paper uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-grey-dark text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Reversal Guarantee */}
        <section className="py-24 border-b border-white/[0.05] max-w-5xl mx-auto px-6 text-center relative z-10">
          <div 
            className="border border-coral/30 bg-coral/5 rounded-[32px] p-8 md:p-12 flex flex-col items-center gap-6 max-w-3xl mx-auto shadow-2xl"
            style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5), inset 0 0 25px rgba(255, 86, 64, 0.03)" }}
          >
            <CheckCircle className="w-12 h-12 text-coral" />
            <h2 className="font-display font-black text-2xl sm:text-3xl text-paper leading-tight uppercase tracking-wide">
              Our Risk-Reversal Pilot Guarantee
            </h2>
            <p className="text-grey-dark text-xs sm:text-sm leading-relaxed max-w-xl">
              We stand by our work. We offer a low-risk pilot program. If the custom agent doesn&apos;t save you admin time or book additional appointments in the first 30 days, we refund your setup fee. No questions asked.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-1.5 bg-coral text-ink font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:scale-[1.01] transition-transform"
            >
              Get started with a pilot <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Action CTA Block */}
        <section className="py-24 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6 relative z-10">
          <h2 className="font-display font-black text-3xl md:text-5xl text-paper leading-tight">
            Stop losing bookings to delayed replies.
          </h2>
          <p className="text-grey-dark text-sm sm:text-base max-w-xl leading-relaxed">
            Book a 15-minute discovery call and we will construct a custom demo showing how the AI answers queries for your exact list of services.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 bg-coral text-ink font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl hover:scale-[1.02] transition-all"
          >
            Claim your booking slot <ArrowUpRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
