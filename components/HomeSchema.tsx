"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ArrowRight, ClipboardCheck, Calendar, Database, Sparkles } from "lucide-react";

export default function HomeSchema() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Inquiry Capture",
      desc: "Prospect messages via WhatsApp/Instagram DMs or website chat."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: "AI Processing",
      desc: "AI identifies customer services, pricing lists, and available slots."
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      label: "Qualification check",
      desc: "Bot filters out tyre-kickers by asking pre-booking questions."
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Calendar Sync",
      desc: "Locks slot and immediately sends SMS confirmations & reminders."
    },
    {
      icon: <Database className="w-5 h-5" />,
      label: "CRM integration",
      desc: "Logs customer profile and communication history to HubSpot."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="border-b border-white/10 bg-ink relative overflow-hidden w-full">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-violet/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">
        {/* Left Column: Descriptive Text */}
        <div className="lg:col-span-5 lg:border-r border-white/10 flex flex-col justify-center p-8 lg:p-16 space-y-6">
          <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
            SYSTEM BLUEPRINT
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-paper tracking-tight leading-[1.05]">
            The automated pipeline system that plugs leaks
          </h2>
          <p className="text-grey-dark text-sm sm:text-base leading-relaxed">
            Unlike disjointed template widgets, our codebase connects conversation processing, eligibility verification, and live calendar database synchronization into a single automated pipeline.
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center p-8 lg:p-16">
          <div className="border border-white/[0.05] rounded-[32px] bg-white/[0.01] backdrop-blur-2xl p-6 md:p-10 relative overflow-hidden flex flex-col gap-6 shadow-2xl">
          {/* Blueprint Nodes */}
          <div className="flex flex-col gap-3.5 relative z-10">
            {steps.map((st, idx) => {
              const isActive = activeStep === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center justify-between p-4 border rounded-2xl transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? "bg-coral text-ink border-coral scale-[1.01] shadow-lg shadow-coral/10" 
                      : "bg-[#070709]/60 border-white/[0.05] text-paper hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500 ${
                      isActive 
                        ? "bg-ink border-ink text-coral" 
                        : "bg-white/[0.02] border-white/[0.05] text-paper"
                    }`}>
                      {st.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm tracking-tight uppercase">{st.label}</h4>
                      <p className={`text-[10px] sm:text-xs leading-relaxed mt-1 ${
                        isActive ? "text-ink/80 font-medium" : "text-grey-dark"
                      }`}>
                        {st.desc}
                      </p>
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <ArrowRight className={`w-4 h-4 hidden sm:block transition-all ${
                      isActive ? "text-ink animate-pulse translate-x-1" : "text-grey-dark/20"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Node metadata footer */}
          <div className="flex justify-between items-center text-[9px] text-grey-dark font-mono uppercase tracking-widest mt-2 border-t border-white/[0.05] pt-4 z-10 opacity-70">
            <span>PIPELINE FILE: F4U-BLUEPRINT</span>
            <span>ACTIVE SEGMENT: {activeStep + 1} / {steps.length}</span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
