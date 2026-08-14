import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { PropertyListing } from "@/components/PropertyListing";
import { DayNightCity } from "@/components/DayNightCity";
import { Reveal } from "@/components/motion/Reveal";
import { getCategoryPage, getPropertiesByCategory } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Apartments in Hyderabad",
  description:
    "A curated list of apartments and penthouses in the city's sharpest towers, chosen for light, outlook and the quietness of the corridor.",
};

export default async function ApartmentsPage() {
  const [page, properties] = await Promise.all([
    getCategoryPage("apartment"),
    getPropertiesByCategory("apartment"),
  ]);

  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={
          <>
            {page.heroTitleLine1}
            <br />
            {page.heroTitleLine2}
          </>
        }
        seed="josh-apartments"
      >
        <p>{page.heroBody}</p>
      </PageHero>

      <section className="bg-stone">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 py-24 sm:px-12 lg:grid-cols-2 lg:gap-24 lg:px-20 lg:py-32">
          <Reveal>
            <DayNightCity />
          </Reveal>
          <div>
            <Reveal>
              <h2 className="text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-6xl">
                {page.outlookHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                {page.outlookBody1}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                {page.outlookBody2}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <PropertyListing
        kicker={page.listingKicker}
        heading={page.listingHeading}
        intro={page.listingIntro}
        items={properties}
      />
    </>
  );
}
