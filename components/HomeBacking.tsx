"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function HomeBacking() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const xPercent = useTransform(scrollYProgress, [0.15, 0.65], [30, 68]);
  const yPercent = useTransform(scrollYProgress, [0.15, 0.65], [36, 80]);
  const leftPos = useMotionTemplate`${xPercent}%`;
  const topPos = useMotionTemplate`${yPercent}%`;

  const xVal = useTransform(scrollYProgress, [0.15, 0.65], [138, 729]);
  const yVal = useTransform(scrollYProgress, [0.15, 0.65], [192, 899]);
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
        {/* Left: text */}
        <div className="lg:border-r border-ink/10 p-8 lg:p-16 flex flex-col justify-center gap-8">
          <span className="font-mono text-xs text-ink/50 tracking-widest uppercase font-semibold">
            Backing
          </span>
          <AnimatedTitle
            as="h2"
            scroll
            variant="wipe"
            wipeColor="bg-ink"
            lines={["Backed by a", "performance", "guarantee"]}
            className="font-display font-medium text-[clamp(1.6rem,3.4vw,3.25rem)] text-ink tracking-tight leading-[1.05]"
          />
          <p className="text-ink/65 text-base leading-relaxed max-w-md">
            We don&apos;t hand over a bot and walk away. We build, train, host, and monitor your AI receptionist around the clock — and stand behind it with a performance guarantee. If it isn&apos;t booking more appointments, you don&apos;t pay for the month.
          </p>
          <Link
            href="/about"
            className="learn__trigger flex items-stretch w-fit border border-ink/25 overflow-hidden select-none"
          >
            <span className="flex-1 flex items-center px-6 py-4 text-sm font-bold tracking-wide">
              <span className="button__text">
                <span className="button__text--sp button__text--sp--1">About Fix4U</span>
                <span className="button__text--sp button__text--sp--2">About Fix4U</span>
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

        {/* Right: full-bleed crosshair image */}
        <div className="relative min-h-[440px] lg:min-h-0 overflow-hidden bg-grey/30">
          <video
            src="https://cdn.sanity.io/files/unkmsg3i/production/cde12660b1d9c1e245bb80b5ab01c77e4793569a.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[1.25rem] top-0 bottom-0 w-px bg-ink/15" />
            <div className="absolute top-[1.25rem] left-0 right-0 h-px bg-ink/15" />
            <motion.div style={{ left: leftPos }} className="absolute top-0 bottom-0 w-px bg-ink/50" />
            <motion.div style={{ top: topPos }} className="absolute left-0 right-0 h-px bg-ink/50" />
            <motion.div style={{ left: leftPos, top: topPos }} className="absolute z-30">
              <div className="absolute w-2 h-2 bg-ink rounded-full -translate-x-1/2 -translate-y-1/2 ring-2 ring-paper/70" />
            </motion.div>
          </div>

          <motion.div style={{ left: leftPos, top: topPos }} className="absolute z-40 pointer-events-none">
            <div className="translate-x-3 translate-y-2.5 font-mono text-[11px] font-semibold text-ink/80 select-none whitespace-nowrap">
              <div ref={xTextRef}>X: 138</div>
              <div ref={yTextRef}>Y: 192</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
