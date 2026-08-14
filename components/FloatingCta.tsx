"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUp, MessageCircle } from "lucide-react";

export function FloatingCta({ whatsapp }: { whatsapp: string }) {
  const [showTop, setShowTop] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="Back to top"
            initial={reduce ? false : { opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald/40 bg-paper/90 text-ink backdrop-blur transition-colors hover:border-emerald hover:text-emerald"
          >
            <ArrowUp size={16} strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Josh Properties on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-carbon shadow-lg shadow-emerald/25 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-pine"
      >
        <MessageCircle size={22} strokeWidth={1.5} />
      </a>
    </div>
  );
}
