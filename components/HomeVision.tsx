"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function HomeVision() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Map to position percentages for the moving crosshair lines
  const xPercent = useTransform(scrollYProgress, [0.15, 0.65], [45.7, 81.5]);
  const yPercent = useTransform(scrollYProgress, [0.15, 0.65], [53.5, 83.7]);

  const leftPos = useMotionTemplate`${xPercent}%`;
  const topPos = useMotionTemplate`${yPercent}%`;

  // Numeric coordinates to show in the UI
  const xVal = useTransform(scrollYProgress, [0.15, 0.65], [457, 940]);
  const yVal = useTransform(scrollYProgress, [0.15, 0.65], [535, 1081]);

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
      className="border-y border-ink/10 bg-paper text-ink relative overflow-hidden w-full lg:min-h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10 lg:min-h-screen items-stretch">
        {/* Left Column: Full-bleed Scroll-Driven Crosshair Image */}
        <div className="lg:col-span-5 lg:border-r border-ink/10 relative min-h-[440px] lg:min-h-0 overflow-hidden bg-grey/30">
          {/* Image / video fills the column edge-to-edge */}
          <video
            src="https://cdn.sanity.io/files/unkmsg3i/production/cde12660b1d9c1e245bb80b5ab01c77e4793569a.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Crosshair Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Fixed Top/Left Margin Lines */}
            <div className="absolute left-[1.25rem] top-0 bottom-0 w-px bg-ink/15" />
            <div className="absolute top-[1.25rem] left-0 right-0 h-px bg-ink/15" />

            {/* Moving Vertical Line */}
            <motion.div
              style={{ left: leftPos }}
              className="absolute top-0 bottom-0 w-px bg-ink/50"
            />

            {/* Moving Horizontal Line */}
            <motion.div
              style={{ top: topPos }}
              className="absolute left-0 right-0 h-px bg-ink/50"
            />

            {/* Intersection Node (Moving dot) */}
            <motion.div
              style={{ left: leftPos, top: topPos }}
              className="absolute z-30"
            >
              <div className="absolute w-2 h-2 bg-ink rounded-full -translate-x-1/2 -translate-y-1/2 ring-2 ring-paper/70" />
            </motion.div>
          </div>

          {/* Coordinate Readout (bottom-right) */}
          <div className="absolute right-5 bottom-5 flex flex-col items-end gap-1 font-mono text-[11px] font-semibold text-ink/80 select-none">
            <div ref={xTextRef}>X: 457</div>
            <div ref={yTextRef}>Y: 535</div>
          </div>
        </div>

        {/* Right Column: Text Information */}
        <div className="lg:col-span-7 flex flex-col justify-center p-8 lg:p-16 gap-12">
          <div className="space-y-5">
            <span className="font-mono text-xs text-ink/45 tracking-widest uppercase font-semibold">
              ACQUISITION CONTROL
            </span>
            <AnimatedTitle
              as="h2"
              scroll
              variant="wipe"
              wipeColor="bg-ink"
              lines={[
                "Industrialized speed-to-lead",
                "and digital control to execute",
                "with certainty",
              ]}
              className="font-display font-black text-3xl md:text-5xl text-ink tracking-tight leading-[1.05]"
            />
            <p className="text-ink/60 text-sm leading-relaxed max-w-lg">
              We govern, automate, and monitor the lead capture stage of local service clinics, bringing digital precision where manual receptionist follow-ups leak revenue.
            </p>
          </div>

          {/* Sub Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-ink/10">
            {/* Block 1 — APPROACH */}
            <div className="flex flex-col pt-8 sm:pr-10 sm:border-r border-ink/10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
                  Approach
                </span>
                <span className="w-2 h-2 bg-ink" />
              </div>
              <p className="text-ink/65 text-sm leading-relaxed mt-10">
                A custom codebase that links WhatsApp business channels with calendar system databases and CRM logs, ensuring 10-second response latency.
              </p>
              <Link
                href="/ai-booking-agent"
                className="group mt-8 inline-flex items-stretch self-start border border-ink/25 hover:border-ink transition-colors"
              >
                <span className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest font-mono">
                  Learn more
                </span>
                <span className="flex items-center px-3 border-l border-ink/25 group-hover:border-ink transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Block 2 — COMPANY */}
            <div className="flex flex-col pt-8 sm:pl-10 max-sm:mt-8 max-sm:border-t max-sm:border-ink/10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
                  Company
                </span>
                <span className="w-2 h-2 bg-ink" />
              </div>
              <p className="text-ink/65 text-sm leading-relaxed mt-10">
                We manage the cloud infrastructure, monitor conversation models, and modify scripts directly to adapt to your seasonal clinic adjustments.
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-stretch self-start border border-ink/25 hover:border-ink transition-colors"
              >
                <span className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest font-mono">
                  Learn more
                </span>
                <span className="flex items-center px-3 border-l border-ink/25 group-hover:border-ink transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
