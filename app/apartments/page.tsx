import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PropertyListing } from "@/components/PropertyListing";
import { DayNightCity } from "@/components/DayNightCity";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Apartments in Hyderabad",
  description:
    "A curated list of apartments and penthouses in the city's sharpest towers, chosen for light, outlook and the quietness of the corridor.",
};

export default function ApartmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="The apartments"
        title={
          <>
            Altitudes made
            <br />
            private.
          </>
        }
        seed="josh-apartments"
      >
        <p>
          Penthouses and residences where the skyline does the decorating,
          by night and by day.
        </p>
      </PageHero>

      <section className="bg-stone">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 py-24 sm:px-12 lg:grid-cols-2 lg:gap-24 lg:px-20 lg:py-32">
          <Reveal>
            <DayNightCity />
          </Reveal>
          <div>
            <Reveal>
              <h2 className="text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-6xl">
                The outlook is half the property.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                We choose apartments for what they face as much as what they
                contain. Light angles, corridor silence, and the quality of the
                skyline after dark. Drag the study above to see how a south
                tower behaves from noon to night.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                Each residence is shown with its full chain of title and a
                line-itemed price: the same number on the offer letter is the
                number on the sale deed.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <PropertyListing
        category="apartment"
        kicker="Curated residences"
        heading="A short list of sharp towers."
        intro="From a double-height penthouse to a park-front three-bed, each one held because we would live in it."
      />
    </>
  );
}
