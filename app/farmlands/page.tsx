import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { FarmlandMap } from "@/components/FarmlandMap";
import { DossierForm } from "@/components/DossierForm";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";
import { farmlandOptions } from "@/data/farmland";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Farmlands in Hyderabad & Telangana",
  description:
    "Over 1,200 acres of cleared-title farmland across Shankarpally, Moinabad and Chevella, flown by drone, boundary-surveyed, and offered by appointment.",
};

export default function FarmlandsPage() {
  return (
    <>
      <PageHero
        eyebrow="The farmlands"
        title={
          <>
            Land you can
            <br />
            stand on, and prove.
          </>
        }
        seed="josh-farmlands"
      >
        <p>
          Over 1,200 acres across Shankarpally, Moinabad, Chevella and Wyra,
          every holding flown by drone and title-audited before it is offered.
        </p>
      </PageHero>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
          <Reveal>
            <ChapterMarker kicker="The masterplan" />
          </Reveal>
          <RevealMask delay={0.1}>
            <h2 className="mt-8 max-w-[18ch] text-balance font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-7xl">
              Surveyed by drone, offered by plot.
            </h2>
          </RevealMask>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[58ch] text-pretty text-[16px] leading-relaxed text-ink/70">
              The Chevella River Plate is our current masterplan. Hover the map
              to read each holding: every boundary has been walked and marked
              by survey, and every title cleared before a rupee changes hands.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <FarmlandMap />
          </Reveal>
        </div>
      </section>

      <section className="bg-stone">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Reveal>
                <ChapterMarker kicker="Available grounds" />
              </Reveal>
              <RevealMask delay={0.1}>
                <h2 className="mt-8 max-w-[18ch] text-balance font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-7xl">
                  Four holdings, open today.
                </h2>
              </RevealMask>
            </div>
            <Reveal delay={0.2}>
              <p className="eyebrow max-w-[30ch] text-slate">
                Priced by the acre, line by line, no coordination charges, ever
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {farmlandOptions.map((o, i) => (
              <Reveal key={o.slug} delay={(i % 2) * 0.1}>
                <div className="group border border-ink/15 bg-paper">
                  <div className="vignette relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${o.droneSeed}/1200/750`}
                      alt={`${o.name}, drone survey`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-[transform,filter] duration-[1600ms] ease-out group-hover:scale-[1.06] group-hover:brightness-[1.04]"
                    />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl font-light text-ink lg:text-3xl">
                        {o.name}
                      </h3>
                      <span
                        className={
                          o.status === "Available"
                            ? "eyebrow text-emerald"
                            : "eyebrow text-ink/40"
                        }
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 border-t border-ink/15 pt-5">
                      <div>
                        <p className="eyebrow text-slate">Area</p>
                        <p className="mt-1 text-[15px] text-ink">{o.area}</p>
                      </div>
                      <div>
                        <p className="eyebrow text-slate">Price</p>
                        <p className="mt-1 text-[15px] text-ink">{o.price}</p>
                      </div>
                      <div>
                        <p className="eyebrow text-slate">Holding</p>
                        <p className="mt-1 text-[15px] text-ink">{o.acres}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-6 py-24 sm:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-20 lg:py-32">
          <div>
            <Reveal>
              <ChapterMarker kicker="Request the dossier" />
            </Reveal>
            <RevealMask delay={0.1}>
              <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-6xl">
                The numbers are private. So is the drone pass.
              </h2>
            </RevealMask>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-[50ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                Each dossier holds the drone stills and flight, the revenue
                survey, chain of title, soil and water notes, and a line-itemed
                offer. It is sent only to you, never to a list.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 text-[15px] leading-relaxed text-ink/50">
                Prefer to talk first? Call{" "}
                <a href={site.phoneHref} className="text-emerald underline-offset-4 hover:underline">
                  {site.phone}
                </a>
                . A concierge answers, not a call centre.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <DossierForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
