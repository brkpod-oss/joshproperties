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
 * Signature Josh Properties image reveal: a wrapper that clips from
 * 100% to 0 while the image inside settles from scale(1.08) to 1.
 * Animates only transform + clip-path. Disables under reduced motion.
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
        <motion.div
          className="h-full w-full will-change-transform"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>
      )}
    </div>
  );
}
