"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedTitleProps {
  lines: ReactNode[];
  className?: string;
  /** Reveal when scrolled into view (once) instead of immediately on mount. */
  scroll?: boolean;
  /** Wrapper tag, e.g. "h2" for a semantic heading. Defaults to "div". */
  as?: "div" | "h1" | "h2" | "h3";
  /**
   * "slide" (default): each line rises up into view, staggered.
   * "wipe": a solid block sweeps in to cover each line; once all lines are
   * covered, the blocks sweep back out to uncover the text, cascading top→bottom.
   */
  variant?: "slide" | "wipe";
  /** Tailwind bg-* class for the wipe block — match the text colour. Default "bg-paper". */
  wipeColor?: string;
}

export default function AnimatedTitle({
  lines,
  className = "",
  scroll = false,
  as = "div",
  variant = "slide",
  wipeColor = "bg-paper",
}: AnimatedTitleProps) {
  const ease = [0.16, 1, 0.3, 1] as const;

  const container = {
    hidden: { opacity: variant === "wipe" ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        // The slide variant staggers here; the wipe variant times every line
        // itself (via `custom`), so it must NOT add a stagger on top.
        staggerChildren: variant === "wipe" ? 0 : 0.15,
        delayChildren: variant === "wipe" ? 0 : 0.1,
      },
    },
  };

  // --- slide variant (original) ---
  const slideItem = {
    hidden: { y: "115%", rotate: 2 },
    show: { y: 0, rotate: 0, transition: { duration: 0.9, ease } },
  };

  // --- wipe variant timeline (seconds) ---
  // Phase 1: each block sweeps in from the left to cover its line (quick, slight
  // cascade). Phase 2: after every block has arrived + a short hold, the blocks
  // sweep out to the right, uncovering the text top→bottom.
  const ARRIVE_DUR = 0.6;
  const ARRIVE_STAGGER = 0.15;
  const HOLD = 0.3;
  const REVEAL_DUR = 1.2;
  const REVEAL_STAGGER = 0.4;
  const lastArrived = (lines.length - 1) * ARRIVE_STAGGER + ARRIVE_DUR;
  const revealBase = lastArrived + HOLD;

  const mask = {
    hidden: { x: "-101%" },
    show: (i: number) => {
      const t0 = i * ARRIVE_STAGGER; // start sweeping in
      const t1 = t0 + ARRIVE_DUR; // fully covering
      const t2 = revealBase + i * REVEAL_STAGGER; // start sweeping out
      const t3 = t2 + REVEAL_DUR; // gone (fully revealed)
      const dur = t3 - t0;
      return {
        x: ["-101%", "0%", "0%", "101%"],
        transition: {
          delay: t0,
          duration: dur,
          times: [0, (t1 - t0) / dur, (t2 - t0) / dur, 1],
          ease: "easeInOut" as const,
        },
      };
    },
  };

  // Text stays invisible until its block is covering it, so it never flashes
  // before the blocks arrive. It flips on under the cover, then is revealed.
  const textReveal = {
    hidden: { opacity: 0 },
    show: (i: number) => ({
      opacity: 1,
      transition: { delay: i * ARRIVE_STAGGER + ARRIVE_DUR * 0.5, duration: 0.001 },
    }),
  };

  const MotionTag = motion[as] as typeof motion.div;

  // On mount the title plays straight away; in `scroll` mode it waits until it
  // enters the viewport and only ever plays once (the first scroll-down past it).
  const trigger = scroll
    ? { whileInView: "show", viewport: { once: true, amount: 0.45 } }
    : { animate: "show" };

  return (
    <MotionTag
      variants={container}
      initial="hidden"
      {...trigger}
      className={`flex flex-col ${variant === "wipe" ? "items-start" : ""} ${className}`}
    >
      {lines.map((line, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden py-1 ${
            variant === "wipe" ? "w-fit max-w-full" : "block w-full"
          }`}
        >
          {variant === "wipe" ? (
            <>
              <motion.span variants={textReveal} custom={idx} className="block">
                {line}
              </motion.span>
              <motion.span
                variants={mask}
                custom={idx}
                aria-hidden
                className={`pointer-events-none absolute inset-0 ${wipeColor}`}
              />
            </>
          ) : (
            <motion.div variants={slideItem} className="origin-bottom-left">
              {line}
            </motion.div>
          )}
        </div>
      ))}
    </MotionTag>
  );
}
