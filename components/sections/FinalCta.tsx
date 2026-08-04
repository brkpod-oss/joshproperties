"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-obsidian"
    >
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(200,168,107,0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-6 py-32 text-center sm:px-12 lg:px-20 lg:py-48">
        <Reveal delay={0.1}>
          <h2 className="mx-auto mt-8 max-w-[16ch] text-balance font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-ivory lg:text-6xl">
            Let&rsquo;s build something{" "}
            <span className="text-champagne">lasting</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-[52ch] text-pretty text-lg leading-relaxed text-ivory/60">
            Book a private consultation. We come to your home, listen for an
            hour, and bring material samples.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton href={site.phoneHref}>
              <Button href={site.phoneHref} variant="outline" size="lg" className="border-champagne/50 text-champagne hover:bg-champagne/10">
                <Phone size={16} strokeWidth={1.5} />
                {site.phone}
              </Button>
            </MagneticButton>
            <MagneticButton href={site.whatsapp}>
              <Button href={site.whatsapp} variant="ghost" size="lg" className="text-ivory/70 hover:text-champagne">
                <MessageCircle size={16} strokeWidth={1.5} />
                WhatsApp us
              </Button>
            </MagneticButton>
            <MagneticButton href="/contact">
              <Button href="/contact" variant="filled" size="lg" className="group">
                Book consultation
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-12 text-sm italic text-ivory/40">
            Or simply walk in — we&rsquo;re at {site.address}. By appointment.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
