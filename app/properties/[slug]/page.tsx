import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getByCategory, getProperty, properties } from "@/data/properties";
import { PageHero } from "@/components/sections/PageHero";
import { Gallery } from "@/components/Gallery";
import { PropertyCard } from "@/components/PropertyCard";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: "Property · Josh Properties" };
  return {
    title: property.title,
    description: `${property.short} ${property.location}. ${property.price} · ${property.area}.`,
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const images = [
    { src: `https://picsum.photos/seed/${property.seed}-hero/1600/1000`, alt: `${property.title}, main view` },
    { src: `https://picsum.photos/seed/${property.seed}-2/1600/1000`, alt: `${property.title}, interior detail` },
    { src: `https://picsum.photos/seed/${property.seed}-3/1600/1000`, alt: `${property.title}, exterior` },
    { src: `https://picsum.photos/seed/${property.seed}-4/1600/1000`, alt: `${property.title}, interior in light` },
    { src: `https://picsum.photos/seed/${property.seed}-5/1600/1000`, alt: `${property.title}, outlook` },
  ];
  const more = getByCategory(property.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={`${property.category} · ${property.location}`}
        title={property.title}
        seed={`${property.seed}-hero`}
      >
        <p>
          {property.short}
        </p>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-emerald">
          {property.price} · {property.area}
          {property.beds ? ` · ${property.beds}` : ""} · {property.status}
        </p>
      </PageHero>

      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20">
          <Reveal>
            <ChapterMarker kicker="Walk through" />
          </Reveal>
          <RevealMask delay={0.1}>
            <h2 className="mt-8 max-w-[20ch] text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-6xl">
              Drag through the property.
            </h2>
          </RevealMask>
        </div>
        <Reveal delay={0.2} className="mt-12">
          <Gallery images={images} className="lg:px-0" />
        </Reveal>
      </section>

      <section className="bg-stone">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-6 py-24 sm:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24 lg:px-20 lg:py-32">
          <div>
            <Reveal>
              <ChapterMarker kicker="The story" />
            </Reveal>
            <RevealMask delay={0.1}>
              <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-5xl">
                Why this property exists.
              </h2>
            </RevealMask>
            <div className="mt-10 space-y-6">
              {property.narrative.map((para, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="max-w-[64ch] text-pretty text-[17px] leading-relaxed text-ink/75">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="border border-ink/15 bg-paper">
                <div className="border-b border-ink/15 px-7 py-5">
                  <p className="eyebrow text-slate">The facts</p>
                </div>
                <dl className="divide-y divide-ink/10 px-7 py-2">
                  {property.specs.map((s, i) => (
                    <Reveal key={s.label} delay={0.05 * i}>
                      <div className="flex items-baseline justify-between gap-6 py-4 transition-colors duration-300 hover:bg-mist/50">
                        <dt className="text-[13px] uppercase tracking-[0.12em] text-ink/50">
                          {s.label}
                        </dt>
                        <dd className="text-right font-display text-lg text-ink">
                          {s.value}
                        </dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>
                <div className="border-t border-ink/15 p-7">
                  <p className="text-[14px] leading-relaxed text-ink/60">
                    The full chain of title, revenue records and survey maps are
                    provided to serious enquirers before any payment is
                    discussed.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <MagneticButton href="/contact">
                      <Button href="/contact" variant="filled" data-cursor="ENQUIRE" className="group w-full justify-center">
                        Enquire about this property
                        <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </MagneticButton>
                    <MagneticButton href={site.phoneHref}>
                      <Button href={site.phoneHref} variant="outline" className="w-full justify-center">
                        <Phone size={15} strokeWidth={1.5} />
                        {site.phone}
                      </Button>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
            <div className="flex items-end justify-between gap-8">
              <div>
                <Reveal>
                  <ChapterMarker kicker="Also in this ground" />
                </Reveal>
                <RevealMask delay={0.1}>
                  <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-5xl">
                    If this is almost right.
                  </h2>
                </RevealMask>
              </div>
              <Reveal delay={0.2}>
                <Link
                  href={
                    property.category === "villa"
                      ? "/villas"
                      : property.category === "apartment"
                        ? "/apartments"
                        : "/farmlands"
                  }
                  className="link-underline eyebrow group flex items-center gap-2 whitespace-nowrap text-slate transition-colors hover:text-emerald"
                >
                  View the full list
                  <span className="h-px w-8 bg-slate/50 transition-all duration-300 group-hover:w-14 group-hover:bg-emerald" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              {more.map((p) => (
                <Reveal key={p.slug}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
