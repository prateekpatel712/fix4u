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
   * "wipe": a solid block covers each line and scales away to the right,
   * uncovering the text left-to-right, with the lines cascading top→bottom.
   */
  variant?: "slide" | "wipe";
}

export default function AnimatedTitle({
  lines,
  className = "",
  scroll = false,
  as = "div",
  variant = "slide",
}: AnimatedTitleProps) {
  const ease = [0.16, 1, 0.3, 1] as const;

  const container = {
    hidden: { opacity: variant === "wipe" ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        // Both variants cascade top-to-bottom: line 1, then 2, then 3.
        staggerChildren: variant === "wipe" ? 0.5 : 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // --- slide variant (original) ---
  const slideItem = {
    hidden: { y: "115%", rotate: 2 },
    show: { y: 0, rotate: 0, transition: { duration: 0.9, ease } },
  };

  // --- wipe variant ---
  // The line is covered by a block the colour of the text; it scales away to the
  // right (origin-right, scaleX 1 → 0) so the text is uncovered left-to-right.
  const WIPE_DURATION = 2.4;
  const mask = {
    hidden: { scaleX: 1 },
    show: { scaleX: 0, transition: { duration: WIPE_DURATION, ease: "easeInOut" as const } },
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
              <span className="block">{line}</span>
              <motion.span
                variants={mask}
                aria-hidden
                className="pointer-events-none absolute inset-0 origin-right bg-paper"
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
