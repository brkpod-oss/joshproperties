import { existsSync } from "fs";
import path from "path";
import Image from "next/image";
import { Seal } from "@/components/ui/Seal";
import { HeroIntro } from "@/components/sections/HeroIntro";
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
        <span className="text-brass/80">Title office · Hyderabad</span>
        <span className="h-px w-16 bg-paper/30" />
      </div>

      <HeroIntro />
    </section>
  );
}
