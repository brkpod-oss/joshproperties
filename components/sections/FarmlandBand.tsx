import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";
import { Parallax } from "@/components/motion/Parallax";
import { SlowZoom } from "@/components/motion/SlowZoom";

const grounds = [
  { name: "Shankarpally", note: "Green belt", seed: "josh-farm-1" },
  { name: "Moinabad", note: "Lake country", seed: "josh-farm-2" },
  { name: "Chevella", note: "River plots", seed: "josh-farm-3" },
  { name: "Wyra", note: "Full holding", seed: "josh-farm-4" },
  { name: "Medchal", note: "Farmhouses", seed: "josh-farm-5" },
];

export function FarmlandBand() {
  return (
    <section className="overflow-hidden bg-carbon">
      <div className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 lg:px-20 lg:py-36">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <ChapterMarker kicker="The farmland" tone="dark" />
            </Reveal>
            <RevealMask delay={0.1}>
              <h2 className="mt-8 max-w-[18ch] text-balance font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-paper lg:text-7xl">
                Over 1,200 acres, flown and surveyed.
              </h2>
            </RevealMask>
          </div>
          <Reveal delay={0.2}>
            <a
              href="/farmlands"
              data-cursor="EXPLORE"
              className="group inline-flex items-center gap-3 border border-emerald/40 px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.12em] text-emerald transition-colors duration-300 hover:bg-emerald/10"
            >
              Explore the land
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {grounds.map((g) => (
              <article
                key={g.name}
                className="group w-[300px] shrink-0 snap-start border-t border-paper/20 lg:w-[360px]"
              >
                <a href="/farmlands" className="block" data-cursor="VIEW">
                  <div className="vignette relative aspect-[4/5] overflow-hidden rounded-[2px]">
                    <Parallax strength={5} className="absolute inset-[-14%]">
                      <SlowZoom>
                        <Image
                          src={`https://picsum.photos/seed/${g.seed}/720/900`}
                          alt={`${g.name}, ${g.note}`}
                          fill
                          sizes="(max-width: 640px) 300px, 360px"
                          className="object-cover grayscale transition-[filter,transform] duration-[1200ms] ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
                        />
                      </SlowZoom>
                    </Parallax>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-light text-paper">
                    {g.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-paper/50">{g.note}</p>
                </a>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
