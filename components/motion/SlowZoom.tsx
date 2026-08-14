"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface SlowZoomProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Slow, barely-perceptible settle for large photography:
 * scale 1.08 → 1 when the frame enters the viewport.
 * Used for farmland imagery and the final CTA backdrop.
 */
export function SlowZoom({ children, className, delay = 0 }: SlowZoomProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={cn("relative h-full w-full", className)}>{children}</div>;

  return (
    <motion.div
      className={cn("relative h-full w-full will-change-transform", className)}
      initial={{ scale: 1.08 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
