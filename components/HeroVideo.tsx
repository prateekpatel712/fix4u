"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position relative to container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax calculations
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const yText = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[55vh] md:h-[75vh] overflow-hidden border-b border-grey/10 bg-ink"
    >
      {/* Background Video Wrapper with Parallax Scale */}
      <motion.div style={{ scale }} className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-60 pointer-events-none"
          poster="https://cdn.sanity.io/images/unkmsg3i/production/5b59badb0ea9760ac2226c34dfed90294e2d9278-1920x1080.jpg"
        >
          <source
            src="https://cdn.sanity.io/files/unkmsg3i/production/cde12660b1d9c1e245bb80b5ab01c77e4793569a.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlays to maintain brand ink style and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <div className="absolute inset-0 bg-ink/10" />
      </motion.div>

      {/* Floating Subtitle Overlay with Parallax Move */}
      <div className="absolute inset-0 flex items-center justify-center p-6 z-10 pointer-events-none">
        <motion.div 
          style={{ y: yText }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-block font-mono text-[10px] text-coral uppercase tracking-widest mb-3">
            FIX4U INTEGRATED PIPELINES
          </span>
          <p className="font-display font-extrabold text-lg sm:text-2xl md:text-3xl text-paper leading-normal tracking-tight max-w-3xl mx-auto drop-shadow-md">
            The automated response system that brings speed-to-lead and guarantees booked slots 24/7.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
