import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";
import { Parallax } from "@/components/motion/Parallax";
import { Seal } from "@/components/ui/Seal";

export function Story() {
  return (
    <section className="relative overflow-hidden bg-stone">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 py-28 sm:px-12 lg:grid-cols-2 lg:gap-24 lg:px-20 lg:py-40">
        <Reveal className="order-1">
          <div className="vignette relative aspect-[4/5] overflow-hidden rounded-[2px] lg:mr-24">
            <Parallax strength={6} className="absolute inset-[-12%]">
              <Image
                src="https://picsum.photos/seed/josh-story/1000/1250"
                alt="Late-afternoon light across a surveyed farmland holding"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </Parallax>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-slate">
            Surveyed plot, Chevella
          </p>
        </Reveal>

        <div className="order-2">
          <Reveal>
            <div className="border border-ink/15 bg-paper outline outline-1 outline-ink/10 outline-offset-[3px]">
              <div className="flex items-center justify-between gap-6 border-b border-ink/15 px-7 py-5 sm:px-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate">
                  Folio 001 · Title chain
                </p>
                <p className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-slate sm:block">
                  Verified by counsel
                </p>
              </div>

              <div className="relative px-7 py-10 sm:px-10">
                <Seal className="pointer-events-none absolute -right-5 -top-5 h-44 w-44 text-emerald/[0.07]" />
                <RevealMask>
                  <h2 className="font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-5xl">
                    We sell the title.
                    <br />
                    <em className="italic text-emerald">The land is a bonus.</em>
                  </h2>
                </RevealMask>

                <Reveal delay={0.15}>
                  <p className="mt-8 max-w-[34ch] font-display text-2xl font-light italic leading-snug text-ink/80">
                    A clear chain of title is the only luxury that compounds.
                  </p>
                </Reveal>

                <Reveal delay={0.25}>
                  <p className="mt-8 max-w-[60ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                    Josh Properties began in 2017 when a family friend bought a
                    villa with a clouded title and lost it to a dispute. That
                    single mistake became our method: every property is
                    title-audited by independent counsel, surveyed by drone, and
                    shown with the audit in hand, before any price is discussed.
                  </p>
                </Reveal>

                <Reveal delay={0.35}>
                  <p className="mt-5 max-w-[60ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                    Nine years on, we have closed a little over four thousand
                    plots and homes. We are still deliberately small, still by
                    appointment, and still of the opinion that the best advice we
                    can give you is sometimes not to buy.
                  </p>
                </Reveal>

                <Reveal delay={0.45}>
                  <div className="mt-12 flex items-center justify-between gap-6 border-t border-ink/15 pt-8">
                    <div className="flex items-baseline gap-4">
                      <p className="font-display text-3xl font-light tracking-[0.18em]">
                        JOSH
                      </p>
                      <p className="font-display text-sm italic text-slate">
                        Principal, Josh Properties
                      </p>
                    </div>
                    <Seal className="h-14 w-14 shrink-0 text-emerald" />
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
