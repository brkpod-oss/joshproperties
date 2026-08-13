import { defineField, defineType } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "folio", title: "Folio number", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["villa", "apartment", "farmland"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "location", title: "Location", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price", type: "string", validation: (r) => r.required() }),
    defineField({ name: "area", title: "Area", type: "string", validation: (r) => r.required() }),
    defineField({ name: "beds", title: "Beds (optional)", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Available", "Under Offer", "Sold"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "image", title: "Card / hero image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "short", title: "Short description", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "narrative",
      title: "Narrative paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({ name: "tall", title: "Tall card layout", type: "boolean", initialValue: false }),
    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "image" },
  },
});
