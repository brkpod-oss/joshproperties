"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealMaskProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function RevealMask({ children, delay = 0, className }: RevealMaskProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
