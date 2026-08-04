import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";

export function Services() {
  return (
    <section id="services" className="bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-6 py-28 sm:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-20 lg:py-40">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <ChapterMarker kicker="What we do" />
          </Reveal>
          <RevealMask delay={0.1}>
            <h2 className="mt-8 font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-6xl">
              Six ways to make a home yours.
            </h2>
          </RevealMask>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[46ch] text-pretty text-[17px] leading-relaxed text-ink/70">
              Every service is designed from a blank page for the family that
              will live with it — never sold as a package.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="vignette relative mt-12 aspect-[4/3] overflow-hidden rounded-[2px]">
              <Image
                src="https://picsum.photos/seed/victory-compositions/1000/750"
                alt="Modular kitchen in matte walnut with bronze-tinted glass by Victory Atelier"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="warm-grade absolute inset-0" />
            </div>
            <p className="eyebrow mt-5 text-bronze">
              In-house fabrication · 4,500 sq.ft workshop
            </p>
          </Reveal>
        </div>

        <div className="border-t border-gold/25">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={Math.min(i * 0.05, 0.2)}>
              <a
                href="#contact"
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-gold/25 py-10 transition-colors duration-300 hover:border-gold sm:gap-10"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-bronze">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-3xl font-light tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-gold lg:text-4xl">
                    {service.name}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-ink/60">
                    {service.detail}
                  </p>
                  <p className="eyebrow mt-4 text-bronze">
                    {service.projectCount} projects · begin a similar one
                  </p>
                </div>
                <span className="hidden h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10 sm:flex">
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.1}>
            <div className="flex justify-end pt-12">
              <MagneticButton>
                <Button href="#contact" variant="outline" className="group">
                  Request a full service list
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
