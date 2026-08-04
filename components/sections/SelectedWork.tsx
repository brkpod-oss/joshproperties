"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/data/projects";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";

const categories = ["All", "Full Home", "Kitchen", "Pooja"];

export function SelectedWork() {
  const [active, setActive] = useState("All");
  const reduce = useReducedMotion();
  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="work" className="bg-linen">
      <div className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal>
          <ChapterMarker kicker="Selected work" />
        </Reveal>
        <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <RevealMask delay={0.1}>
            <h2 className="max-w-[16ch] text-balance font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-6xl">
              Selected work, twelve years in.
            </h2>
          </RevealMask>
          <Reveal delay={0.2}>
            <div
              role="tablist"
              aria-label="Filter projects by category"
              className="flex items-center gap-8"
            >
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active === c}
                  onClick={() => setActive(c)}
                  className={`relative py-2 text-[12px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    active === c ? "text-ink" : "text-ink/40 hover:text-ink/70"
                  }`}
                >
                  {c}
                  {active === c && (
                    <motion.span
                      layoutId="work-filter-underline"
                      className="absolute inset-x-0 bottom-0 h-px bg-gold"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div
          layout
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project) => (
              <motion.div
                layout
                key={project.title}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={project.tall ? "lg:row-span-2" : undefined}
              >
                <a
                  href="#contact"
                  className="group relative block overflow-hidden rounded-[2px] bg-carbon"
                >
                  <div
                    className={
                      project.tall
                        ? "relative aspect-[3/4]"
                        : "relative aspect-[4/3]"
                    }
                  >
                    <Image
                      src={`https://picsum.photos/seed/${project.seed}/${project.tall ? 900 : 1200}/${project.tall ? 1200 : 900}`}
                      alt={`${project.title} — ${project.area}, ${project.location}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale-[0.25] transition-[filter,transform] duration-[1200ms] ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-carbon/0 transition-colors duration-500 group-hover:bg-carbon/55" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-champagne">
                        {project.edition}
                      </p>
                      <div>
                        <p className="font-display text-3xl font-light text-ivory">
                          {project.title}
                        </p>
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-pearl/80">
                          {project.area} · {project.location} · {project.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
