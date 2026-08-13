import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "context", title: "Context (e.g. city)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "project", title: "Project", type: "string", validation: (r) => r.required() }),
    defineField({ name: "featured", title: "Featured (shown large)", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "project" } },
});
