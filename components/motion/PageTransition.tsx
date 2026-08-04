"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [covering, setCovering] = useState(false);

  if (!reduce && prevPathname !== pathname) {
    setPrevPathname(pathname);
    setCovering(true);
  }

  useEffect(() => {
    if (!covering) return;
    const t = setTimeout(() => setCovering(false), 520);
    return () => clearTimeout(t);
  }, [covering]);

  return (
    <AnimatePresence>
      {covering && (
        <motion.div
          key="curtain"
          aria-hidden
          className="fixed inset-0 z-[95] flex flex-col items-center justify-center gap-6 bg-paper"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate">
            Josh Properties
          </span>
          <span className="font-display text-4xl font-light tracking-[0.14em] text-ink">
            JOSH
          </span>
          <span className="stamp border border-emerald/70 px-3 py-1.5 text-emerald">
            RERA P02400005461
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
