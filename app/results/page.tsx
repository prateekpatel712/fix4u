"use client";

import Link from "next/link";
import { ArrowUpRight, Trophy, Zap, Calendar, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/AnimatedTitle";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const caseStudies = [
    {
      slug: "sunrise-med-spa",
      title: "Sunrise Medical Spa Lead-Gen + Booking Agent Integration",
      metric: "+38% Bookings",
      metricSub: "within 30 days of deploy",
      desc: "Sunrise was losing leads to slow response times after ads ran. We deployed a custom AI WhatsApp agent to reply within 10 seconds, answer service details, and book consultations.",
      category: "Med Spa",
      date: "June 2026",
      results: [
        { label: "Bookings", val: "+38%" },
        { label: "No-Show Rate", val: "-50%" },
        { label: "Response Speed", val: "<10s" }
      ]
    },
    {
      slug: "apex-dental-care",
      title: "Apex Dental Care After-Hours Appointment Automations",
      metric: "42 Bookings/mo",
      metricSub: "completely automated on autopilot",
      desc: "Apex lost consulting bookings after-hours. We deployed a Web and WhatsApp booking assistant to sync schedules live and register consult slots for dental care.",
      category: "Dental Clinic",
      date: "May 2026",
      results: [
        { label: "Automated Slots", val: "42/mo" },
        { label: "Response Speed", val: "6s" },
        { label: "Staff Time Saved", val: "15h/mo" }
      ]
    },
    {
      slug: "prime-aesthetics",
      title: "Prime Aesthetics Response Speed & No-Show Reduction",
      metric: "-50% No-Shows",
      metricSub: "using automated text reminders",
      desc: "Prime Aesthetics suffered from lost appointment slots and no-shows. We integrated instant confirmation webhooks that sync with Google Calendar to send text reminder prompts.",
      category: "Wellness Clinic",
      date: "April 2026",
      results: [
        { label: "No-Shows", val: "-50%" },
        { label: "Booking Speed", val: "10s" },
        { label: "Funnel Conversion", val: "+14%" }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-coral/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-violet/5 rounded-full blur-[140px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-coral text-xs font-mono font-semibold uppercase tracking-wider"
          >
            <Trophy className="w-3.5 h-3.5 text-coral" /> Pilot Proof
          </motion.div>
          
          <AnimatedTitle
            lines={[
              <span key="1">Our Case Studies</span>
            ]}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-paper leading-[1.1]"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-grey-dark text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            Real metrics. Real return on investment. Explore how local businesses plug the leaks in their customer funnels using custom-trained AI agents.
          </motion.p>
        </div>

        {/* Case Studies Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((cs, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 + idx * 0.1 }}
              className="border border-white/[0.05] rounded-[32px] bg-white/[0.01] backdrop-blur-2xl p-8 flex flex-col justify-between gap-8 group hover:border-coral/25 transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle hover background highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-coral/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-center text-[10px] text-grey-dark font-mono uppercase tracking-wider">
                  <span>{cs.category}</span>
                  <span>{cs.date}</span>
                </div>
                
                <h3 className="font-display font-bold text-2xl text-paper leading-tight group-hover:text-coral transition-colors duration-300">
                  <Link href={`/results/${cs.slug}`}>
                    {cs.title}
                  </Link>
                </h3>

                <p className="text-grey-dark text-xs sm:text-sm leading-relaxed mt-2">
                  {cs.desc}
                </p>

                {/* Metric callout */}
                <div className="bg-coral/[0.02] border border-coral/10 rounded-2xl p-4 my-2 flex items-center justify-between backdrop-blur-md">
                  <div>
                    <span className="text-[10px] text-grey-dark uppercase tracking-wider font-mono">Hero Result</span>
                    <div className="text-2xl font-display font-black text-coral mt-0.5">{cs.metric}</div>
                  </div>
                  <span className="text-[10px] text-grey-dark max-w-[120px] text-right font-sans leading-tight">
                    {cs.metricSub}
                  </span>
                </div>

                {/* Substats */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-6 mt-2">
                  {cs.results.map((r, rIdx) => (
                    <div key={rIdx} className="text-center md:text-left">
                      <span className="text-[9px] text-grey-dark uppercase tracking-wider font-mono block">
                        {r.label}
                      </span>
                      <span className="font-display font-bold text-base text-paper block mt-1">
                        {r.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/results/${cs.slug}`}
                className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-paper group-hover:text-coral transition-colors font-mono uppercase tracking-wider mt-4"
              >
                View breakdown <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Action Call */}
        <section className="max-w-3xl mx-auto text-center mt-24 flex flex-col items-center gap-6 relative z-10">
          <h2 className="font-display font-black text-2xl md:text-4xl text-paper leading-tight">
            Want to see these numbers for your own business?
          </h2>
          <p className="text-grey-dark text-sm sm:text-base leading-relaxed">
            Get a tailored analysis of your funnel response times. We will build a test agent for your specific menu and show you exactly what is possible.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 bg-coral text-ink font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl hover:scale-[1.02] transition-all"
          >
            Book your discovery call <ArrowUpRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
