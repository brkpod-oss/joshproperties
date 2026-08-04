"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { MaskLines } from "@/components/motion/MaskLines";
import { site } from "@/lib/site";

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const lightX = useMotionValue(50);
  const lightY = useMotionValue(38);
  const sx = useSpring(lightX, { stiffness: 50, damping: 18, mass: 0.6 });
  const sy = useSpring(lightY, { stiffness: 50, damping: 18, mass: 0.6 });
  const px = useTransform(sx, (v) => `${v}%`);
  const py = useTransform(sy, (v) => `${v}%`);

  function onPointerMove(e: React.PointerEvent) {
    const el = sectionRef.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    lightX.set(((e.clientX - rect.left) / rect.width) * 100);
    lightY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-carbon"
    >
      <motion.div
        aria-hidden
        style={{ left: px, top: py }}
        className="pointer-events-none absolute z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"
      >
        <motion.div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(232,213,160,0.14), transparent 70%)",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        initial={reduce ? false : { scale: 1.08 }}
        animate={
          reduce
            ? undefined
            : { scale: [1.08, 1.16], y: ["0%", "-2%"] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }
        className="absolute inset-0"
      >
        <Image
          src="https://picsum.photos/seed/victory-hero/2400/2000"
          alt="Living room in warm walnut and ivory linen, composed by Victory Atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/35 to-carbon/40" />
      <div className="vignette absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 sm:px-12 lg:px-20 lg:pb-20">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="eyebrow text-champagne"
        >
          Est. 2012 · Khammam · Telangana
        </motion.p>

        <MaskLines
          delay={0.35}
          stagger={0.14}
          className="mt-8 font-display text-[clamp(3.5rem,10vw,7.5rem)] font-light leading-[0.95] tracking-[-0.02em]"
          lines={[
            {
              text: "Your home,",
              className: "text-ivory",
            },
            {
              text: "composed.",
              italic: true,
              className: "text-champagne",
            },
          ]}
        />

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-8 max-w-[50ch] text-pretty text-lg leading-relaxed text-ivory/80"
        >
          Victory Atelier designs and builds five hundred homes like our own.
          In-house, line-itemed, Vastu-aware — and warrantied for ten years.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <MagneticButton href="#contact">
            <Button href="#contact" variant="filled" size="lg" className="group">
              Book a private consultation
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
          </MagneticButton>
          <Button href="#work" variant="ghost" size="lg" className="text-ivory/70 hover:text-champagne">
            Explore the work
          </Button>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-16 hidden items-center justify-between gap-8 border-t border-ivory/15 pt-6 md:flex"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/50">
            {site.phone}
          </p>
          <span className="gold-rule-solid w-40" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/50">
            Full-home · Kitchen · Wardrobes
          </p>
          <span className="gold-rule-solid w-40" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/50">
            By appointment
          </p>
        </motion.div>
      </div>

    </section>
  );
}
