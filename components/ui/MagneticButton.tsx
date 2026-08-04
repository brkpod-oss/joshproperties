"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
  label?: string;
}

export function MagneticButton({
  children,
  className,
  href,
  strength = 10,
  label,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  function onPointerMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set((dx / rect.width) * strength);
    y.set((dy / rect.height) * strength);
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={label}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.a>
  );
}
