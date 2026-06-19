"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Mail, Phone, Users, CheckCircle, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/AnimatedTitle";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      title: "No-Code Resellers vs. Real Custom Code",
      desc: "Most AI 'agencies' copy generic templates from YouTube and resell them. We write custom code, train custom models on your exact documents, and integrate them directly into your database. We build systems that scale."
    },
    {
      title: "Performance First",
      desc: "We don't expect you to pay for promises. We back our integrations with pilot programs and performance guarantees. You pay setup fees only when the bot passes your tests and begins booking real appointments."
    },
    {
      title: "Timezone Alignment Support",
      desc: "Solo founders based in India selling to international clients often fail on timezone support. We align directly with your clinic's business hours, offering direct WhatsApp channels for real-time adjustments."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-coral/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-violet/5 rounded-full blur-[130px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">OUR STORY</span>
            <AnimatedTitle
              lines={[
                <span key="1">We believe every business</span>,
                <span key="2">deserves to <span className="text-coral italic">answer every lead.</span></span>
              ]}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-paper leading-[1.05]"
            />
            <p className="text-grey-dark text-base sm:text-lg leading-relaxed max-w-3xl">
              Fix4U is an AI automation agency built to plug the leaking customer pipelines in local service businesses. We write custom integrations that answer leads instantly and book calendar slots 24/7.
            </p>
          </motion.div>

          {/* Founder Split */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-t border-b border-white/[0.05] py-12"
          >
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 border border-white/[0.05] rounded-[24px] overflow-hidden bg-white/[0.01] backdrop-blur-2xl flex items-center justify-center group hover:border-coral/25 transition-all duration-500 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-coral/10 to-transparent opacity-60 pointer-events-none" />
                <Users className="w-12 h-12 text-grey-dark group-hover:text-coral transition-colors duration-500" />
                <div className="absolute bottom-3 text-[10px] text-grey-dark font-mono uppercase tracking-wider">
                  PRATEEK &bull; Solo Founder
                </div>
              </div>
            </div>
            <div className="md:col-span-8 space-y-4 text-grey-dark text-sm leading-relaxed">
              <h3 className="font-display font-bold text-xl text-paper uppercase tracking-wide">
                Hi, I&apos;m Prateek.
              </h3>
              <p>
                I founded Fix4U because I watched local business owners—from med spa clinics to dentists—spend thousands of dollars on marketing, only to lose half of their leads because their staff was too busy to answer within 5 minutes.
              </p>
              <p>
                In the modern local market, <strong className="text-paper">speed to lead</strong> is the single greatest competitive advantage. By putting custom AI response agents on autopilot, we ensure that no enquiry is ever lost, no matter if it arrives at 2 AM or during a busy weekend.
              </p>
              <div className="flex gap-4 pt-2 text-xs font-mono">
                <a href="mailto:prateek@fix4u.in" className="flex items-center gap-1.5 text-paper hover:text-coral transition-colors">
                  <Mail className="w-4 h-4 text-coral" /> prateek@fix4u.in
                </a>
              </div>
            </div>
          </motion.div>

          {/* Core Values / USPs */}
          <div className="space-y-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-paper uppercase tracking-wide">
              Our core convictions
            </h2>
            <div className="flex flex-col gap-6">
              {values.map((v, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                  className="border border-white/[0.05] rounded-[24px] p-6 md:p-8 bg-white/[0.01] backdrop-blur-2xl space-y-3 hover:border-coral/25 transition-colors duration-500 shadow-xl"
                >
                  <h3 className="font-display font-bold text-lg text-paper flex items-center gap-2 uppercase tracking-wide">
                    <CheckCircle className="w-5 h-5 text-coral shrink-0" /> {v.title}
                  </h3>
                  <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Guarantee Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border border-coral/30 bg-coral/5 rounded-[32px] p-8 text-center flex flex-col items-center gap-4 max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-coral/[0.02] to-transparent pointer-events-none" />
            <Sparkles className="w-10 h-10 text-coral relative z-10" />
            <h3 className="font-display font-bold text-xl text-paper uppercase tracking-wide relative z-10">
              Let&apos;s build a pilot for your brand
            </h3>
            <p className="text-grey-dark text-xs sm:text-sm max-w-md mx-auto relative z-10">
              We stand by our code. We build a fully functional prototype of your bot for free, letting you try it before signing any contracts.
            </p>
            <Link
              href="/book"
              className="relative z-10 inline-flex items-center justify-center gap-1.5 bg-coral text-ink font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:scale-[1.01] transition-transform"
            >
              Book a kickoff call <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
