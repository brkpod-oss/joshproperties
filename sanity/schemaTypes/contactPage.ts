import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({ name: "kicker", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "concierceHeading", title: "Concierge line heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "emailNote", type: "string", validation: (r) => r.required() }),
    defineField({ name: "officeHeading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "officeNote", type: "string", validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});
