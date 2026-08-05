"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

/** Minimal fade-up used for numerals and small metadata. Disables under reduced motion. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 10,
  duration = 0.7,
}: FadeInProps) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={cn("block", className)}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}
