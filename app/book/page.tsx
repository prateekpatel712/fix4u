"use client";

import { CheckCircle2, Sparkles, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import BookingEmbed from "@/components/BookingEmbed";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/AnimatedTitle";
import { motion } from "framer-motion";

export default function BookPage() {
  const assurances = [
    "No-pressure walkthrough of custom AI workflows tailored to your service list.",
    "A transparent review of your current pipeline leaks (reply delay estimation).",
    "A clear, fixed quote for setup and hosting - with no hidden developer fees."
  ];

  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-coral/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Information Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">SCHEDULING</span>
            
            <AnimatedTitle
              lines={[
                <span key="1">Book your</span>,
                <span key="2" className="text-coral italic">15-minute call</span>
              ]}
              className="font-display font-black text-3xl sm:text-4xl text-paper leading-[1.1]"
            />
            
            <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
              Select an available time slot in your local timezone to set up a video consultation.
            </p>

            {/* Assurances */}
            <div className="space-y-4 border-t border-white/[0.05] pt-6 mt-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-paper flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral" /> What we will cover
              </h4>
              <div className="flex flex-col gap-3">
                {assurances.map((as, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-4 h-4 rounded-full bg-coral/10 border border-coral/25 flex items-center justify-center text-coral shrink-0 mt-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[11px] text-grey-dark leading-relaxed">{as}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="border border-white/[0.05] rounded-[24px] p-5 bg-white/[0.01] backdrop-blur-2xl shadow-xl hover:border-coral/25 transition-colors duration-500">
              <blockquote className="text-[11px] italic text-paper font-serif leading-relaxed">
                &ldquo;We booked 38% more consultations in the first 30 days. The automated reminders cut our no-shows in half.&rdquo;
              </blockquote>
              <cite className="block text-[9px] text-grey-dark font-mono uppercase tracking-wider mt-2 not-italic">
                &mdash; Sunrise Med Spa, Founder
              </cite>
            </div>
            
            {/* WhatsApp Fallback */}
            <div className="border border-dashed border-white/[0.1] rounded-[24px] p-5 text-center flex flex-col gap-2 items-center text-xs text-grey-dark bg-white/[0.005] backdrop-blur-sm">
              <span>Prefer WhatsApp? Message us directly:</span>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-coral hover:text-paper font-mono uppercase tracking-wider transition-colors font-semibold"
              >
                Chat on WhatsApp <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Booking Embed Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-8 w-full"
          >
            <BookingEmbed />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
