import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero (cinematic scroll scenes)",
      type: "object",
      description: "Keep phrases short — these are choreographed to a fixed scroll animation and long text can overflow or throw off timing.",
      fields: [
        defineField({ name: "kicker", type: "string", validation: (r) => r.required() }),
        defineField({ name: "place", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "words",
          title: "Scene 2 words (exactly 3)",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) => r.required().length(3),
        }),
        defineField({ name: "titleLine1", type: "string", validation: (r) => r.required() }),
        defineField({ name: "titleLine2", type: "string", validation: (r) => r.required() }),
        defineField({ name: "verificationNote", type: "string", validation: (r) => r.required() }),
        defineField({ name: "brandLine", type: "string", validation: (r) => r.required() }),
        defineField({ name: "brandSub", type: "string", validation: (r) => r.required() }),
        defineField({ name: "ctaLabel", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats section",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string", validation: (r) => r.required() }),
        defineField({ name: "folioLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "footerNote", type: "string", validation: (r) => r.required() }),
        defineField({ name: "eoe", title: "E. & O.E. label", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured section",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "offerings",
      title: "Offerings section",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "story",
      title: "Story section",
      type: "object",
      fields: [
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "imageCaption", type: "string", validation: (r) => r.required() }),
        defineField({ name: "folioLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "verifiedLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "headingPlain", type: "string", validation: (r) => r.required() }),
        defineField({ name: "headingItalic", type: "string", validation: (r) => r.required() }),
        defineField({ name: "pullQuote", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "bodyParagraphs",
          type: "array",
          of: [{ type: "text", rows: 3 }],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "signoffName", type: "string", validation: (r) => r.required() }),
        defineField({ name: "signoffTitle", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "farmlandBand",
      title: "Farmland band section",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "ctaLabel", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "grounds",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string", validation: (r) => r.required() }),
                defineField({ name: "image", type: "image", options: { hotspot: true } }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "whyJosh",
      title: "Why Josh section",
      type: "object",
      fields: [defineField({ name: "heading", type: "string", validation: (r) => r.required() })],
    }),
    defineField({
      name: "process",
      title: "Process (Method) section",
      type: "object",
      fields: [
        defineField({ name: "kicker", type: "string", validation: (r) => r.required() }),
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "intro", type: "text", rows: 2, validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "faqSection",
      title: "FAQ section",
      type: "object",
      fields: [defineField({ name: "heading", type: "string", validation: (r) => r.required() })],
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA section",
      type: "object",
      fields: [
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "headingPlain", type: "string", validation: (r) => r.required() }),
        defineField({ name: "headingEmphasis", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
        defineField({ name: "ctaEnquireLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "ctaWhatsappLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "founded", type: "string", validation: (r) => r.required() }),
        defineField({ name: "byAppointment", type: "string", validation: (r) => r.required() }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
