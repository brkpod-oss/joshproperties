import { defineField, defineType } from "sanity";

export default defineType({
  name: "stat",
  title: "Stat",
  type: "document",
  fields: [
    defineField({ name: "value", title: "Value", type: "number", validation: (r) => r.required() }),
    defineField({ name: "suffix", title: "Suffix (e.g. %, +)", type: "string" }),
    defineField({ name: "prefix", title: "Prefix", type: "string" }),
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "numeral", title: "Roman numeral (I, II, III...)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "label", subtitle: "value" } },
});
