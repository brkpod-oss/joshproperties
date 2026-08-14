import { defineField, defineType } from "sanity";

export default defineType({
  name: "farmlandOption",
  title: "Farmland option",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "area", title: "Area (per plot)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Available", "Under Offer", "Limited"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "acres", title: "Holding note (e.g. total acres)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "price", media: "image" } },
});
