"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface CurtainRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * Signature Josh Properties image reveal: an opaque curtain wipes away
 * (top to bottom) while the image beneath settles from scale(1.08) to 1.
 * The curtain is a decorative sibling, not an ancestor of the image —
 * clip-path on an ancestor zeroes out the image's IntersectionObserver
 * rect (ancestor clipping counts toward it per spec), which silently
 * defeats next/image's native lazy-loading and the photo never fetches.
 * Disables under reduced motion.
 */
export function CurtainReveal({
  children,
  className,
  delay = 0,
  duration = 1.4,
}: CurtainRevealProps) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("overflow-hidden", className)}>
      {reduce ? (
        children
      ) : (
        <div className="relative h-full w-full">
          <motion.div
            className="relative h-full w-full will-change-transform"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: duration + 0.2,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {children}
          </motion.div>
          <motion.div
            aria-hidden
            className="absolute inset-0 origin-bottom bg-carbon will-change-transform"
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}
    </div>
  );
}
