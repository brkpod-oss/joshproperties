"use client";

import { motion, useReducedMotion } from "motion/react";
import { stats } from "@/data/stats";
import { CountUp } from "@/components/motion/CountUp";
import { FadeIn } from "@/components/motion/FadeIn";
import { Reveal } from "@/components/motion/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function Stats() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-graphite">
      <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
        <Reveal>
          <div className="border border-paper/15 bg-graphite">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/15 px-6 py-5 sm:px-10">
              <p className="stamp text-paper/60">Title register · Select entries</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald/90">
                Folio I–IV
              </p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-paper/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="group relative flex h-full flex-col justify-between gap-10 px-6 py-12 sm:px-10 lg:border-l lg:first:border-l-0 lg:border-paper/15">
                    {/* Champagne draw-line over the divider */}
                    <motion.span
                      aria-hidden
                      initial={reduce ? false : { scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1, delay: 0.35 + i * 0.12, ease }}
                      className="absolute bottom-0 left-0 hidden h-full w-px origin-top bg-brass/45 lg:block"
                    />

                    <FadeIn
                      delay={0.1 + i * 0.08}
                      className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper/40"
                    >
                      {stat.numeral}
                    </FadeIn>

                    <div>
                      <span className="font-display text-6xl font-light leading-none text-emerald tabular-nums sm:text-7xl lg:text-8xl">
                        <CountUp value={stat.value} suffix={stat.suffix} />
                      </span>
                      <p className="mt-6 max-w-[16ch] text-[15px] leading-snug text-paper/80">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 px-6 py-4 sm:px-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper/35">
                As of {new Date().getFullYear()} · Internal register, verified by counsel
              </span>
              <span aria-hidden className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-paper/35 sm:inline">
                E. &amp; O.E.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
