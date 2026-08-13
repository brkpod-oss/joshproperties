// scripts/mapToSanityDocs.test.ts
import { describe, expect, it } from "vitest";
import { mapProperty, mapFaq, slugify } from "./mapToSanityDocs";
import type { Property } from "@/data/properties";

describe("slugify", () => {
  it("keeps an already-clean slug as the document id suffix", () => {
    expect(slugify("jubilee-house")).toBe("jubilee-house");
  });
});

describe("mapProperty", () => {
  const property: Property = {
    slug: "jubilee-house",
    folio: "001",
    title: "The Jubilee House",
    category: "villa",
    location: "Jubilee Hills, Hyderabad",
    price: "₹12.5 Cr",
    area: "8,400 sq.ft",
    beds: "5 BHK",
    status: "Available",
    seed: "josh-jubilee-house",
    image: "/images/villa-02.jpg",
    gallery: ["/images/villa-01.jpg", "/images/villa-02.jpg"],
    tall: true,
    featured: true,
    short: "A five-bedroom villa.",
    narrative: ["Paragraph one.", "Paragraph two."],
    specs: [{ label: "Built-up", value: "8,400 sq.ft" }],
  };

  const imageRefs = {
    "/images/villa-01.jpg": { _type: "image" as const, asset: { _type: "reference" as const, _ref: "image-a" } },
    "/images/villa-02.jpg": { _type: "image" as const, asset: { _type: "reference" as const, _ref: "image-b" } },
  };

  it("produces a deterministic document id from the slug", () => {
    const doc = mapProperty(property, imageRefs);
    expect(doc._id).toBe("property-jubilee-house");
    expect(doc._type).toBe("property");
  });

  it("carries over every scalar field unchanged", () => {
    const doc = mapProperty(property, imageRefs);
    expect(doc.title).toBe("The Jubilee House");
    expect(doc.folio).toBe("001");
    expect(doc.category).toBe("villa");
    expect(doc.beds).toBe("5 BHK");
    expect(doc.short).toBe("A five-bedroom villa.");
    expect(doc.narrative).toEqual(["Paragraph one.", "Paragraph two."]);
    expect(doc.specs).toEqual([{ label: "Built-up", value: "8,400 sq.ft" }]);
    expect(doc.tall).toBe(true);
    expect(doc.featured).toBe(true);
  });

  it("resolves the image and gallery fields to Sanity image references", () => {
    const doc = mapProperty(property, imageRefs);
    expect(doc.image).toEqual(imageRefs["/images/villa-02.jpg"]);
    expect(doc.gallery).toEqual([imageRefs["/images/villa-01.jpg"], imageRefs["/images/villa-02.jpg"]]);
  });

  it("omits the image field when the property has none", () => {
    const { image, ...rest } = property;
    void image;
    const doc = mapProperty({ ...rest, image: undefined }, imageRefs);
    expect(doc.image).toBeUndefined();
  });
});

describe("mapFaq", () => {
  it("assigns order from the array index", () => {
    const doc = mapFaq({ question: "Q1?", answer: "A1." }, 2);
    expect(doc._id).toBe("faq-2");
    expect(doc.order).toBe(2);
    expect(doc.question).toBe("Q1?");
  });
});
