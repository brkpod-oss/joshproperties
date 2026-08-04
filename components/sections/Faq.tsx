"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { faqs } from "@/data/faqs";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="bg-stone">
      <div className="mx-auto max-w-[920px] px-6 py-28 sm:px-12 lg:py-40">
        <RevealMask delay={0.1}>
          <h2 className="text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-5xl">
            The questions every Hyderabad buyer asks.
          </h2>
        </RevealMask>

        <div className="mt-16">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.question} delay={Math.min(i * 0.03, 0.15)}>
                <div className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span
                      className={
                        isOpen
                          ? "font-display text-xl font-normal text-emerald lg:text-2xl"
                          : "font-display text-xl font-light text-ink lg:text-2xl"
                      }
                    >
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink/25 text-ink"
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[65ch] pb-8 text-pretty text-[15px] leading-relaxed text-ink/65">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
