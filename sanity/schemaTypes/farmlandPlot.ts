import { defineField, defineType } from "sanity";

export default defineType({
  name: "farmlandPlot",
  title: "Farmland plot",
  type: "document",
  description:
    "One plot card drawn on a project masterplan. Position it with the X and Y co-ordinates (0-100), give it a short map code, and mark its status.",
  fields: [
    defineField({
      name: "project",
      title: "Belongs to project",
      type: "reference",
      to: [{ type: "farmlandProject" }],
      description: "Pick the project this plot belongs to.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "id", title: "Map code", type: "string", description: "Short code shown on the masterplan, e.g. \"A1\" or \"04\".", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Plot name (optional)", type: "string", description: "e.g. \"Riverfront A1\". Falls back to the map code." }),
    defineField({ name: "size", title: "Size", type: "string", description: "e.g. \"2.4 acres\"", validation: (r) => r.required() }),
    defineField({ name: "phase", title: "Phase", type: "number", description: "1 or 2", validation: (r) => r.required().min(1).max(2) }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Available", "Reserved", "Sold"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "x", title: "Position X (0-100)", type: "number", description: "Left-to-right position on the masterplan.", validation: (r) => r.required().min(0).max(90) }),
    defineField({ name: "y", title: "Position Y (0-100)", type: "number", description: "Top-to-bottom position on the masterplan.", validation: (r) => r.required().min(0).max(80) }),
    defineField({ name: "order", title: "Order on the masterplan", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Map order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", id: "id", size: "size", status: "status" }, prepare: ({ title, id, size, status }) => ({ title: title || id, subtitle: [id, size, status].filter(Boolean).join(" · ") }) },
});