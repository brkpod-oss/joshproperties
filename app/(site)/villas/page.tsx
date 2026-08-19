import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { PropertyListing } from "@/components/PropertyListing";
import { getCategoryPage, getPropertiesByCategory } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Villas in Hyderabad",
  description:
    "Freehold villas across Jubilee Hills, Kokapet and Medchal, shown once, by appointment, with the full title chain verified before any price is discussed.",
};

export default async function VillasPage() {
  const [page, properties] = await Promise.all([
    getCategoryPage("villa"),
    getPropertiesByCategory("villa"),
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
        seed="josh-villas"
      >
        <p>{page.heroBody}</p>
      </PageHero>
      <PropertyListing
        kicker={page.listingKicker}
        heading={page.listingHeading}
        intro={page.listingIntro}
        items={properties}
      />
    </>
  );
}
