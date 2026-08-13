import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Brand name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "legalName", title: "Legal name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "city", title: "City", type: "string", validation: (r) => r.required() }),
    defineField({ name: "state", title: "State", type: "string", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Phone (display)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "phoneHref", title: "Phone (tel: link)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "whatsapp", title: "WhatsApp link (wa.me/...)", type: "url", validation: (r) => r.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required() }),
    defineField({ name: "address", title: "Address", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "hours", title: "Hours", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "position", title: "SEO description / position statement", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "heroVideo", title: "Hero video path (e.g. /hero.mp4)", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "navLinks",
      title: "Nav links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: "footerExploreLinks",
      title: "Footer: Explore links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: "footerGroundsLinks",
      title: "Footer: Grounds list",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "footerBlurb",
      title: "Footer brand blurb",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rera",
      title: "RERA / legal",
      type: "object",
      fields: [
        defineField({ name: "registeredUnder", type: "string", validation: (r) => r.required() }),
        defineField({ name: "number", type: "string", validation: (r) => r.required() }),
        defineField({ name: "note", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({ name: "enquireLabel", title: "Nav CTA label", type: "string", initialValue: "Enquire privately" }),
  ],
  preview: { select: { title: "name" } },
});
