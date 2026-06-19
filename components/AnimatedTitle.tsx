"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedTitleProps {
  lines: ReactNode[];
  className?: string;
}

export default function AnimatedTitle({ lines, className = "" }: AnimatedTitleProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: "115%", rotate: 2 },
    show: {
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`flex flex-col ${className}`}
    >
      {lines.map((line, idx) => (
        <div
          key={idx}
          className="relative block w-full overflow-hidden py-1"
        >
          <motion.div
            variants={item}
            className="origin-bottom-left"
          >
            {line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
