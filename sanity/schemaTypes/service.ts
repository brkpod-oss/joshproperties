import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "numeral", title: "Numeral (I, II, III...)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Short description", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "href", title: "Link", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Only the first 4 services by order display on the homepage — the first 3 as featured cards, the 4th as the advisory row. Additional services beyond the 4th are not shown on the homepage.",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "href" } },
});
