"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const TARGET = "[data-cursor]";

/**
 * Scoped premium cursor, desktop fine-pointer only.
 * Appears only over elements carrying `data-cursor` (property imagery,
 * gallery, large CTAs) and shows their label inside a small brass ring.
 * The native cursor is never hidden. Fully disabled on touch devices
 * and under reduced motion.
 */
export function PremiumCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const hit = t?.closest<HTMLElement>(TARGET);
      setActive(!!hit);
      setLabel(hit ? (hit.getAttribute("data-cursor") ?? null) : null);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduce, x, y]);

  if (!enabled || reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]">
      <motion.div style={{ x: ringX, y: ringY }} className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{
            opacity: active ? 1 : 0,
            scale: active ? 1 : 0.8,
            width: active ? (label ? 96 : 56) : 0,
            height: active ? (label ? 96 : 56) : 0,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center overflow-hidden rounded-full border border-brass/80 bg-carbon/40 backdrop-blur-[2px]"
        >
          {label && (
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
