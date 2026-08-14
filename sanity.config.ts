import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./sanity/schemaTypes";
import { structure, SINGLETON_IDS } from "./sanity/structure";
import { projectId, dataset, apiVersion } from "./sanity/env";

export default defineConfig({
  name: "josh-properties",
  title: "Josh Properties",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Pinned singletons (siteSettings, homePage, contactPage) are content the
    // whole site depends on to render at all — don't let editors delete,
    // duplicate or unpublish them from the Studio UI. Only publishing and
    // discarding in-progress changes stay available.
    actions: (prev, context) =>
      context.documentId && SINGLETON_IDS.has(context.documentId)
        ? prev.filter(({ action }) => action && ["publish", "discardChanges"].includes(action))
        : prev,
  },
});
