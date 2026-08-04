"use client";

import { motion, useReducedMotion } from "motion/react";

interface MaskLinesProps {
  lines: Array<{ text: string; italic?: boolean; className?: string }>;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "div";
  className?: string;
}

export function MaskLines({ lines, delay = 0, stagger = 0.12, as = "h1", className }: MaskLinesProps) {
  const reduce = useReducedMotion();
  const Tag = as as "h1";

  return (
    <Tag aria-label={lines.map((l) => l.text).join(" ")} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            aria-hidden
            className={`block will-change-transform ${line.className ?? ""}`}
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line.italic ? <em className="italic">{line.text}</em> : line.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
