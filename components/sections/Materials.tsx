import Image from "next/image";
import { materials } from "@/data/materials";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";

export function Materials() {
  return (
    <section className="overflow-hidden bg-carbon">
      <div className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 lg:px-20 lg:py-36">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <ChapterMarker kicker="Materials" tone="dark" />
            </Reveal>
            <RevealMask delay={0.1}>
              <h2 className="mt-8 max-w-[16ch] text-balance font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-ivory lg:text-6xl">
                Eight materials. Endless compositions.
              </h2>
            </RevealMask>
          </div>
          <Reveal delay={0.2}>
            <p className="eyebrow max-w-[28ch] text-bronze">
              Drawn by hand at partner showrooms — never chosen from a brochure
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {materials.map((m) => (
              <article
                key={m.name}
                className="group w-[300px] shrink-0 snap-start border-t border-gold/30 lg:w-[320px]"
              >
                <div className="vignette relative aspect-[4/5] overflow-hidden rounded-[2px]">
                  <Image
                    src={`https://picsum.photos/seed/${m.seed}/640/800`}
                    alt={`${m.name} — ${m.note}`}
                    fill
                    sizes="(max-width: 640px) 300px, 320px"
                    className="object-cover grayscale-[0.3] transition-[filter,transform] duration-[1200ms] ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
                  />
                </div>
                <h3 className="mt-5 font-display text-2xl font-light text-ivory">
                  {m.name}
                </h3>
                <p className="mt-1 text-[13px] text-ivory/50">{m.note}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
