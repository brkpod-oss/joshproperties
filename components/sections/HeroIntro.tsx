"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";

const LINE_ONE = "We sell the title.";
const LINE_TWO = "The land is a bonus.";

export function HeroIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(el.querySelectorAll(".hero-mask, .hero-fade"), {
          opacity: 1,
          y: 0,
          yPercent: 0,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        el.querySelectorAll(".hero-fade"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
        0.1
      )
        .fromTo(
          el.querySelectorAll(".hero-mask"),
          { yPercent: 112, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.09 },
          0.25
        )
        .fromTo(
          el.querySelectorAll(".survey-path"),
          { strokeDashoffset: 260 },
          { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" },
          0.5
        );
      return () => {
        tl.kill();
      };
    }, el);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-12 lg:px-20 lg:pb-24">
      <p className="hero-fade flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60 opacity-0">
        <span>Private advisory</span>
        <span className="h-px w-10 bg-brass/70" aria-hidden />
        <span>Hyd 17.40°N</span>
        <span className="hidden sm:inline">Est 2017</span>
      </p>

      <svg
        aria-hidden
        viewBox="0 0 260 40"
        fill="none"
        className="mt-8 w-40 text-brass"
      >
        <path
          d="M0 32 L90 32 L150 8 L260 8"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="260"
          strokeDashoffset="260"
          className="survey-path"
        />
        <path
          d="M146 8 L150 8 L150 4"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <h1 className="mt-6 font-display text-[clamp(3.5rem,10.5vw,8.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
        <span className="block overflow-hidden">
          <span className="hero-mask block opacity-0">
            {LINE_ONE.split(" ").map((w, i) => (
              <span key={i} className="mr-[0.24em] inline-block whitespace-nowrap text-paper">
                {w}
              </span>
            ))}
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="hero-mask block pb-2 italic text-brass opacity-0">
            {LINE_TWO.split(" ").map((w, i) => (
              <span key={i} className="mr-[0.24em] inline-block whitespace-nowrap">
                {w}
              </span>
            ))}
          </span>
        </span>
      </h1>

      <p className="hero-fade mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-paper/80 opacity-0">
        Villas, apartments and cleared-title farmland across Hyderabad.
        Verified, private, shown by appointment.
      </p>

      <div className="hero-fade mt-12 flex flex-col gap-4 opacity-0 sm:flex-row sm:items-center">
        <MagneticButton href="#collection">
          <Button href="#collection" variant="filled" size="lg" className="group brass-shimmer">
            View Collection
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
        </MagneticButton>
        <MagneticButton href="/farmlands">
          <Button
            href="/farmlands"
            variant="ghost"
            size="lg"
            className="text-paper/70 hover:text-paper"
          >
            Request dossier
          </Button>
        </MagneticButton>
      </div>
    </div>
  );
}
