"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ChapterMarkerProps {
  kicker: string;
  tone?: "light" | "dark";
  className?: string;
}

export function ChapterMarker({ kicker, tone = "light", className }: ChapterMarkerProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        tone === "dark" ? "text-champagne" : "text-gold",
        className
      )}
    >
      <motion.span
        aria-hidden
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="gold-rule-solid w-16 origin-left"
      />
      <span className="eyebrow">{kicker}</span>
    </div>
  );
}
