"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "framer-motion";

export default function HomeVision() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to crop insets:
  // Starts cropped and expands.
  const rightInset = useTransform(scrollYProgress, [0.15, 0.65], ["45%", "0%"]);
  const bottomInset = useTransform(scrollYProgress, [0.15, 0.65], ["40%", "0%"]);

  // Clip path template
  const clipPath = useMotionTemplate`inset(1.25rem ${rightInset} ${bottomInset} 1.25rem)`;

  // Map to position percentages for the moving crosshair lines
  // If rightInset is 45%, the line is at 100% - 45% = 55% from the left.
  const xPercent = useTransform(scrollYProgress, [0.15, 0.65], [55, 100]);
  const yPercent = useTransform(scrollYProgress, [0.15, 0.65], [60, 100]);

  const leftPos = useMotionTemplate`${xPercent}%`;
  const topPos = useMotionTemplate`${yPercent}%`;

  // Numeric coordinates to show in the UI
  const xVal = useTransform(scrollYProgress, [0.15, 0.65], [457, 960]);
  const yVal = useTransform(scrollYProgress, [0.15, 0.65], [535, 960]);

  // Image zoom scale
  const imgScale = useTransform(scrollYProgress, [0.15, 0.65], [1.3, 1.05]);

  // DOM refs to update coordinate numbers directly on scroll for peak performance
  const xTextRef = useRef<HTMLDivElement>(null);
  const yTextRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(xVal, "change", (latest) => {
    if (xTextRef.current) {
      xTextRef.current.textContent = `X: ${Math.round(latest)}`;
    }
  });

  useMotionValueEvent(yVal, "change", (latest) => {
    if (yTextRef.current) {
      yTextRef.current.textContent = `Y: ${Math.round(latest)}`;
    }
  });

  return (
    <section 
      ref={sectionRef}
      className="py-24 border-b border-white/[0.05] bg-ink relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-coral/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Column: Scroll-Driven Crosshair Image Reveal */}
        <div className="relative aspect-square border border-white/[0.05] rounded-[32px] bg-white/[0.02] backdrop-blur-2xl overflow-hidden shadow-2xl transition-colors duration-500 hover:border-coral/20">
          
          {/* Base Background Image (Grey / Blueprint outline placeholder) */}
          <div className="absolute inset-5 border border-dashed border-white/10 rounded-[20px] bg-white/[0.005] flex items-center justify-center overflow-hidden">
            <span className="font-mono text-[9px] text-grey-dark tracking-widest uppercase opacity-40">
              INITIALIZING SCANNER...
            </span>
          </div>

          {/* Dynamic Clipped Image */}
          <motion.div 
            style={{ clipPath }}
            className="absolute inset-0 z-10 overflow-hidden"
          >
            <motion.img 
              src="/scanner.jpg"
              alt="System Blueprint Scan"
              style={{ scale: imgScale }}
              className="w-full h-full object-cover rounded-[32px] pointer-events-none"
            />
          </motion.div>

          {/* Crosshair Overlay (relative to container) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Fixed Top/Left Margin Lines at 1.25rem (20px) */}
            <div className="absolute left-[1.25rem] top-0 bottom-0 w-[1px] bg-white/10" />
            <div className="absolute top-[1.25rem] left-0 right-0 h-[1px] bg-white/10" />

            {/* Moving Vertical Line */}
            <motion.div 
              style={{ left: leftPos }}
              className="absolute top-0 bottom-0 w-[1px] bg-coral/50"
            />

            {/* Moving Horizontal Line */}
            <motion.div 
              style={{ top: topPos }}
              className="absolute left-0 right-0 h-[1px] bg-coral/50"
            />

            {/* Intersection Node & Text coordinates */}
            <motion.div 
              style={{ left: leftPos, top: topPos }}
              className="absolute"
            >
              {/* Coordinates displays */}
              <div 
                ref={xTextRef}
                className="absolute left-4 top-2 font-mono text-[9px] font-semibold text-coral uppercase tracking-widest bg-ink/75 px-1.5 py-0.5 rounded border border-coral/20"
              >
                X: 457
              </div>
              <div 
                ref={yTextRef}
                className="absolute left-4 top-6 font-mono text-[9px] font-semibold text-coral uppercase tracking-widest bg-ink/75 px-1.5 py-0.5 rounded border border-coral/20"
              >
                Y: 535
              </div>
              
              {/* Cross Point Indicator */}
              <div className="absolute w-2 h-2 bg-coral rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-coral/50" />
            </motion.div>
          </div>
        </div>

        {/* Right Column: Text Information */}
        <div className="flex flex-col gap-10">
          <div className="space-y-4">
            <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
              ACQUISITION CONTROL
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-paper tracking-tight leading-[1.05]">
              Speed-to-lead control to execute with certainty
            </h2>
            <p className="text-grey-dark text-sm leading-relaxed max-w-lg">
              We govern, automate, and monitor the lead capture stage of local service clinics, bringing digital precision where manual receptionist follow-ups leak revenue.
            </p>
          </div>

          {/* Sub Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/[0.05]">
            {/* Block 1 */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-coral uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral" /> The Method
              </span>
              <h3 className="font-display font-bold text-lg text-paper">
                Code-first pipelines
              </h3>
              <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
                A custom codebase that links WhatsApp business channels with calendar system databases and CRM logs, ensuring 10-second response latency.
              </p>
              <Link 
                href="/ai-booking-agent"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-paper hover:text-coral transition-colors font-mono uppercase tracking-widest pt-2 group"
              >
                Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Block 2 */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-coral uppercase tracking-widest font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-coral" /> Monitoring
              </span>
              <h3 className="font-display font-bold text-lg text-paper">
                Fully Managed
              </h3>
              <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
                We manage the cloud infrastructure, monitor conversation models, and modify scripts directly to adapt to your seasonal clinic adjustments.
              </p>
              <Link 
                href="/about"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-paper hover:text-coral transition-colors font-mono uppercase tracking-widest pt-2 group"
              >
                About the build <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
