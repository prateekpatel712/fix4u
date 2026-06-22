"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function HomeSystem() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Moving crosshair position (percent of the image panel)
  const xPercent = useTransform(scrollYProgress, [0.15, 0.65], [38, 88]);
  const yPercent = useTransform(scrollYProgress, [0.15, 0.65], [42, 92]);
  const leftPos = useMotionTemplate`${xPercent}%`;
  const topPos = useMotionTemplate`${yPercent}%`;

  // Reveal the video only inside the crosshair box (top-left margin → moving point);
  // it grows and exposes more of the clip as you scroll down.
  const videoClip = useMotionTemplate`inset(1.25rem calc(100% - ${xPercent}%) calc(100% - ${yPercent}%) 1.25rem)`;

  // Numeric readout
  const xVal = useTransform(scrollYProgress, [0.15, 0.65], [412, 750]);
  const yVal = useTransform(scrollYProgress, [0.15, 0.65], [560, 925]);
  const xTextRef = useRef<HTMLDivElement>(null);
  const yTextRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(xVal, "change", (latest) => {
    if (xTextRef.current) xTextRef.current.textContent = `X: ${Math.round(latest)}`;
  });
  useMotionValueEvent(yVal, "change", (latest) => {
    if (yTextRef.current) yTextRef.current.textContent = `Y: ${Math.round(latest)}`;
  });

  return (
    <section
      ref={sectionRef}
      className="bg-paper text-ink border-b border-ink/10 w-full lg:min-h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full lg:min-h-screen items-stretch">
        {/* Left: full-bleed crosshair image */}
        <div className="lg:border-r border-ink/10 relative min-h-[440px] lg:min-h-0 overflow-hidden bg-grey/30">
          <motion.div style={{ clipPath: videoClip }} className="absolute inset-0">
            <video
              src="/system-control.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </motion.div>

          {/* Crosshair overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[1.25rem] top-0 bottom-0 w-px bg-ink/15" />
            <div className="absolute top-[1.25rem] left-0 right-0 h-px bg-ink/15" />
            <motion.div style={{ left: leftPos }} className="absolute top-0 bottom-0 w-px bg-ink/50" />
            <motion.div style={{ top: topPos }} className="absolute left-0 right-0 h-px bg-ink/50" />
            <motion.div style={{ left: leftPos, top: topPos }} className="absolute z-30">
              <div className="absolute w-2 h-2 bg-ink rounded-full -translate-x-1/2 -translate-y-1/2 ring-2 ring-paper/70" />
            </motion.div>
          </div>

          {/* Coordinate readout — travels with the crosshair point */}
          <motion.div style={{ left: leftPos, top: topPos }} className="absolute z-40 pointer-events-none">
            <div className="translate-x-3 translate-y-2.5 font-mono text-[11px] font-semibold text-ink/80 select-none whitespace-nowrap">
              <div ref={xTextRef}>X: 412</div>
              <div ref={yTextRef}>Y: 560</div>
            </div>
          </motion.div>
        </div>

        {/* Right: text */}
        <div className="flex flex-col justify-center p-8 lg:p-16 gap-8">
          <span className="font-mono text-xs text-ink/50 tracking-widest uppercase font-semibold">
            System Control
          </span>
          <AnimatedTitle
            as="h2"
            scroll
            variant="wipe"
            wipeColor="bg-ink"
            lines={["One connected system,", "from first reply to", "booked appointment"]}
            className="font-display font-medium text-[clamp(1.6rem,3.4vw,3.25rem)] text-ink tracking-tight leading-[1.05]"
          />
          <p className="text-ink/65 text-base leading-relaxed max-w-md">
            Every enquiry flows through a single governed pipeline — captured, qualified, booked into your calendar, and logged to your CRM. Monitored around the clock and tuned continuously, so you keep full control without touching a thing.
          </p>
          <Link
            href="/book"
            className="learn__trigger flex items-stretch w-fit border border-ink/25 overflow-hidden select-none mt-2"
          >
            <span className="flex-1 flex items-center px-6 py-4 text-sm font-bold tracking-wide">
              <span className="button__text">
                <span className="button__text--sp button__text--sp--1">Request information</span>
                <span className="button__text--sp button__text--sp--2">Request information</span>
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
    </section>
  );
}
