import { defineField, defineType } from "sanity";

export default defineType({
  name: "processStep",
  title: "Process step",
  type: "document",
  fields: [
    defineField({ name: "step", title: "Step numeral (I, II, III...)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "week", title: "Timing (e.g. Day 0, Week 2)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "week" } },
});
