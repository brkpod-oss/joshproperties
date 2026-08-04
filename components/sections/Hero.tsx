import { existsSync } from "fs";
import path from "path";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Seal } from "@/components/ui/Seal";
import { MaskLines } from "@/components/motion/MaskLines";
import { site } from "@/lib/site";

const hasVideo = existsSync(path.join(process.cwd(), "public", "hero.mp4"));
const poster = "https://picsum.photos/seed/josh-hero/2400/2000";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-carbon">
      <div className="absolute inset-0">
        {hasVideo ? (
          <video
            src={site.heroVideo}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 animate-[heroZoom_36s_ease-in-out_infinite_alternate]">
            <Image
              src={poster}
              alt="Aerial dusk view over Hyderabad's western farmlands"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/30 to-carbon/40" />
      <div className="vignette absolute inset-0" />

      <Seal className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 text-paper/[0.07] lg:h-96 lg:w-96" />

      <div
        aria-hidden
        className="absolute right-8 top-1/2 hidden -translate-y-1/2 rotate-90 items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45 lg:flex"
      >
        <span className="h-px w-16 bg-paper/30" />
        <span>Josh Properties</span>
        <span className="text-sage/80">Title office · Hyderabad</span>
        <span className="h-px w-16 bg-paper/30" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-12 lg:px-20 lg:pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/60">
          Private real-estate advisory
        </p>

        <MaskLines
          delay={0.35}
          stagger={0.16}
          className="mt-8 font-display text-[clamp(3.5rem,10.5vw,8rem)] font-light leading-[0.95] tracking-[-0.02em]"
          lines={[
            { text: "Own the land.", className: "text-paper" },
            {
              text: "Live the skyline.",
              italic: true,
              className: "pb-2 text-sage",
            },
          ]}
        />

        <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-paper/80">
          Villas, apartments and cleared-title farmland across Hyderabad.
          Verified, private, shown by appointment.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <MagneticButton href="#collection">
            <Button
              href="#collection"
              variant="filled"
              size="lg"
              className="group"
            >
              Explore the collection
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
              The farmlands
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
