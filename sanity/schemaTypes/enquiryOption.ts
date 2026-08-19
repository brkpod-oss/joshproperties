import { defineField, defineType } from "sanity";

export default defineType({
  name: "enquiryOption",
  title: "Enquiry option",
  type: "document",
  description:
    "An option in the contact and farmland dossier forms. Each row becomes one choice (e.g. \"After 40\" for holding budget, or \"Private advisory\" for interest). Toggle Show off to hide a choice without deleting it.",
  fields: [
    defineField({
      name: "label",
      title: "Text shown to visitors",
      type: "string",
      description: "e.g. \"Private advisory\" or \"After 40\"",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "group",
      title: "Which form select does it belong to?",
      type: "string",
      description: '"Interest/Holding" is the first question on both forms, "Budget/Timeline" is the follow-up. All rows with the same group provide the dropdown choices for one select.',
      options: {
        list: [
          { title: "Interest / Holding", value: "holding" },
          { title: "Budget / Timeline", value: "budget" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Order on the form",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "active",
      title: "Show on the website",
      type: "boolean",
      description: "Turn off to temporarily hide this choice.",
      initialValue: true,
    }),
  ],
  orderings: [{ title: "Form position", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "label", group: "group" }, prepare: ({ title, group }) => ({ title, subtitle: group }) },
});