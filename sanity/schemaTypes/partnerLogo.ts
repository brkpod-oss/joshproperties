import { defineField, defineType } from "sanity";

export default defineType({
  name: "partnerLogo",
  title: "Ground / partner logo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "note", title: "Note", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "note" } },
});
