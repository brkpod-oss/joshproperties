"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const HOVER_SELECTOR = "a, button, [data-cursor], input, textarea, select, label";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setHovering(!!target?.closest(HOVER_SELECTOR));
      setLabel(labelled ? (labelled.getAttribute("data-cursor") ?? null) : null);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[90]"
        aria-hidden
      >
        <motion.div
          animate={{ scale: pressed ? 0.5 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-sage"
        />
      </motion.div>
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[90]"
        aria-hidden
      >
        <motion.div
          animate={{
            scale: hovering ? 2.1 : 1,
            opacity: hovering ? 0.9 : 0.45,
            width: label ? 92 : 40,
            height: label ? 92 : 40,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-emerald/70"
        >
          {label ? (
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald">
              {label}
            </span>
          ) : (
            <span className="h-1 w-1 rounded-full bg-emerald" />
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
