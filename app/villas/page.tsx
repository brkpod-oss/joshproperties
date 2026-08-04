import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PropertyListing } from "@/components/PropertyListing";

export const metadata: Metadata = {
  title: "Villas in Hyderabad",
  description:
    "Freehold villas across Jubilee Hills, Kokapet and Medchal, shown once, by appointment, with the full title chain verified before any price is discussed.",
};

export default function VillasPage() {
  return (
    <>
      <PageHero
        eyebrow="The villas"
        title={
          <>
            Houses on quiet,
            <br />
            tree-lined plots.
          </>
        }
        seed="josh-villas"
      >
        <p>
          A short list of freehold homes where the garden is the luxury and
          the title is verified before we ever talk money.
        </p>
      </PageHero>
      <PropertyListing
        category="villa"
        kicker="Freehold villas"
        heading="Three houses, none of them hurried."
        intro="Every villa is shown once, with its chain-of-title audit on the table. If you are not ready to buy, we say so."
      />
    </>
  );
}
