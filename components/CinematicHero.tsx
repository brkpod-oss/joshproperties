"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Seal } from "@/components/ui/Seal";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINE_ONE = "We sell the title.";
const LINE_TWO = "The land is a bonus.";

/**
 * Scroll-scrubbed cinematic hero.
 *
 * The video is NOT an autoplay background. Its timeline is owned by scroll:
 * scrolling forward advances currentTime, scrolling back rewinds it, and
 * stopping pauses on that frame. A spring-smoothed progress value (read in a
 * rAF loop, never in React state) gives the scrubbing slight inertia, and the
 * re-encoded clip (keyframe every 6 frames) keeps seeking smooth.
 *
 * The hero holds a 220vh section with a sticky 100dvh viewport. Text layers
 * choreograph across scroll progress and a bottom gradient dissolves the final
 * frame into the next section. Reduced motion renders a static poster hero.
 */
export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Slight inertia: the video eases toward the target frame instead of jumping.
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0001,
  });

  // --- scrub loop: smooth currentTime toward target, dead-banded ---
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.readyState >= 2 && v.duration > 0) {
        const target = progress.get() * v.duration;
        if (!v.seeking && Math.abs(v.currentTime - target) > 0.03) {
          v.currentTime = target;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, progress]);

  // --- unlock frame decode (muted play then pause) ---
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const unlock = () => {
      v.play().then(() => v.pause()).catch(() => {});
    };
    unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  // --- scroll choreography ---
  // Opening layer (headline + CTAs): fades and drifts up as the film begins.
  const openingOpacity = useTransform(progress, [0.16, 0.3], [1, 0]);
  const openingY = useTransform(progress, [0.16, 0.42], [0, -25]);
  const legibility = useTransform(progress, [0.55, 0.74], [1, 0]);
  // Layer B: Private real estate advisory / Hyderabad.
  const layerBIn = useTransform(progress, [0.3, 0.44], [0, 1]);
  const layerBOut = useTransform(progress, [0.48, 0.6], [1, 0]);
  // Layer C: CURATED. VERIFIED. PRIVATE., word by word.
  const word1 = useTransform(progress, [0.44, 0.52], [0, 1]);
  const word2 = useTransform(progress, [0.52, 0.6], [0, 1]);
  const word3 = useTransform(progress, [0.6, 0.68], [0, 1]);
  const wordY1 = useTransform(progress, [0.44, 0.52], [14, 0]);
  const wordY2 = useTransform(progress, [0.52, 0.6], [14, 0]);
  const wordY3 = useTransform(progress, [0.6, 0.68], [14, 0]);
  const layerCOut = useTransform(progress, [0.7, 0.78], [1, 0]);
  // Final caption + dissolve into the next section.
  const caption = useTransform(progress, [0.86, 0.93], [0, 1]);
  const dissolve = useTransform(progress, [0.68, 0.92], [0, 1]);
  const scale = useTransform(progress, [0, 1], [1, 1.03]);
  const indicator = useTransform(progress, [0.06, 0.12], [0, 1]);

  if (reduce) return <StaticHero />;

  return (
    <section ref={sectionRef} className="relative h-[160vh] md:h-[220vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-carbon">
        {/* Scroll-scrubbed film */}
        <motion.div aria-hidden className="absolute inset-0 will-change-transform" style={{ scale }}>
          <video
            ref={videoRef}
            src={site.heroVideo}
            poster="/hero-poster.jpg"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Cinematic treatment */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,7,6,0.6)] via-[rgba(7,7,6,0.22)] to-transparent" />
        <motion.div
          aria-hidden
          style={{ opacity: legibility }}
          className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-carbon/90 via-carbon/35 to-transparent"
        />
        <div className="vignette absolute inset-0" />
        <Seal className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 text-paper/[0.05] lg:h-96 lg:w-96" />

        {/* 0-30%: opening headline + CTAs */}
        <motion.div
          style={{ opacity: openingOpacity, y: openingY }}
          className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-12 lg:px-20 lg:pb-24"
        >
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60"
          >
            <span>Private advisory</span>
            <span className="h-px w-10 bg-brass/70" aria-hidden />
            <span>Hyd 17.40°N</span>
            <span className="hidden sm:inline">Est 2017</span>
          </motion.p>

          <motion.svg
            aria-hidden
            viewBox="0 0 260 40"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            className="mt-8 w-40 text-brass"
          >
            <motion.path
              d="M0 32 L90 32 L150 8 L260 8"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }}
            />
            <path d="M146 8 L150 8 L150 4" stroke="currentColor" strokeWidth="1" />
          </motion.svg>

          <h1 className="mt-6 font-display text-[clamp(3.5rem,10.5vw,8.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
              >
                {LINE_ONE.split(" ").map((w, i) => (
                  <span key={i} className="mr-[0.24em] inline-block whitespace-nowrap text-paper">
                    {w}
                  </span>
                ))}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block pb-2 italic text-brass"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
              >
                {LINE_TWO.split(" ").map((w, i) => (
                  <span key={i} className="mr-[0.24em] inline-block whitespace-nowrap">
                    {w}
                  </span>
                ))}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-paper/80"
          >
            Villas, apartments and cleared-title farmland across Hyderabad.
            Verified, private, shown by appointment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: EASE }}
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
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
          </motion.div>
        </motion.div>

        {/* 30-45%: Private real estate advisory / Hyderabad */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: layerBIn }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
        >
          <motion.div style={{ opacity: layerBOut }} className="flex flex-col items-center gap-6 text-center">
            <span className="h-px w-16 bg-brass/80" aria-hidden />
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/80">
              Private real estate advisory
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald">
              Hyderabad
            </p>
          </motion.div>
        </motion.div>

        {/* 45-68%: CURATED. VERIFIED. PRIVATE. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: layerCOut }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[0.5em] px-6"
        >
          <motion.span
            style={{ opacity: word1, y: wordY1 }}
            className="font-display text-[clamp(2.5rem,7vw,6rem)] font-light text-paper"
          >
            CURATED.
          </motion.span>
          <motion.span
            style={{ opacity: word2, y: wordY2 }}
            className="font-display text-[clamp(2.5rem,7vw,6rem)] font-light text-paper"
          >
            VERIFIED.
          </motion.span>
          <motion.span
            style={{ opacity: word3, y: wordY3 }}
            className="font-display text-[clamp(2.5rem,7vw,6rem)] font-light italic text-emerald"
          >
            PRIVATE.
          </motion.span>
        </motion.div>

        {/* ~90%: final caption */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: caption }}
          className="pointer-events-none absolute inset-x-0 bottom-16 z-10 flex justify-center px-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60">
            The title comes first.
          </p>
        </motion.div>

        {/* 72-100%: dissolve into the next section (warm ivory) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh]"
          style={{
            opacity: dissolve,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(242,239,232,0.15) 55%, #f2efe8 100%)",
          }}
        />

        {/* Scroll progress indicator */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: indicator }}
          className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex xl:right-10"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper/40">01</span>
          <div className="relative h-28 w-px bg-paper/20">
            <motion.div
              className="absolute inset-0 origin-top bg-brass"
              style={{ scaleY: progress }}
            />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper/40">02</span>
        </motion.div>
      </div>
    </section>
  );
}

/** Reduced-motion fallback: premium static poster hero, content visible. */
function StaticHero() {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-carbon">
      <div className="absolute inset-0">
        <Image
          src="/hero-poster.jpg"
          alt="Aerial dusk view over a luxury villa near Hyderabad"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,7,6,0.72)] via-[rgba(7,7,6,0.28)] to-[rgba(7,7,6,0.12)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/35 to-carbon/30" />
      <div className="vignette absolute inset-0" />
      <Seal className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 text-paper/[0.06] lg:h-96 lg:w-96" />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-12 lg:px-20 lg:pb-24">
        <p className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60">
          <span>Private advisory</span>
          <span className="h-px w-10 bg-brass/70" aria-hidden />
          <span>Hyd 17.40°N</span>
          <span className="hidden sm:inline">Est 2017</span>
        </p>
        <svg aria-hidden viewBox="0 0 260 40" fill="none" className="mt-8 w-40 text-brass">
          <path d="M0 32 L90 32 L150 8 L260 8" stroke="currentColor" strokeWidth="1" />
          <path d="M146 8 L150 8 L150 4" stroke="currentColor" strokeWidth="1" />
        </svg>
        <h1 className="mt-6 font-display text-[clamp(3.5rem,10.5vw,8.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
          <span className="block text-paper">{LINE_ONE}</span>
          <span className="block pb-2 italic text-brass">{LINE_TWO}</span>
        </h1>
        <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-paper/80">
          Villas, apartments and cleared-title farmland across Hyderabad.
          Verified, private, shown by appointment.
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
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
    </section>
  );
}
