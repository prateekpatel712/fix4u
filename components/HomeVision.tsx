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
  const xPercent = useTransform(scrollYProgress, [0.15, 0.65], [38, 88]);
  const yPercent = useTransform(scrollYProgress, [0.15, 0.65], [42, 92]);

  const leftPos = useMotionTemplate`${xPercent}%`;
  const topPos = useMotionTemplate`${yPercent}%`;

  // Reveal the video only inside the crosshair box; it grows as you scroll down.
  const videoClip = useMotionTemplate`inset(1.25rem calc(100% - ${xPercent}%) calc(100% - ${yPercent}%) 1.25rem)`;

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
          {/* Video revealed inside the growing crosshair box */}
          <motion.div style={{ clipPath: videoClip }} className="absolute inset-0">
            <video
              src="/vision.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </motion.div>

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

          {/* Coordinate Readout — travels with the crosshair point */}
          <motion.div style={{ left: leftPos, top: topPos }} className="absolute z-40 pointer-events-none">
            <div className="translate-x-3 translate-y-2.5 font-mono text-[11px] font-semibold text-ink/80 select-none whitespace-nowrap">
              <div ref={xTextRef}>X: 457</div>
              <div ref={yTextRef}>Y: 535</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Text Information */}
        <div className="lg:col-span-7 flex flex-col p-8 lg:p-16 gap-12">
          <div className="space-y-6">
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
              className="font-display font-black text-[clamp(1.6rem,4.6vw,4.3333rem)] text-ink tracking-tight leading-[1.04]"
            />
            <p className="text-ink/60 text-base md:text-lg leading-relaxed max-w-xl">
              We govern, automate, and monitor the lead capture stage of local service businesses, bringing digital precision where manual receptionist follow-ups leak revenue.
            </p>
          </div>

          {/* Sub Blocks — fill remaining height: label pinned top, body + CTA pinned bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-ink/10 lg:flex-1">
            {/* Block 1 — APPROACH */}
            <div className="flex flex-col justify-between gap-12 pt-8 sm:pr-12 sm:border-r border-ink/10">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                  Approach
                </span>
                <span className="w-2.5 h-2.5 bg-ink" />
              </div>
              <div className="space-y-8">
                <p className="text-ink/75 text-base md:text-lg leading-relaxed">
                  A custom codebase that links WhatsApp business channels with calendar system databases and CRM logs, ensuring 10-second response latency.
                </p>
                <Link
                  href="/ai-booking-agent"
                  className="learn__trigger flex items-stretch w-full border border-ink/25 overflow-hidden select-none"
                >
                  <span className="flex-1 flex items-center px-6 py-4 text-sm font-bold tracking-wide">
                    <span className="button__text">
                      <span className="button__text--sp button__text--sp--1">Learn more</span>
                      <span className="button__text--sp button__text--sp--2">Learn more</span>
                    </span>
                  </span>
                  <span className="learn__icon flex items-center justify-center px-5 border-l border-ink/25">
                    <span className="button__icon">
                      <span className="button__icon__inner button__icon__inner--1">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                      <span className="button__icon__inner button__icon__inner--2">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Block 2 — COMPANY */}
            <div className="flex flex-col justify-between gap-12 pt-8 sm:pl-12 max-sm:mt-10 max-sm:border-t max-sm:border-ink/10">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                  Company
                </span>
                <span className="w-2.5 h-2.5 bg-ink" />
              </div>
              <div className="space-y-8">
                <p className="text-ink/75 text-base md:text-lg leading-relaxed">
                  We manage the cloud infrastructure, monitor conversation models, and modify scripts directly to adapt to your seasonal business adjustments.
                </p>
                <Link
                  href="/about"
                  className="learn__trigger flex items-stretch w-full border border-ink/25 overflow-hidden select-none"
                >
                  <span className="flex-1 flex items-center px-6 py-4 text-sm font-bold tracking-wide">
                    <span className="button__text">
                      <span className="button__text--sp button__text--sp--1">Learn more</span>
                      <span className="button__text--sp button__text--sp--2">Learn more</span>
                    </span>
                  </span>
                  <span className="learn__icon flex items-center justify-center px-5 border-l border-ink/25">
                    <span className="button__icon">
                      <span className="button__icon__inner button__icon__inner--1">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                      <span className="button__icon__inner button__icon__inner--2">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
