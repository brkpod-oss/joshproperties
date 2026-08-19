import { defineField, defineType } from "sanity";

export default defineType({
  name: "farmlandProject",
  title: "Farmland project",
  type: "document",
  description:
    "One project = one masterplan on the Farmlands page (e.g. \"The River Plate\"). Create the project first, then add its plots. The project whose page preview is enabled shows on the website; you can keep several drafts with Show disabled.",
  fields: [
    defineField({ name: "name", title: "Project name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string", description: "e.g. \"Shankarpally, RR District\"", validation: (r) => r.required() }),
    defineField({ name: "acres", title: "Total holding", type: "string", description: "e.g. \"28 acres\"", validation: (r) => r.required() }),
    defineField({ name: "river", title: "River passes through", type: "boolean", description: "Draws the water course on the masterplan.", initialValue: false }),
    defineField({ name: "note", title: "Note under the project name", type: "text", rows: 2, description: "One line, e.g. \"The river plate, surveyed 2025\"." }),
    defineField({ name: "image", title: "Aerial photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Order on the website", type: "number", description: "Lower numbers appear first.", initialValue: 0 }),
    defineField({ name: "published", title: "Show on the website", type: "boolean", description: "Turn off to hide a draft project.", initialValue: true }),
  ],
  orderings: [{ title: "Website order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", location: "location", acres: "acres", media: "image" }, prepare: ({ title, location, acres, media }) => ({ title, subtitle: [location, acres].filter(Boolean).join(" · "), media }) },
});