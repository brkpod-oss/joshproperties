# Sanity CMS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every piece of content and page copy on the Josh Properties site editable through an embedded Sanity Studio, with images in Sanity's asset pipeline and edits going live via webhook-triggered ISR.

**Architecture:** Sanity Studio embedded at `/studio` inside the existing Next.js App Router app. GROQ queries fetch content in Server Components, which pass plain data down as props to the existing (mostly client) presentational components — component internals don't change, only where their data comes from. A signed webhook from Sanity hits `/api/revalidate` on publish and calls `revalidateTag()` for the affected content type.

**Tech Stack:** `sanity` (Studio), `next-sanity` (client + Studio binding), `@sanity/image-url`, `@sanity/webhook` (signature verification), `vitest` (unit tests for pure logic — project has no existing test runner), `tsx` (run the one-off migration script).

## Global Constraints

- Sanity project ID `u8d6w2kb`, dataset `production` (already created, confirmed via Sanity management API)
- Credentials in `.env.local` (git-ignored, already present): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_TOKEN`
- Never commit `.env.local`; never log or print `SANITY_API_TOKEN` or `SANITY_REVALIDATE_SECRET` to stdout in any script
- Text fields are plain strings, not Portable Text (per design spec)
- Follow existing repo conventions: `"use client"` only on components using hooks/motion/events; `cn()` from `@/lib/utils` for class merging; Tailwind v4 tokens from `app/globals.css`, never raw hex
- After every task: `npm run lint` and `npx tsc --noEmit` must both pass clean before moving to the next task
- Design spec: `docs/superpowers/specs/2026-08-13-sanity-cms-design.md`

---

## Phase 1 — Sanity project scaffolding

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/webhook` as dependencies; `vitest`, `tsx` as devDependencies

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install sanity next-sanity @sanity/image-url @sanity/webhook
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D vitest tsx
```

- [ ] **Step 3: Add scripts to package.json**

Add to the `"scripts"` block in `package.json`:

```json
"test": "vitest run",
"migrate": "tsx scripts/migrate-to-sanity.ts"
```

- [ ] **Step 4: Verify install**

Run: `npm run lint`
Expected: passes clean (no new files reference the packages yet, this just confirms the install didn't break anything)

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Sanity, vitest and tsx dependencies"
```

---

### Task 2: Sanity env, client and image helpers

**Files:**
- Create: `sanity/env.ts`
- Create: `sanity/client.ts`
- Create: `sanity/image.ts`

**Interfaces:**
- Produces: `sanity/env.ts` exports `projectId: string`, `dataset: string`, `apiVersion: string`
- Produces: `sanity/client.ts` exports `client` (read, CDN-enabled) and `writeClient` (token-authenticated, no CDN, used only by the migration script and API routes)
- Produces: `sanity/image.ts` exports `urlFor(source: SanityImageSource): ImageUrlBuilder`

- [ ] **Step 1: Write sanity/env.ts**

```typescript
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing NEXT_PUBLIC_SANITY_DATASET"
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-13";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) throw new Error(errorMessage);
  return v;
}
```

- [ ] **Step 2: Write sanity/client.ts**

```typescript
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
```

- [ ] **Step 3: Write sanity/image.ts**

```typescript
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { projectId, dataset } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: passes clean

- [ ] **Step 5: Commit**

```bash
git add sanity/env.ts sanity/client.ts sanity/image.ts
git commit -m "feat: add Sanity client, env and image url helpers"
```

---

### Task 3: Studio config and embedded route

**Files:**
- Create: `sanity.config.ts`
- Create: `sanity/structure.ts`
- Create: `app/studio/[[...tool]]/page.tsx`
- Modify: `sanity/schemaTypes/index.ts` (empty schema array for now, filled in Task 4/5)

**Interfaces:**
- Consumes: `sanity/env.ts` (`projectId`, `dataset`, `apiVersion`)
- Produces: default export from `sanity.config.ts` (a `defineConfig()` result) consumed by the Studio page

- [ ] **Step 1: Write empty schema index**

```typescript
// sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
};
```

- [ ] **Step 2: Write Studio structure (singleton pinning)**

```typescript
// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = [
  { id: "siteSettings", title: "Site settings" },
  { id: "homePage", title: "Home page" },
  { id: "contactPage", title: "Contact page" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map(({ id, title }) =>
        S.listItem()
          .id(id)
          .title(title)
          .child(S.document().schemaType(id).documentId(id))
      ),
      S.divider(),
      S.documentTypeListItem("categoryPage").title("Category pages"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !SINGLETONS.some((s) => s.id === item.getId()) &&
          item.getId() !== "categoryPage"
      ),
    ]);
```

- [ ] **Step 3: Write sanity.config.ts**

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { projectId, dataset, apiVersion } from "./sanity/env";

export default defineConfig({
  name: "josh-properties",
  title: "Josh Properties",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
```

Note: `@sanity/vision` ships as part of the `sanity` package's plugin set — if `npm run build` (next step) reports it unresolved, run `npm install @sanity/vision` explicitly.

- [ ] **Step 4: Write the embedded Studio route**

```tsx
// app/studio/[[...tool]]/page.tsx
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 5: Verify Studio loads**

Run: `npm run dev` (background), then navigate to `http://localhost:3000/studio`
Expected: Studio UI loads with an empty content list (no document types yet — that's Task 4/5), no console errors

- [ ] **Step 6: Commit**

```bash
git add sanity.config.ts sanity/structure.ts sanity/schemaTypes/index.ts app/studio
git commit -m "feat: mount embedded Sanity Studio at /studio"
```

---

## Phase 2 — Schema

### Task 4: Collection schemas

**Files:**
- Create: `sanity/schemaTypes/property.ts`
- Create: `sanity/schemaTypes/farmlandOption.ts`
- Create: `sanity/schemaTypes/testimonial.ts`
- Create: `sanity/schemaTypes/faq.ts`
- Create: `sanity/schemaTypes/stat.ts`
- Create: `sanity/schemaTypes/service.ts`
- Create: `sanity/schemaTypes/processStep.ts`
- Create: `sanity/schemaTypes/partnerLogo.ts`
- Create: `sanity/schemaTypes/promiseItem.ts`
- Modify: `sanity/schemaTypes/index.ts`

**Interfaces:**
- Produces: 9 Sanity document type names — `property`, `farmlandOption`, `testimonial`, `faq`, `stat`, `service`, `processStep`, `partnerLogo`, `promiseItem` — each importable from its file as the default export, all registered in `schema.types`

- [ ] **Step 1: Write sanity/schemaTypes/property.ts**

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "folio", title: "Folio number", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["villa", "apartment", "farmland"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "location", title: "Location", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price", type: "string", validation: (r) => r.required() }),
    defineField({ name: "area", title: "Area", type: "string", validation: (r) => r.required() }),
    defineField({ name: "beds", title: "Beds (optional)", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Available", "Under Offer", "Sold"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "image", title: "Card / hero image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "short", title: "Short description", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "narrative",
      title: "Narrative paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({ name: "tall", title: "Tall card layout", type: "boolean", initialValue: false }),
    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "image" },
  },
});
```

- [ ] **Step 2: Write sanity/schemaTypes/farmlandOption.ts**

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "farmlandOption",
  title: "Farmland option",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "area", title: "Area (per plot)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Available", "Under Offer", "Limited"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "acres", title: "Holding note (e.g. total acres)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
  ],
  preview: { select: { title: "name", subtitle: "price", media: "image" } },
});
```

- [ ] **Step 3: Write sanity/schemaTypes/testimonial.ts**

```typescript
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
```

- [ ] **Step 4: Write sanity/schemaTypes/faq.ts**

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question" } },
});
```

- [ ] **Step 5: Write sanity/schemaTypes/stat.ts**

```typescript
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
```

- [ ] **Step 6: Write sanity/schemaTypes/service.ts**

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "numeral", title: "Numeral (I, II, III...)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Short description", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "href", title: "Link", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "href" } },
});
```

- [ ] **Step 7: Write sanity/schemaTypes/processStep.ts**

```typescript
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
```

- [ ] **Step 8: Write sanity/schemaTypes/partnerLogo.ts**

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "partnerLogo",
  title: "Ground / partner logo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "note", title: "Note", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "note" } },
});
```

- [ ] **Step 9: Write sanity/schemaTypes/promiseItem.ts**

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "promiseItem",
  title: "Promise (Why Josh section)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title" } },
});
```

- [ ] **Step 10: Register all 9 types in the schema index**

```typescript
// sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import property from "./property";
import farmlandOption from "./farmlandOption";
import testimonial from "./testimonial";
import faq from "./faq";
import stat from "./stat";
import service from "./service";
import processStep from "./processStep";
import partnerLogo from "./partnerLogo";
import promiseItem from "./promiseItem";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, farmlandOption, testimonial, faq, stat, service, processStep, partnerLogo, promiseItem],
};
```

- [ ] **Step 11: Verify in Studio**

Run: `npm run dev`, navigate to `http://localhost:3000/studio`
Expected: all 9 document types listed in the sidebar, each opens a working "create new" form with the fields above, no console errors

- [ ] **Step 12: Verify types**

Run: `npx tsc --noEmit`
Expected: passes clean

- [ ] **Step 13: Commit**

```bash
git add sanity/schemaTypes
git commit -m "feat: add Sanity collection schemas"
```

---

### Task 5: Singleton schemas + masterplan

**Files:**
- Create: `sanity/schemaTypes/siteSettings.ts`
- Create: `sanity/schemaTypes/homePage.ts`
- Create: `sanity/schemaTypes/categoryPage.ts`
- Create: `sanity/schemaTypes/contactPage.ts`
- Modify: `sanity/schemaTypes/index.ts`

**Interfaces:**
- Produces: 4 more document type names — `siteSettings`, `homePage`, `categoryPage`, `contactPage`

- [ ] **Step 1: Write sanity/schemaTypes/siteSettings.ts**

```typescript
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
```

- [ ] **Step 2: Write sanity/schemaTypes/homePage.ts**

```typescript
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
```

- [ ] **Step 3: Write sanity/schemaTypes/categoryPage.ts**

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "categoryPage",
  title: "Category page",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["villa", "apartment", "farmland"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "heroEyebrow", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroTitleLine1", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroTitleLine2", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroBody", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "listingKicker", type: "string", validation: (r) => r.required() }),
    defineField({ name: "listingHeading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "listingIntro", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "outlookHeading", title: "Outlook section heading (apartments only)", type: "string" }),
    defineField({ name: "outlookBody1", title: "Outlook section paragraph 1 (apartments only)", type: "text", rows: 3 }),
    defineField({ name: "outlookBody2", title: "Outlook section paragraph 2 (apartments only)", type: "text", rows: 3 }),
    defineField({
      name: "masterplan",
      title: "Masterplan (farmland only)",
      type: "object",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "river", type: "boolean", initialValue: false }),
        defineField({
          name: "plots",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "id", type: "string", validation: (r) => r.required() }),
                defineField({ name: "phase", type: "number", validation: (r) => r.required() }),
                defineField({ name: "size", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "status",
                  type: "string",
                  options: { list: ["Available", "Sold", "Reserved"] },
                  validation: (r) => r.required(),
                }),
                defineField({ name: "x", type: "number", validation: (r) => r.required() }),
                defineField({ name: "y", type: "number", validation: (r) => r.required() }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({ name: "masterplanKicker", type: "string" }),
    defineField({ name: "masterplanHeading", type: "string" }),
    defineField({ name: "masterplanBody", type: "text", rows: 2 }),
    defineField({ name: "holdingsKicker", type: "string" }),
    defineField({ name: "holdingsHeading", type: "string" }),
    defineField({ name: "holdingsNote", type: "string" }),
    defineField({ name: "dossierKicker", type: "string" }),
    defineField({ name: "dossierHeading", type: "string" }),
    defineField({ name: "dossierBody", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "category" } },
});
```

- [ ] **Step 4: Write sanity/schemaTypes/contactPage.ts**

```typescript
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
```

- [ ] **Step 5: Register the 4 new types, update index.ts**

```typescript
// sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import property from "./property";
import farmlandOption from "./farmlandOption";
import testimonial from "./testimonial";
import faq from "./faq";
import stat from "./stat";
import service from "./service";
import processStep from "./processStep";
import partnerLogo from "./partnerLogo";
import promiseItem from "./promiseItem";
import siteSettings from "./siteSettings";
import homePage from "./homePage";
import categoryPage from "./categoryPage";
import contactPage from "./contactPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    property,
    farmlandOption,
    testimonial,
    faq,
    stat,
    service,
    processStep,
    partnerLogo,
    promiseItem,
    siteSettings,
    homePage,
    categoryPage,
    contactPage,
  ],
};
```

- [ ] **Step 6: Verify in Studio**

Run: `npm run dev`, navigate to `http://localhost:3000/studio`
Expected: "Site settings", "Home page", "Contact page" appear as pinned singleton items (per `sanity/structure.ts` from Task 3); "Category pages" appears as a normal creatable list; all forms render without errors

- [ ] **Step 7: Verify types**

Run: `npx tsc --noEmit`
Expected: passes clean

- [ ] **Step 8: Commit**

```bash
git add sanity/schemaTypes
git commit -m "feat: add Sanity singleton page schemas"
```

---

## Phase 3 — Queries

### Task 6: GROQ queries and typed fetch functions

**Files:**
- Create: `sanity/queries.ts`

**Interfaces:**
- Produces: `getSiteSettings()`, `getHomePage()`, `getCategoryPage(category: "villa"|"apartment"|"farmland")`, `getContactPage()`, `getProperties()`, `getFeaturedProperties()`, `getPropertiesByCategory(category)`, `getProperty(slug: string)`, `getFarmlandOptions()`, `getTestimonials()`, `getFaqs()`, `getStats()`, `getServices()`, `getProcessSteps()`, `getPartnerLogos()`, `getPromiseItems()` — all `async`, all tag their `client.fetch` call with `{ next: { tags: [<type>] } }`

- [ ] **Step 1: Write sanity/queries.ts**

```typescript
import { client } from "./client";
import type { PortableTextBlock } from "sanity";

export type SanityImage = { asset: { _ref: string; _type: "reference" } };

export type Property = {
  slug: string;
  folio: string;
  title: string;
  category: "villa" | "apartment" | "farmland";
  location: string;
  price: string;
  area: string;
  beds?: string;
  status: "Available" | "Under Offer" | "Sold";
  image?: SanityImage;
  gallery?: SanityImage[];
  short: string;
  narrative: string[];
  specs: { label: string; value: string }[];
  tall?: boolean;
  featured?: boolean;
};

const propertyProjection = `{
  "slug": slug.current,
  folio, title, category, location, price, area, beds, status,
  image, gallery, short, narrative, specs, tall, featured
}`;

export async function getProperties(): Promise<Property[]> {
  return client.fetch(
    `*[_type == "property"] | order(folio asc) ${propertyProjection}`,
    {},
    { next: { tags: ["property"] } }
  );
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return client.fetch(
    `*[_type == "property" && featured == true] | order(folio asc) ${propertyProjection}`,
    {},
    { next: { tags: ["property"] } }
  );
}

export async function getPropertiesByCategory(category: string): Promise<Property[]> {
  return client.fetch(
    `*[_type == "property" && category == $category] | order(folio asc) ${propertyProjection}`,
    { category },
    { next: { tags: ["property"] } }
  );
}

export async function getProperty(slug: string): Promise<Property | null> {
  return client.fetch(
    `*[_type == "property" && slug.current == $slug][0] ${propertyProjection}`,
    { slug },
    { next: { tags: ["property"] } }
  );
}

export async function getPropertySlugs(): Promise<string[]> {
  return client.fetch(`*[_type == "property"].slug.current`, {}, { next: { tags: ["property"] } });
}

export type FarmlandOption = {
  slug: string;
  name: string;
  area: string;
  price: string;
  status: "Available" | "Under Offer" | "Limited";
  acres: string;
  image?: SanityImage;
};

export async function getFarmlandOptions(): Promise<FarmlandOption[]> {
  return client.fetch(
    `*[_type == "farmlandOption"]{"slug": slug.current, name, area, price, status, acres, image}`,
    {},
    { next: { tags: ["farmlandOption"] } }
  );
}

export type Testimonial = { quote: string; name: string; context: string; project: string; featured?: boolean };

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(
    `*[_type == "testimonial"]{quote, name, context, project, featured}`,
    {},
    { next: { tags: ["testimonial"] } }
  );
}

export type Faq = { question: string; answer: string };

export async function getFaqs(): Promise<Faq[]> {
  return client.fetch(
    `*[_type == "faq"] | order(order asc) {question, answer}`,
    {},
    { next: { tags: ["faq"] } }
  );
}

export type Stat = { value: number; suffix?: string; prefix?: string; label: string; numeral: string };

export async function getStats(): Promise<Stat[]> {
  return client.fetch(
    `*[_type == "stat"] | order(order asc) {value, suffix, prefix, label, numeral}`,
    {},
    { next: { tags: ["stat"] } }
  );
}

export type Service = { slug: string; numeral: string; name: string; description: string; detail: string; href: string };

export async function getServices(): Promise<Service[]> {
  return client.fetch(
    `*[_type == "service"] | order(order asc) {"slug": slug.current, numeral, name, description, detail, href}`,
    {},
    { next: { tags: ["service"] } }
  );
}

export type ProcessStep = { step: string; title: string; week: string; description: string };

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return client.fetch(
    `*[_type == "processStep"] | order(order asc) {step, title, week, description}`,
    {},
    { next: { tags: ["processStep"] } }
  );
}

export type PartnerLogo = { name: string; note: string };

export async function getPartnerLogos(): Promise<PartnerLogo[]> {
  return client.fetch(
    `*[_type == "partnerLogo"] | order(order asc) {name, note}`,
    {},
    { next: { tags: ["partnerLogo"] } }
  );
}

export type PromiseItem = { title: string; body: string };

export async function getPromiseItems(): Promise<PromiseItem[]> {
  return client.fetch(
    `*[_type == "promiseItem"] | order(order asc) {title, body}`,
    {},
    { next: { tags: ["promiseItem"] } }
  );
}

export type SiteSettings = {
  name: string; legalName: string; logo?: SanityImage; city: string; state: string;
  phone: string; phoneHref: string; whatsapp: string; email: string; address: string;
  hours: string; tagline: string; position: string; heroVideo: string;
  navLinks: { label: string; href: string }[];
  footerExploreLinks: { label: string; href: string }[];
  footerGroundsLinks: string[];
  footerBlurb: string;
  rera: { registeredUnder: string; number: string; note: string };
  enquireLabel: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return client.fetch(`*[_type == "siteSettings"][0]`, {}, { next: { tags: ["siteSettings"] } });
}

export type HomePage = {
  hero: {
    kicker: string; place: string; words: string[]; titleLine1: string; titleLine2: string;
    verificationNote: string; brandLine: string; brandSub: string; ctaLabel: string;
  };
  stats: { label: string; folioLabel: string; footerNote: string; eoe: string };
  featured: { heading: string; body: string };
  offerings: { heading: string; body: string };
  story: {
    image?: SanityImage; imageCaption: string; folioLabel: string; verifiedLabel: string;
    headingPlain: string; headingItalic: string; pullQuote: string; bodyParagraphs: string[];
    signoffName: string; signoffTitle: string;
  };
  farmlandBand: { heading: string; ctaLabel: string; grounds: { name: string; note: string; image?: SanityImage }[] };
  whyJosh: { heading: string };
  process: { kicker: string; heading: string; intro: string };
  faqSection: { heading: string };
  finalCta: {
    image?: SanityImage; headingPlain: string; headingEmphasis: string; body: string;
    ctaEnquireLabel: string; ctaWhatsappLabel: string; founded: string; byAppointment: string;
  };
};

export async function getHomePage(): Promise<HomePage> {
  return client.fetch(`*[_type == "homePage"][0]`, {}, { next: { tags: ["homePage"] } });
}

export type CategoryPage = {
  category: "villa" | "apartment" | "farmland";
  heroEyebrow: string; heroTitleLine1: string; heroTitleLine2: string; heroBody: string;
  listingKicker: string; listingHeading: string; listingIntro: string;
  masterplan?: {
    name: string; river: boolean;
    plots: { id: string; phase: number; size: string; status: "Available" | "Sold" | "Reserved"; x: number; y: number }[];
  };
  masterplanKicker?: string; masterplanHeading?: string; masterplanBody?: string;
  holdingsKicker?: string; holdingsHeading?: string; holdingsNote?: string;
  dossierKicker?: string; dossierHeading?: string; dossierBody?: string;
};

export async function getCategoryPage(category: string): Promise<CategoryPage> {
  return client.fetch(
    `*[_type == "categoryPage" && category == $category][0]`,
    { category },
    { next: { tags: ["categoryPage"] } }
  );
}

export type ContactPage = {
  kicker: string; heading: string; body: string; concierceHeading: string;
  emailNote: string; officeHeading: string; officeNote: string;
};

export async function getContactPage(): Promise<ContactPage> {
  return client.fetch(`*[_type == "contactPage"][0]`, {}, { next: { tags: ["contactPage"] } });
}
```

Note: the `PortableTextBlock` import is unused (no Portable Text fields per the design decision) — remove it before committing; it's listed here only as a reminder not to reach for it later.

- [ ] **Step 2: Fix the unused import and verify types**

Remove the `import type { PortableTextBlock } from "sanity";` line.
Run: `npx tsc --noEmit`
Expected: passes clean

- [ ] **Step 3: Commit**

```bash
git add sanity/queries.ts
git commit -m "feat: add typed GROQ queries for all content types"
```

---

## Phase 4 — Migration

### Task 7: Pure mapping functions + tests

**Files:**
- Create: `scripts/mapToSanityDocs.ts`
- Create: `scripts/mapToSanityDocs.test.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Consumes: existing `data/properties.ts`, `data/farmland.ts`, `data/testimonials.ts`, `data/faqs.ts`, `data/stats.ts`, `data/services.ts`, `data/process.ts`, `data/partners.ts`, `data/promises.ts` (still present at this point — deleted only in Task 21)
- Produces: `mapProperty(p: Property, imageRefs: ImageRefMap): SanityDoc`, `mapFarmlandOption(f: FarmlandOption, imageRefs: ImageRefMap): SanityDoc`, and similarly-named pure mappers for testimonials/faqs/stats/services/processSteps/partners/promises — all pure functions (no I/O), each returning a plain object with a deterministic `_id` (so re-running migration is idempotent via `createOrReplace`)
- `ImageRefMap = Record<string, { _type: "image"; asset: { _type: "reference"; _ref: string } }>` — keyed by the local image path (e.g. `/images/villa-01.jpg`)

- [ ] **Step 1: Write vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 2: Write the failing test file**

```typescript
// scripts/mapToSanityDocs.test.ts
import { describe, expect, it } from "vitest";
import { mapProperty, mapFaq, slugify } from "./mapToSanityDocs";
import type { Property } from "@/data/properties";

describe("slugify", () => {
  it("keeps an already-clean slug as the document id suffix", () => {
    expect(slugify("jubilee-house")).toBe("jubilee-house");
  });
});

describe("mapProperty", () => {
  const property: Property = {
    slug: "jubilee-house",
    folio: "001",
    title: "The Jubilee House",
    category: "villa",
    location: "Jubilee Hills, Hyderabad",
    price: "₹12.5 Cr",
    area: "8,400 sq.ft",
    beds: "5 BHK",
    status: "Available",
    seed: "josh-jubilee-house",
    image: "/images/villa-02.jpg",
    gallery: ["/images/villa-01.jpg", "/images/villa-02.jpg"],
    tall: true,
    featured: true,
    short: "A five-bedroom villa.",
    narrative: ["Paragraph one.", "Paragraph two."],
    specs: [{ label: "Built-up", value: "8,400 sq.ft" }],
  };

  const imageRefs = {
    "/images/villa-01.jpg": { _type: "image" as const, asset: { _type: "reference" as const, _ref: "image-a" } },
    "/images/villa-02.jpg": { _type: "image" as const, asset: { _type: "reference" as const, _ref: "image-b" } },
  };

  it("produces a deterministic document id from the slug", () => {
    const doc = mapProperty(property, imageRefs);
    expect(doc._id).toBe("property-jubilee-house");
    expect(doc._type).toBe("property");
  });

  it("carries over every scalar field unchanged", () => {
    const doc = mapProperty(property, imageRefs);
    expect(doc.title).toBe("The Jubilee House");
    expect(doc.folio).toBe("001");
    expect(doc.category).toBe("villa");
    expect(doc.beds).toBe("5 BHK");
    expect(doc.short).toBe("A five-bedroom villa.");
    expect(doc.narrative).toEqual(["Paragraph one.", "Paragraph two."]);
    expect(doc.specs).toEqual([{ label: "Built-up", value: "8,400 sq.ft" }]);
    expect(doc.tall).toBe(true);
    expect(doc.featured).toBe(true);
  });

  it("resolves the image and gallery fields to Sanity image references", () => {
    const doc = mapProperty(property, imageRefs);
    expect(doc.image).toEqual(imageRefs["/images/villa-02.jpg"]);
    expect(doc.gallery).toEqual([imageRefs["/images/villa-01.jpg"], imageRefs["/images/villa-02.jpg"]]);
  });

  it("omits the image field when the property has none", () => {
    const { image, ...rest } = property;
    void image;
    const doc = mapProperty({ ...rest, image: undefined }, imageRefs);
    expect(doc.image).toBeUndefined();
  });
});

describe("mapFaq", () => {
  it("assigns order from the array index", () => {
    const doc = mapFaq({ question: "Q1?", answer: "A1." }, 2);
    expect(doc._id).toBe("faq-2");
    expect(doc.order).toBe(2);
    expect(doc.question).toBe("Q1?");
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `scripts/mapToSanityDocs.ts` does not exist yet

- [ ] **Step 4: Write scripts/mapToSanityDocs.ts**

```typescript
import type { Property } from "@/data/properties";
import type { FarmlandOption } from "@/data/farmland";
import type { Testimonial } from "@/data/testimonials";
import type { Faq } from "@/data/faqs";
import type { Stat } from "@/data/stats";
import type { Service } from "@/data/services";
import type { ProcessStep } from "@/data/process";
import type { PromiseItem } from "@/data/promises";

export type SanityImageRef = { _type: "image"; asset: { _type: "reference"; _ref: string } };
export type ImageRefMap = Record<string, SanityImageRef>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function mapProperty(p: Property, imageRefs: ImageRefMap) {
  return {
    _id: `property-${slugify(p.slug)}`,
    _type: "property",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    folio: p.folio,
    category: p.category,
    location: p.location,
    price: p.price,
    area: p.area,
    beds: p.beds,
    status: p.status,
    image: p.image ? imageRefs[p.image] : undefined,
    gallery: p.gallery?.map((src) => imageRefs[src]),
    short: p.short,
    narrative: p.narrative,
    specs: p.specs,
    tall: p.tall ?? false,
    featured: p.featured ?? false,
  };
}

export function mapFarmlandOption(f: FarmlandOption, imageRefs: ImageRefMap) {
  return {
    _id: `farmlandOption-${slugify(f.slug)}`,
    _type: "farmlandOption",
    name: f.name,
    slug: { _type: "slug", current: f.slug },
    area: f.area,
    price: f.price,
    status: f.status,
    acres: f.acres,
    image: imageRefs[`/images/farmland-${slugify(f.slug)}.jpg`],
  };
}

export function mapTestimonial(t: Testimonial, index: number) {
  return {
    _id: `testimonial-${index}`,
    _type: "testimonial",
    quote: t.quote,
    name: t.name,
    context: t.context,
    project: t.project,
    featured: t.featured ?? false,
  };
}

export function mapFaq(f: Faq, index: number) {
  return {
    _id: `faq-${index}`,
    _type: "faq",
    question: f.question,
    answer: f.answer,
    order: index,
  };
}

export function mapStat(s: Stat, index: number) {
  return {
    _id: `stat-${index}`,
    _type: "stat",
    value: s.value,
    suffix: s.suffix,
    prefix: s.prefix,
    label: s.label,
    numeral: s.numeral,
    order: index,
  };
}

export function mapService(s: Service, index: number) {
  return {
    _id: `service-${slugify(s.slug)}`,
    _type: "service",
    slug: { _type: "slug", current: s.slug },
    numeral: s.numeral,
    name: s.name,
    description: s.description,
    detail: s.detail,
    href: s.href,
    order: index,
  };
}

export function mapProcessStep(s: ProcessStep, index: number) {
  return {
    _id: `processStep-${index}`,
    _type: "processStep",
    step: s.step,
    title: s.title,
    week: s.week,
    description: s.description,
    order: index,
  };
}

export function mapPartnerLogo(p: { name: string; note: string }, index: number) {
  return {
    _id: `partnerLogo-${index}`,
    _type: "partnerLogo",
    name: p.name,
    note: p.note,
    order: index,
  };
}

export function mapPromiseItem(p: PromiseItem, index: number) {
  return {
    _id: `promiseItem-${index}`,
    _type: "promiseItem",
    title: p.title,
    body: p.body,
    order: index,
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS, all 6 assertions across `slugify`, `mapProperty`, `mapFaq`

- [ ] **Step 6: Commit**

```bash
git add scripts/mapToSanityDocs.ts scripts/mapToSanityDocs.test.ts vitest.config.ts
git commit -m "feat: add pure Sanity document mapping functions with tests"
```

---

### Task 8: Image upload + document creation + CLI runner

**Files:**
- Create: `scripts/migrate-to-sanity.ts`

**Interfaces:**
- Consumes: `writeClient` from `sanity/client.ts`, all `map*` functions from `scripts/mapToSanityDocs.ts`, all `data/*.ts` arrays, `lib/site.ts`
- Side effect: uploads every file in `public/images/` as a Sanity asset, `createOrReplace`s one document per array item across all 8 collection types

- [ ] **Step 1: Write scripts/migrate-to-sanity.ts**

```typescript
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { writeClient } from "../sanity/client";
import {
  mapProperty, mapFarmlandOption, mapTestimonial, mapFaq, mapStat,
  mapService, mapProcessStep, mapPartnerLogo, mapPromiseItem,
  type ImageRefMap,
} from "./mapToSanityDocs";
import { properties } from "../data/properties";
import { farmlandOptions } from "../data/farmland";
import { testimonials } from "../data/testimonials";
import { faqs } from "../data/faqs";
import { stats } from "../data/stats";
import { services } from "../data/services";
import { processSteps } from "../data/process";
import { partnerLogos } from "../data/partners";
import { promises as promiseItems } from "../data/promises";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

async function uploadAllImages(): Promise<ImageRefMap> {
  const files = await readdir(IMAGES_DIR);
  const refs: ImageRefMap = {};
  for (const file of files) {
    const buffer = await readFile(path.join(IMAGES_DIR, file));
    const asset = await writeClient.assets.upload("image", buffer, { filename: file });
    refs[`/images/${file}`] = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    console.log(`uploaded ${file} -> ${asset._id}`);
  }
  return refs;
}

async function main() {
  console.log("Uploading images...");
  const imageRefs = await uploadAllImages();

  console.log("Creating property documents...");
  for (const p of properties) {
    await writeClient.createOrReplace(mapProperty(p, imageRefs));
  }

  console.log("Creating farmlandOption documents...");
  for (const f of farmlandOptions) {
    await writeClient.createOrReplace(mapFarmlandOption(f, imageRefs));
  }

  console.log("Creating testimonial documents...");
  for (const [i, t] of testimonials.entries()) {
    await writeClient.createOrReplace(mapTestimonial(t, i));
  }

  console.log("Creating faq documents...");
  for (const [i, f] of faqs.entries()) {
    await writeClient.createOrReplace(mapFaq(f, i));
  }

  console.log("Creating stat documents...");
  for (const [i, s] of stats.entries()) {
    await writeClient.createOrReplace(mapStat(s, i));
  }

  console.log("Creating service documents...");
  for (const [i, s] of services.entries()) {
    await writeClient.createOrReplace(mapService(s, i));
  }

  console.log("Creating processStep documents...");
  for (const [i, s] of processSteps.entries()) {
    await writeClient.createOrReplace(mapProcessStep(s, i));
  }

  console.log("Creating partnerLogo documents...");
  for (const [i, p] of partnerLogos.entries()) {
    await writeClient.createOrReplace(mapPartnerLogo(p, i));
  }

  console.log("Creating promiseItem documents...");
  for (const [i, p] of promiseItems.entries()) {
    await writeClient.createOrReplace(mapPromiseItem(p, i));
  }

  console.log(`\nDone. ${properties.length} properties, ${farmlandOptions.length} farmland options, ` +
    `${testimonials.length} testimonials, ${faqs.length} FAQs, ${stats.length} stats, ` +
    `${services.length} services, ${processSteps.length} process steps, ` +
    `${partnerLogos.length} partner logos, ${promiseItems.length} promise items created. ` +
    `Verify in Studio at /studio before continuing.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Check data/partners.ts shape matches mapPartnerLogo's expected input**

Read `data/partners.ts` — confirm it exports `partnerLogos: { name: string; note: string }[]`. If the field names differ, adjust `mapPartnerLogo`'s parameter destructuring in Task 7 to match (this file wasn't read during planning; verify before running).

- [ ] **Step 3: Run the migration**

Run: `npm run migrate`
Expected: console logs one line per uploaded image, one "Creating ... documents" line per collection, ending in the "Done." summary line with correct counts (9 properties, 4 farmland options, 4 testimonials, 7 FAQs, 4 stats, 4 services, 5 process steps, count of partner logos, 5 promise items — verify these match the actual current array lengths in `data/*.ts`)

- [ ] **Step 4: Verify in Studio**

Navigate to `http://localhost:3000/studio`, open a few documents of each type (at least one `property`, the `farmlandOption` list, `faq` list). Confirm images render, text matches the source data, no documents are missing fields.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-to-sanity.ts
git commit -m "feat: add Sanity migration script for collection data"
```

---

### Task 9: Migrate hardcoded page copy (siteSettings, homePage, categoryPage ×3, contactPage)

**Files:**
- Modify: `scripts/migrate-to-sanity.ts`

**Interfaces:**
- Consumes: `lib/site.ts` (`site` object), the literal strings currently hardcoded in `Navbar.tsx`, `Footer.tsx`, `CinematicHero.tsx`, `Stats.tsx`, `Featured.tsx`, `Offerings.tsx`, `Story.tsx`, `FarmlandBand.tsx`, `WhyJosh.tsx`, `Process.tsx`, `Faq.tsx`, `FinalCta.tsx`, `app/villas/page.tsx`, `app/apartments/page.tsx`, `app/farmlands/page.tsx`, `app/contact/page.tsx`, `data/farmland.ts` (`masterplan`)
- Produces: one `createOrReplace` call each for `siteSettings` (id `siteSettings`), `homePage` (id `homePage`), `contactPage` (id `contactPage`), and three `categoryPage` documents (ids `categoryPage-villa`, `categoryPage-apartment`, `categoryPage-farmland`)

- [ ] **Step 1: Add the singleton migration function to scripts/migrate-to-sanity.ts**

Add this function (values transcribed verbatim from the current hardcoded component copy) and call it from `main()` before the "Done." log line:

```typescript
async function migrateSingletons(imageRefs: ImageRefMap) {
  console.log("Creating siteSettings...");
  await writeClient.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: "Josh Properties",
    legalName: "Josh Properties LLP",
    city: "Hyderabad",
    state: "Telangana",
    phone: "+91 90000 00000",
    phoneHref: "tel:+919000000000",
    whatsapp: "https://wa.me/919000000000",
    email: "concierge@joshproperties.in",
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana 500034",
    hours: "By appointment · Mon–Sat, 10:00–19:00",
    tagline: "Curators of Hyderabad's finest villas, apartments and farmlands.",
    position:
      "Josh Properties is a private real-estate advisory curating villas, apartments and cleared-title farmland across Hyderabad and Telangana, with verified titles, drone surveys and a single concierge from first call to registration.",
    heroVideo: "/hero.mp4",
    navLinks: [
      { label: "Villas", href: "/villas" },
      { label: "Apartments", href: "/apartments" },
      { label: "Farmlands", href: "/farmlands" },
      { label: "The Collection", href: "#collection" },
    ],
    footerExploreLinks: [
      { label: "Villas", href: "/villas" },
      { label: "Apartments", href: "/apartments" },
      { label: "Farmlands", href: "/farmlands" },
      { label: "The Collection", href: "#collection" },
      { label: "Enquire", href: "/contact" },
    ],
    footerGroundsLinks: ["Jubilee Hills", "Kokapet", "Gachibowli", "Shankarpally", "Chevella"],
    footerBlurb:
      "Private real-estate advisory · Hyderabad · Est. 2017. Villas, apartments and farmland with verified titles and a single concierge from first call to registration.",
    rera: {
      registeredUnder: "Real Estate (Regulation and Development) Act, 2016",
      number: "P02400005461",
      note: "Counsel present at every close, from token to sub-registrar.",
    },
    enquireLabel: "Enquire privately",
  });

  console.log("Creating homePage...");
  await writeClient.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    hero: {
      kicker: "Private real estate advisory",
      place: "Hyderabad",
      words: ["CURATED.", "VERIFIED.", "PRIVATE."],
      titleLine1: "THE TITLE",
      titleLine2: "COMES FIRST.",
      verificationNote: "EVERY PROPERTY. INDEPENDENTLY VERIFIED.",
      brandLine: "JOSH PROPERTIES",
      brandSub: "Hyderabad · Est. 2017",
      ctaLabel: "View the Collection",
    },
    stats: {
      label: "Title register · Select entries",
      folioLabel: "Folio I–IV",
      footerNote: "Internal register, verified by counsel",
      eoe: "E. & O.E.",
    },
    featured: {
      heading: "Three properties, none of them in a rush.",
      body: "We hold a deliberately short list. When a property is right, we show it once, with the full title chain on the table.",
    },
    offerings: {
      heading: "Three kinds of quiet.",
      body: "Villas, apartments and cleared-title farmland. Each holding is shown once, by appointment, with its audit on the table.",
    },
    story: {
      image: imageRefs["/images/story.jpg"],
      imageCaption: "Surveyed plot, Chevella",
      folioLabel: "Folio 001 · Title chain",
      verifiedLabel: "Verified by counsel",
      headingPlain: "We sell the title.",
      headingItalic: "The land is a bonus.",
      pullQuote: "A clear chain of title is the only luxury that compounds.",
      bodyParagraphs: [
        "Josh Properties began in 2017 when a family friend bought a villa with a clouded title and lost it to a dispute. That single mistake became our method: every property is title-audited by independent counsel, surveyed by drone, and shown with the audit in hand, before any price is discussed.",
        "Nine years on, we have closed a little over four thousand plots and homes. We are still deliberately small, still by appointment, and still of the opinion that the best advice we can give you is sometimes not to buy.",
      ],
      signoffName: "JOSH",
      signoffTitle: "Principal, Josh Properties",
    },
    farmlandBand: {
      heading: "Over 1,200 acres, flown and surveyed.",
      ctaLabel: "Explore the land",
      grounds: [
        { name: "Shankarpally", note: "Green belt", image: imageRefs["/images/farmland-shankarpally.jpg"] },
        { name: "Moinabad", note: "Lake country", image: imageRefs["/images/farmland-moinabad.jpg"] },
        { name: "Chevella", note: "River plots", image: imageRefs["/images/farmland-chevella.jpg"] },
        { name: "Wyra", note: "Full holding", image: imageRefs["/images/farmland-wyra.jpg"] },
        { name: "Medchal", note: "Farmhouses", image: imageRefs["/images/farmland-medchal.jpg"] },
      ],
    },
    whyJosh: { heading: "Why Hyderabad's quietest buyers deal with us." },
    process: {
      kicker: "The method",
      heading: "A clear chain of title is the only luxury that compounds.",
      intro: "Five steps, in writing. Counsel is present from the first call to the sub-registrar.",
    },
    faqSection: { heading: "The questions every Hyderabad buyer asks." },
    finalCta: {
      image: imageRefs["/images/villa-06.jpg"],
      headingPlain: "Every great purchase begins with a ",
      headingEmphasis: "private call.",
      body: "Tell us what you are looking for and where. If we can serve it, a viewing is scheduled within the week, and the dossier stays yours, whether you buy or not.",
      ctaEnquireLabel: "Enquire privately",
      ctaWhatsappLabel: "WhatsApp the concierge",
      founded: "Est. 2017",
      byAppointment: "By appointment only",
    },
  });

  console.log("Creating categoryPage documents...");
  await writeClient.createOrReplace({
    _id: "categoryPage-villa",
    _type: "categoryPage",
    category: "villa",
    heroEyebrow: "The villas",
    heroTitleLine1: "Houses on quiet,",
    heroTitleLine2: "tree-lined plots.",
    heroBody: "A short list of freehold homes where the garden is the luxury and the title is verified before we ever talk money.",
    listingKicker: "Freehold villas",
    listingHeading: "Three houses, none of them hurried.",
    listingIntro: "Every villa is shown once, with its chain-of-title audit on the table. If you are not ready to buy, we say so.",
  });

  await writeClient.createOrReplace({
    _id: "categoryPage-apartment",
    _type: "categoryPage",
    category: "apartment",
    heroEyebrow: "The apartments",
    heroTitleLine1: "Altitudes made",
    heroTitleLine2: "private.",
    heroBody: "Penthouses and residences where the skyline does the decorating, by night and by day.",
    listingKicker: "Curated residences",
    listingHeading: "A short list of sharp towers.",
    listingIntro: "From a double-height penthouse to a park-front three-bed, each one held because we would live in it.",
    outlookHeading: "The outlook is half the property.",
    outlookBody1: "We choose apartments for what they face as much as what they contain. Light angles, corridor silence, and the quality of the skyline after dark. Drag the study above to see how a south tower behaves from noon to night.",
    outlookBody2: "Each residence is shown with its full chain of title and a line-itemed price: the same number on the offer letter is the number on the sale deed.",
  });

  await writeClient.createOrReplace({
    _id: "categoryPage-farmland",
    _type: "categoryPage",
    category: "farmland",
    heroEyebrow: "The farmlands",
    heroTitleLine1: "Land you can",
    heroTitleLine2: "stand on, and prove.",
    heroBody: "Over 1,200 acres across Shankarpally, Moinabad, Chevella and Wyra, every holding flown by drone and title-audited before it is offered.",
    listingKicker: "The farmlands",
    listingHeading: "Cleared-title land, surveyed by drone.",
    listingIntro: "Every holding flown by drone and title-audited before it is offered.",
    masterplan: {
      name: "Chevella River Plate · Masterplan",
      river: true,
      plots: [
        { id: "A", phase: 1, x: 8, y: 12, status: "Available", size: "5 ac" },
        { id: "B", phase: 1, x: 30, y: 8, status: "Sold", size: "5 ac" },
        { id: "C", phase: 1, x: 52, y: 16, status: "Available", size: "6 ac" },
        { id: "D", phase: 1, x: 74, y: 10, status: "Reserved", size: "5 ac" },
        { id: "E", phase: 1, x: 10, y: 46, status: "Sold", size: "4.8 ac" },
        { id: "F", phase: 1, x: 34, y: 40, status: "Available", size: "4.8 ac" },
        { id: "G", phase: 2, x: 56, y: 50, status: "Available", size: "5 ac" },
        { id: "H", phase: 2, x: 78, y: 44, status: "Sold", size: "6 ac" },
        { id: "I", phase: 2, x: 22, y: 76, status: "Available", size: "5 ac" },
        { id: "J", phase: 2, x: 46, y: 82, status: "Reserved", size: "4.8 ac" },
        { id: "K", phase: 2, x: 70, y: 78, status: "Available", size: "5 ac" },
      ],
    },
    masterplanKicker: "The masterplan",
    masterplanHeading: "Surveyed by drone, offered by plot.",
    masterplanBody: "The Chevella River Plate is our current masterplan. Hover the map to read each holding: every boundary has been walked and marked by survey, and every title cleared before a rupee changes hands.",
    holdingsKicker: "Available grounds",
    holdingsHeading: "Four holdings, open today.",
    holdingsNote: "Priced by the acre, line by line, no coordination charges, ever",
    dossierKicker: "Request the dossier",
    dossierHeading: "The numbers are private. So is the drone pass.",
    dossierBody: "Each dossier holds the drone stills and flight, the revenue survey, chain of title, soil and water notes, and a line-itemed offer. It is sent only to you, never to a list.",
  });

  console.log("Creating contactPage...");
  await writeClient.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    kicker: "Start here",
    heading: "A conversation, not a sales call.",
    body: "Tell us what you are looking for and where. Within two working days a concierge, the same person who will sit beside you at registration, calls to arrange a private viewing.",
    concierceHeading: "The concierge line",
    emailNote: "Replies within two working days",
    officeHeading: "The office",
    officeNote: "Visits strictly by appointment",
  });
}
```

Note: `imageRefs["/images/story.jpg"]`, `farmland-shankarpally.jpg`, etc. reference filenames that don't exist in `public/images/` today (the current site uses picsum placeholders for these). Either add matching real files to `public/images/` before running the migration, or leave these `image` fields `undefined` for now (the `SanityImage | undefined` types in `sanity/queries.ts` already allow this) and upload them later directly through Studio — do not block the migration on sourcing new photography.

- [ ] **Step 2: Call migrateSingletons from main()**

In `scripts/migrate-to-sanity.ts`, add `await migrateSingletons(imageRefs);` inside `main()`, right after the `promiseItem` loop and before the final `console.log("\nDone. ...")` line.

- [ ] **Step 3: Run the migration again**

Run: `npm run migrate`
Expected: same output as Task 8 plus new lines for siteSettings, homePage, 3 categoryPage docs, contactPage — safe to re-run since every `_id` is deterministic and `createOrReplace` is used throughout

- [ ] **Step 4: Verify in Studio**

Open `siteSettings`, `homePage`, each `categoryPage`, and `contactPage` in Studio. Confirm every field matches the current live site's copy exactly (cross-check a few against the running `npm run dev` site).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-to-sanity.ts
git commit -m "feat: migrate hardcoded page copy into Sanity singletons"
```

---

## Phase 5 — Component refactor

### Task 10: next.config.ts image domain + revalidate webhook

**Files:**
- Modify: `next.config.ts`
- Create: `app/api/revalidate/route.ts`
- Create: `app/api/revalidate/route.test.ts`

**Interfaces:**
- Produces: `getTagsForType(type: string): string[]` (pure, exported for testing), `POST` route handler

- [ ] **Step 1: Add Sanity's CDN to next.config.ts remotePatterns**

```typescript
// next.config.ts — add to images.remotePatterns array
{
  protocol: "https",
  hostname: "cdn.sanity.io",
},
```

- [ ] **Step 2: Write the failing test for getTagsForType**

```typescript
// app/api/revalidate/route.test.ts
import { describe, expect, it } from "vitest";
import { getTagsForType } from "./route";

describe("getTagsForType", () => {
  it("maps a known document type to its own tag", () => {
    expect(getTagsForType("property")).toEqual(["property"]);
  });

  it("returns an empty array for an unknown type", () => {
    expect(getTagsForType("somethingElse")).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `app/api/revalidate/route.ts` does not exist yet

- [ ] **Step 4: Write app/api/revalidate/route.ts**

```typescript
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export function getTagsForType(type: string): string[] {
  const knownTypes = [
    "property", "farmlandOption", "testimonial", "faq", "stat", "service",
    "processStep", "partnerLogo", "promiseItem", "siteSettings", "homePage",
    "categoryPage", "contactPage",
  ];
  return knownTypes.includes(type) ? [type] : [];
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || !signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body) as { _type?: string };
  if (!payload._type) {
    return NextResponse.json({ message: "No _type in payload" }, { status: 400 });
  }

  const tags = getTagsForType(payload._type);
  tags.forEach((tag) => revalidateTag(tag));

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Add SANITY_REVALIDATE_SECRET to .env.local**

Generate a random secret and append it (do not print the value in chat/logs beyond this local step):

```bash
node -e "console.log('SANITY_REVALIDATE_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" >> .env.local
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: succeeds (the route compiles; it isn't exercised end-to-end until deployed and the webhook is configured in sanity.io/manage pointing at `https://<your-domain>/api/revalidate` with this same secret)

- [ ] **Step 8: Commit**

```bash
git add next.config.ts app/api/revalidate
git commit -m "feat: add Sanity webhook revalidation endpoint"
```

---

### Task 11: Root layout, Navbar, Footer, FloatingCta

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/sections/Navbar.tsx`
- Modify: `components/sections/Footer.tsx`
- Modify: `components/FloatingCta.tsx`

**Interfaces:**
- Consumes: `getSiteSettings()` from `sanity/queries.ts`, `urlFor()` from `sanity/image.ts`
- Produces: `Navbar` now takes `{ settings: SiteSettings }`, `Footer` now takes `{ settings: SiteSettings }`, `FloatingCta` now takes `{ whatsapp: string }`

- [ ] **Step 1: Fetch siteSettings once in app/layout.tsx and pass down**

```tsx
// app/layout.tsx — replace `import { site } from "@/lib/site"` and all `site.*` usages
import { getSiteSettings } from "@/sanity/queries";
// ... existing imports for Navbar, Footer, FloatingCta, etc.

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-body text-ink">
        {/* jsonLd script: replace every `site.*` reference with `settings.*` */}
        <SmoothScroll />
        <ScrollProgress />
        <PremiumCursor />
        <PageTransition />
        <div className="film-grain" aria-hidden />
        <Navbar settings={settings} />
        <main id="main" className="flex-1">{children}</main>
        <Footer settings={settings} />
        <FloatingCta whatsapp={settings.whatsapp} />
      </body>
    </html>
  );
}
```

Also replace the `metadata` object's `site.position`/`site.name`/`site.tagline` references — since `metadata` is a static export evaluated before the component runs, move the literal English strings currently in `lib/site.ts` inline into the `metadata` object directly (SEO metadata doesn't need to be CMS-driven for this pass; it's read once at build/request time before any async data is available to a static `export const metadata`). Keep the `jsonLd` object's dynamic fields (`name`, `legalName`, `description`, `telephone`, `email`) driven by `settings` inside the component body where `settings` is in scope, not in the static `metadata` export.

- [ ] **Step 2: Update Navbar.tsx to accept settings as a prop**

```tsx
// components/sections/Navbar.tsx
"use client";
import type { SiteSettings } from "@/sanity/queries";
// remove: import { site } from "@/lib/site";
// remove: const navLinks = [...]

export function Navbar({ settings }: { settings: SiteSettings }) {
  // ... existing state/effects unchanged ...
  // replace `navLinks.map(...)` with `settings.navLinks.map(...)`
  // replace every `site.phoneHref`, `site.phone`, `site.hours` with `settings.phoneHref`, `settings.phone`, `settings.hours`
  // replace the "Enquire privately" literal with `settings.enquireLabel`
}
```

- [ ] **Step 3: Update Footer.tsx to accept settings as a prop**

```tsx
// components/sections/Footer.tsx
import type { SiteSettings } from "@/sanity/queries";
// remove: import { site } from "@/lib/site";
// remove: const explore = [...]

export function Footer({ settings }: { settings: SiteSettings }) {
  // replace `explore.map(...)` with `settings.footerExploreLinks.map(...)`
  // replace the hardcoded ["Jubilee Hills", "Kokapet", ...] array with `settings.footerGroundsLinks.map(...)`
  // replace `site.address`, `site.phoneHref`, `site.phone`, `site.whatsapp`, `site.hours`, `site.name`, `site.legalName`
  //   with the equivalent `settings.*` fields
  // replace the hardcoded footer blurb paragraph with `settings.footerBlurb`
  // replace the "Registered" / "RERA number" / "Registration" block's hardcoded strings with
  //   `settings.rera.registeredUnder`, `settings.rera.number`, `settings.rera.note`
  // replace the bottom "RERA no. ..." line with `settings.rera.number`
}
```

- [ ] **Step 4: Update FloatingCta.tsx to accept whatsapp as a prop**

```tsx
// components/FloatingCta.tsx
"use client";
// remove: import { site } from "@/lib/site";

export function FloatingCta({ whatsapp }: { whatsapp: string }) {
  // replace `href={site.whatsapp}` with `href={whatsapp}`
}
```

- [ ] **Step 5: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both pass clean (note: other pages still import `data/*`/`lib/site` at this point — later tasks fix those; this task only touches layout-level components)

Run: `npm run dev`, load `http://localhost:3000/`
Expected: navbar, footer, and WhatsApp floating button render with the migrated content, matching the pre-migration site

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx components/sections/Navbar.tsx components/sections/Footer.tsx components/FloatingCta.tsx
git commit -m "refactor: source Navbar, Footer and FloatingCta from Sanity siteSettings"
```

---

### Task 12: Homepage simple list-prop sections

**Files:**
- Modify: `components/sections/Stats.tsx`
- Modify: `components/sections/TrustStrip.tsx`
- Modify: `components/sections/Offerings.tsx`
- Modify: `components/sections/WhyJosh.tsx`
- Modify: `components/sections/Process.tsx`
- Modify: `components/sections/Testimonials.tsx`
- Modify: `components/sections/Faq.tsx`

**Interfaces:**
- Produces: `Stats({ stats, copy }: { stats: Stat[]; copy: HomePage["stats"] })`, `TrustStrip({ logos }: { logos: PartnerLogo[] })`, `Offerings({ services, copy }: { services: Service[]; copy: HomePage["offerings"] })`, `WhyJosh({ items, copy }: { items: PromiseItem[]; copy: HomePage["whyJosh"] })`, `Process({ steps, copy }: { steps: ProcessStep[]; copy: HomePage["process"] })`, `Testimonials({ items }: { items: Testimonial[] })`, `Faq({ items, copy }: { items: Faq[]; copy: HomePage["faqSection"] })`

This is 7 structurally identical mechanical edits (swap a `data/*` import for a prop of the same shape, swap a hardcoded heading string for a `copy.*` field) — grouped into one task since a reviewer evaluates them as a single behavior change, not 7 independent ones.

- [ ] **Step 1: Stats.tsx — accept props, drop the data import**

```tsx
// components/sections/Stats.tsx
"use client";
import type { Stat, HomePage } from "@/sanity/queries";
// remove: import { stats } from "@/data/stats";

export function Stats({ stats, copy }: { stats: Stat[]; copy: HomePage["stats"] }) {
  // replace "Title register · Select entries" with copy.label
  // replace "Folio I–IV" with copy.folioLabel
  // replace "Internal register, verified by counsel" (keep the dynamic `As of {year} ·` prefix) with copy.footerNote
  // replace "E. & O.E." with copy.eoe
  // stats.map(...) unchanged — same shape as before
}
```

- [ ] **Step 2: TrustStrip.tsx — accept props**

```tsx
// components/sections/TrustStrip.tsx
import type { PartnerLogo } from "@/sanity/queries";
// remove: import { partnerLogos } from "@/data/partners";

export function TrustStrip({ logos }: { logos: PartnerLogo[] }) {
  const doubled = [...logos, ...logos];
  // rest unchanged
}
```

- [ ] **Step 3: Offerings.tsx — accept props**

```tsx
// components/sections/Offerings.tsx
import type { Service, HomePage } from "@/sanity/queries";
// remove: import { services } from "@/data/services";

export function Offerings({ services, copy }: { services: Service[]; copy: HomePage["offerings"] }) {
  const featured = services.slice(0, 3);
  const advisory = services[3];
  // replace "Three kinds of quiet." with copy.heading
  // replace the body paragraph with copy.body
  // rest unchanged — note: the `localImages`/`seeds` fallback maps become unnecessary once `service`
  //   images are sourced from Sanity in a later pass; for THIS task, leave the picsum/local-image
  //   fallback logic as-is (services from Sanity don't carry an image field yet — out of scope,
  //   the schema's `service` type intentionally has no image field, matching current behavior)
}
```

- [ ] **Step 4: WhyJosh.tsx — accept props**

```tsx
// components/sections/WhyJosh.tsx
import type { PromiseItem, HomePage } from "@/sanity/queries";
// remove: import { promises } from "@/data/promises";

export function WhyJosh({ items, copy }: { items: PromiseItem[]; copy: HomePage["whyJosh"] }) {
  // replace "Why Hyderabad's quietest buyers deal with us." with copy.heading
  // replace `promises.map(...)` with `items.map(...)`
}
```

- [ ] **Step 5: Process.tsx — accept props**

```tsx
// components/sections/Process.tsx
"use client";
import type { ProcessStep, HomePage } from "@/sanity/queries";
// remove: import { processSteps } from "@/data/process";

export function Process({ steps, copy }: { steps: ProcessStep[]; copy: HomePage["process"] }) {
  // replace "The method" with copy.kicker
  // replace "A clear chain of title is the only luxury that compounds." with copy.heading
  // replace "Five steps, in writing. Counsel is present from the first call to the sub-registrar." with copy.intro
  // replace `processSteps.map(...)` with `steps.map(...)`
}
```

- [ ] **Step 6: Testimonials.tsx — accept props**

```tsx
// components/sections/Testimonials.tsx
"use client";
import type { Testimonial } from "@/sanity/queries";
// remove: import { testimonials } from "@/data/testimonials";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const featured = items.find((t) => t.featured) ?? items[0];
  const rest = items.filter((t) => t !== featured);
  // rest unchanged
}
```

- [ ] **Step 7: Faq.tsx — accept props**

```tsx
// components/sections/Faq.tsx
"use client";
import type { Faq as FaqItem, HomePage } from "@/sanity/queries";
// remove: import { faqs } from "@/data/faqs";

export function Faq({ items, copy }: { items: FaqItem[]; copy: HomePage["faqSection"] }) {
  // replace "The questions every Hyderabad buyer asks." with copy.heading
  // replace `faqs.map(...)` with `items.map(...)`
}
```

- [ ] **Step 8: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: new prop-interface errors at each call site in `app/page.tsx` — expected at this point, `app/page.tsx` isn't updated until Task 13. Confirm the *only* errors are "missing props" at the `<Stats />`, `<TrustStrip />`, `<Offerings />`, `<WhyJosh />`, `<Process />`, `<Testimonials />`, `<Faq />` call sites in `app/page.tsx`.

- [ ] **Step 9: Commit**

```bash
git add components/sections/Stats.tsx components/sections/TrustStrip.tsx components/sections/Offerings.tsx components/sections/WhyJosh.tsx components/sections/Process.tsx components/sections/Testimonials.tsx components/sections/Faq.tsx
git commit -m "refactor: source homepage list sections from Sanity via props"
```

---

### Task 13: CinematicHero, Story, FarmlandBand, FinalCta + app/page.tsx wiring

**Files:**
- Modify: `components/CinematicHero.tsx`
- Modify: `components/sections/Story.tsx`
- Modify: `components/sections/FarmlandBand.tsx`
- Modify: `components/sections/FinalCta.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `CinematicHero({ copy, heroVideo }: { copy: HomePage["hero"]; heroVideo: string })`, `Story({ copy }: { copy: HomePage["story"] })`, `FarmlandBand({ copy }: { copy: HomePage["farmlandBand"] })`, `FinalCta({ copy, phone, phoneHref, whatsapp, reraNumber }: { copy: HomePage["finalCta"]; phone: string; phoneHref: string; whatsapp: string; reraNumber: string })`
- `app/page.tsx` becomes `async`, fetches everything once via `Promise.all`

- [ ] **Step 1: CinematicHero.tsx — accept scene copy + video path as props**

```tsx
// components/CinematicHero.tsx
"use client";
import type { HomePage } from "@/sanity/queries";
// remove: import { site } from "@/lib/site";

export function CinematicHero({ copy, heroVideo }: { copy: HomePage["hero"]; heroVideo: string }) {
  // ... existing refs/motion values unchanged ...
  // replace `site.heroVideo` (the <video src={...}>) with `heroVideo`
  // replace "Private real estate advisory" with copy.kicker
  // replace "Hyderabad" (the h1) with copy.place
  // replace "CURATED." / "VERIFIED." / "PRIVATE." (the 3 MaskedLine children in Scene 02) with copy.words[0] / copy.words[1] / copy.words[2]
  // replace "THE TITLE" with copy.titleLine1
  // replace "COMES FIRST." with copy.titleLine2
  // replace "EVERY PROPERTY. INDEPENDENTLY VERIFIED." with copy.verificationNote
  // replace "JOSH PROPERTIES" with copy.brandLine
  // replace "Hyderabad · Est. 2017" with copy.brandSub
  // replace "View the Collection" with copy.ctaLabel
  // StaticHero() (the reduced-motion fallback) keeps its own hardcoded copy — it's a distinct,
  //   deliberately-simple fallback UI, not part of the scroll choreography; leave it as-is
}
```

- [ ] **Step 2: Story.tsx — accept copy as a prop**

```tsx
// components/sections/Story.tsx
import type { HomePage } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export function Story({ copy }: { copy: HomePage["story"] }) {
  // replace the hardcoded <Image src="https://picsum.photos/seed/josh-story/..."> with:
  //   src={copy.image ? urlFor(copy.image).width(1000).height(1250).url() : "https://picsum.photos/seed/josh-story/1000/1250"}
  // replace "Surveyed plot, Chevella" with copy.imageCaption
  // replace "Folio 001 · Title chain" with copy.folioLabel
  // replace "Verified by counsel" with copy.verifiedLabel
  // replace "We sell the title." with copy.headingPlain
  // replace "The land is a bonus." with copy.headingItalic
  // replace "A clear chain of title is the only luxury that compounds." with copy.pullQuote
  // replace the two hardcoded <p> body paragraphs with copy.bodyParagraphs.map((para, i) => <Reveal key={i} delay={0.05 * (i + 1)}><p ...>{para}</p></Reveal>)
  // replace "JOSH" with copy.signoffName
  // replace "Principal, Josh Properties" with copy.signoffTitle
}
```

- [ ] **Step 3: FarmlandBand.tsx — accept copy as a prop**

```tsx
// components/sections/FarmlandBand.tsx
import type { HomePage } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
// remove: const grounds = [...]

export function FarmlandBand({ copy }: { copy: HomePage["farmlandBand"] }) {
  // replace "Over 1,200 acres, flown and surveyed." with copy.heading
  // replace "Explore the land" with copy.ctaLabel
  // replace `grounds.map((g) => ...)` with `copy.grounds.map((g) => ...)`, and inside the map,
  //   replace the <Image src={`https://picsum.photos/seed/${g.seed}/720/900`}> with:
  //   src={g.image ? urlFor(g.image).width(720).height(900).url() : `https://picsum.photos/seed/josh-farm-${g.name}/720/900`}
  // key={g.name} still works since `name` is still a field
}
```

- [ ] **Step 4: FinalCta.tsx — accept copy + contact fields as props**

```tsx
// components/sections/FinalCta.tsx
"use client";
import type { HomePage } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
// remove: import { site } from "@/lib/site";

export function FinalCta({
  copy, phone, phoneHref, whatsapp, reraNumber,
}: {
  copy: HomePage["finalCta"]; phone: string; phoneHref: string; whatsapp: string; reraNumber: string;
}) {
  // replace the hardcoded <Image src="/images/villa-06.jpg"> with:
  //   src={copy.image ? urlFor(copy.image).width(1920).url() : "/images/villa-06.jpg"}
  // replace "Every great purchase begins with a " with copy.headingPlain
  // replace "private call." with copy.headingEmphasis
  // replace the body paragraph with copy.body
  // replace "Enquire privately" (button label) with copy.ctaEnquireLabel
  // replace "WhatsApp the concierge" with copy.ctaWhatsappLabel
  // replace `site.phoneHref` with `phoneHref`, `site.phone` with `phone`, `site.whatsapp` with `whatsapp`
  // replace "Est. 2017" with copy.founded
  // replace "By appointment only · {site.hours}" — note `site.hours` isn't in FinalCta's new prop
  //   list; change this line to just copy.byAppointment (drop the hours suffix, it's redundant
  //   with the footer) or add an `hours: string` prop if you want to keep it verbatim — prefer
  //   dropping it, it's not in the approved field list for finalCta
  // replace "RERA P02400005461" with `RERA ${reraNumber}`
}
```

- [ ] **Step 5: Rewrite app/page.tsx as an async Server Component fetching everything**

```tsx
// app/page.tsx
import { CinematicHero } from "@/components/CinematicHero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Stats } from "@/components/sections/Stats";
import { Featured } from "@/components/sections/Featured";
import { Offerings } from "@/components/sections/Offerings";
import { Story } from "@/components/sections/Story";
import { FarmlandBand } from "@/components/sections/FarmlandBand";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { WhyJosh } from "@/components/sections/WhyJosh";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  getHomePage, getSiteSettings, getStats, getPartnerLogos, getFeaturedProperties,
  getServices, getPromiseItems, getProcessSteps, getTestimonials, getFaqs,
} from "@/sanity/queries";

export default async function Home() {
  const [homePage, settings, stats, logos, featuredProperties, services, promiseItems, processSteps, testimonials, faqs] =
    await Promise.all([
      getHomePage(), getSiteSettings(), getStats(), getPartnerLogos(), getFeaturedProperties(),
      getServices(), getPromiseItems(), getProcessSteps(), getTestimonials(), getFaqs(),
    ]);

  return (
    <>
      <CinematicHero copy={homePage.hero} heroVideo={settings.heroVideo} />
      <TrustStrip logos={logos} />
      <Stats stats={stats} copy={homePage.stats} />
      <Featured properties={featuredProperties} copy={homePage.featured} />
      <Offerings services={services} copy={homePage.offerings} />
      <Story copy={homePage.story} />
      <FarmlandBand copy={homePage.farmlandBand} />
      <WhyJosh items={promiseItems} copy={homePage.whyJosh} />
      <Process steps={processSteps} copy={homePage.process} />
      <Testimonials items={testimonials} />
      <Faq items={faqs} copy={homePage.faqSection} />
      <FinalCta
        copy={homePage.finalCta}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        whatsapp={settings.whatsapp}
        reraNumber={settings.rera.number}
      />
    </>
  );
}
```

Note: `<Featured properties={...} copy={...} />` is written from Task 14 — this task's `app/page.tsx` rewrite depends on Task 14's `Featured` prop signature. Do Task 14 first if working sequentially, or stub `Featured`'s new props here and reconcile when Task 14 lands.

- [ ] **Step 6: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: passes clean (assuming Task 14's `Featured` signature is already in place)

Run: `npm run dev`, load `http://localhost:3000/`
Expected: full homepage renders identically to the pre-migration site — hero scenes, stats, story, farmland band, why-josh, process, testimonials, faq, final cta all show the migrated Sanity content

- [ ] **Step 7: Commit**

```bash
git add components/CinematicHero.tsx components/sections/Story.tsx components/sections/FarmlandBand.tsx components/sections/FinalCta.tsx app/page.tsx
git commit -m "refactor: source hero, story, farmland band and final CTA from Sanity"
```

---

### Task 14: Featured, PropertyCard, PropertyListing, villas/apartments pages

**Files:**
- Modify: `components/sections/Featured.tsx`
- Modify: `components/PropertyCard.tsx`
- Modify: `components/PropertyListing.tsx`
- Modify: `app/villas/page.tsx`
- Modify: `app/apartments/page.tsx`

**Interfaces:**
- Consumes: `Property` type from `sanity/queries.ts` (replaces the `data/properties.ts` `Property` type everywhere in this task)
- Produces: `Featured({ properties, copy }: { properties: Property[]; copy: HomePage["featured"] })`, `PropertyCard({ property }: { property: Property })` (same prop name/shape as before, just a different `Property` type import), `PropertyListing({ category, kicker, heading, intro, items }: { category: PropertyCategory; kicker: string; heading: string; intro: string; items: Property[] })` (now takes `items` instead of calling `getByCategory` itself, since that's a Server Component's job)

- [ ] **Step 1: Featured.tsx — accept props**

```tsx
// components/sections/Featured.tsx
import type { Property, HomePage } from "@/sanity/queries";
// remove: import { featuredProperties } from "@/data/properties";

export function Featured({ properties, copy }: { properties: Property[]; copy: HomePage["featured"] }) {
  const [first, second, third] = properties;
  // replace "Three properties, none of them in a rush." with copy.heading
  // replace the body paragraph with copy.body
  // rest unchanged
}
```

- [ ] **Step 2: PropertyCard.tsx — swap the Property type import, render Sanity images**

```tsx
// components/PropertyCard.tsx
"use client";
import type { Property } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
// remove: import type { Property } from "@/data/properties";

export function PropertyCard({ property, large, className }: PropertyCardProps) {
  const ratio = large ? "aspect-[4/5]" : "aspect-[4/3]";
  const src = property.image
    ? urlFor(property.image).width(property.tall || large ? 1200 : 900).height(property.tall || large ? 1200 : 900).url()
    : `https://picsum.photos/seed/${property.slug}/${property.tall || large ? 1200 : 900}/${property.tall || large ? 1200 : 900}`;
  // remove the old `dim`/`seed`-based src computation — `property.seed` no longer exists on the
  //   Sanity Property type; the picsum fallback above uses `property.slug` instead, which is
  //   equally deterministic per-property
  // rest of the component (Stamp, motion layers, etc.) unchanged — `property.folio`, `.status`,
  //   `.location`, `.title`, `.price`, `.area` all still exist with the same names
}
```

- [ ] **Step 3: PropertyListing.tsx — accept items as a prop instead of fetching itself**

```tsx
// components/PropertyListing.tsx
import type { Property } from "@/sanity/queries";
// remove: import type { PropertyCategory } from "@/data/properties";
// remove: import { getByCategory } from "@/data/properties";

interface PropertyListingProps {
  kicker: string;
  heading: string;
  intro: string;
  items: Property[];
}

export function PropertyListing({ kicker, heading, intro, items }: PropertyListingProps) {
  // remove: const items = getByCategory(category);
  // rest unchanged — `items.map((p, i) => <PropertyCard property={p} />)` already matches
}
```

- [ ] **Step 4: app/villas/page.tsx — fetch categoryPage + properties, pass down**

```tsx
// app/villas/page.tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PropertyListing } from "@/components/PropertyListing";
import { getCategoryPage, getPropertiesByCategory } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Villas in Hyderabad",
  description:
    "Freehold villas across Jubilee Hills, Kokapet and Medchal, shown once, by appointment, with the full title chain verified before any price is discussed.",
};

export default async function VillasPage() {
  const [page, properties] = await Promise.all([
    getCategoryPage("villa"),
    getPropertiesByCategory("villa"),
  ]);

  return (
    <>
      <PageHero eyebrow={page.heroEyebrow} title={<>{page.heroTitleLine1}<br />{page.heroTitleLine2}</>} seed="josh-villas">
        <p>{page.heroBody}</p>
      </PageHero>
      <PropertyListing
        kicker={page.listingKicker}
        heading={page.listingHeading}
        intro={page.listingIntro}
        items={properties}
      />
    </>
  );
}
```

- [ ] **Step 5: app/apartments/page.tsx — same pattern, plus the apartments-only "outlook" section**

Unlike villas, the apartments page has an extra section between `PageHero` and `PropertyListing`: a `DayNightCity` component beside a two-paragraph "outlook" pitch. That copy now lives in `categoryPage-apartment`'s `outlookHeading`/`outlookBody1`/`outlookBody2` fields (Task 5, Task 9).

```tsx
// app/apartments/page.tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PropertyListing } from "@/components/PropertyListing";
import { DayNightCity } from "@/components/DayNightCity";
import { Reveal } from "@/components/motion/Reveal";
import { getCategoryPage, getPropertiesByCategory } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Apartments in Hyderabad",
  description:
    "A curated list of apartments and penthouses in the city's sharpest towers, chosen for light, outlook and the quietness of the corridor.",
};

export default async function ApartmentsPage() {
  const [page, properties] = await Promise.all([
    getCategoryPage("apartment"),
    getPropertiesByCategory("apartment"),
  ]);

  return (
    <>
      <PageHero eyebrow={page.heroEyebrow} title={<>{page.heroTitleLine1}<br />{page.heroTitleLine2}</>} seed="josh-apartments">
        <p>{page.heroBody}</p>
      </PageHero>

      <section className="bg-stone">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 py-24 sm:px-12 lg:grid-cols-2 lg:gap-24 lg:px-20 lg:py-32">
          <Reveal><DayNightCity /></Reveal>
          <div>
            <Reveal>
              <h2 className="text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-6xl">
                {page.outlookHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-ink/70">{page.outlookBody1}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-ink/70">{page.outlookBody2}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <PropertyListing
        kicker={page.listingKicker}
        heading={page.listingHeading}
        intro={page.listingIntro}
        items={properties}
      />
    </>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: passes clean

Run: `npm run dev`, load `/`, `/villas`, `/apartments`
Expected: Featured section and both listing pages render the migrated properties with images, matching pre-migration content

- [ ] **Step 7: Commit**

```bash
git add components/sections/Featured.tsx components/PropertyCard.tsx components/PropertyListing.tsx app/villas/page.tsx app/apartments/page.tsx
git commit -m "refactor: source Featured, PropertyCard and villa/apartment listings from Sanity"
```

---

### Task 15: Farmlands page (holdings grid + masterplan + dossier form)

**Files:**
- Modify: `app/farmlands/page.tsx`
- Modify: `components/FarmlandMap.tsx`
- Modify: `components/DossierForm.tsx`

**Interfaces:**
- Produces: `FarmlandMap({ masterplan }: { masterplan: CategoryPage["masterplan"] })`, `DossierForm({ holdings, whatsapp }: { holdings: { slug: string; name: string }[]; whatsapp: string })`

- [ ] **Step 1: FarmlandMap.tsx — accept masterplan as a prop**

```tsx
// components/FarmlandMap.tsx
"use client";
import { useState } from "react";
import type { CategoryPage } from "@/sanity/queries";
// remove: import { masterplan } from "@/data/farmland";

export function FarmlandMap({ masterplan }: { masterplan: NonNullable<CategoryPage["masterplan"]> }) {
  // rest of the component unchanged — `masterplan.name`, `.river`, `.plots` all match the same shape
}
```

- [ ] **Step 2: DossierForm.tsx — accept holdings + whatsapp as props**

```tsx
// components/DossierForm.tsx
"use client";
// remove: import { farmlandOptions } from "@/data/farmland";
// remove: import { site } from "@/lib/site";

export function DossierForm({ holdings, whatsapp }: { holdings: { slug: string; name: string }[]; whatsapp: string }) {
  // replace `farmlandOptions.map((o) => ...)` with `holdings.map((o) => ...)` — `o.slug`/`o.name` still match
  // replace `site.whatsapp` with `whatsapp` in the submit() handler's window.open() call
}
```

- [ ] **Step 3: app/farmlands/page.tsx — fetch everything, wire props**

```tsx
// app/farmlands/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { FarmlandMap } from "@/components/FarmlandMap";
import { DossierForm } from "@/components/DossierForm";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";
import { getCategoryPage, getFarmlandOptions, getSiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export const metadata: Metadata = {
  title: "Farmlands in Hyderabad & Telangana",
  description:
    "Over 1,200 acres of cleared-title farmland across Shankarpally, Moinabad and Chevella, flown by drone, boundary-surveyed, and offered by appointment.",
};

export default async function FarmlandsPage() {
  const [page, options, settings] = await Promise.all([
    getCategoryPage("farmland"),
    getFarmlandOptions(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHero eyebrow={page.heroEyebrow} title={<>{page.heroTitleLine1}<br />{page.heroTitleLine2}</>} seed="josh-farmlands">
        <p>{page.heroBody}</p>
      </PageHero>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
          <Reveal><ChapterMarker kicker={page.masterplanKicker ?? ""} /></Reveal>
          <RevealMask delay={0.1}>
            <h2 className="mt-8 max-w-[18ch] text-balance font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-7xl">
              {page.masterplanHeading}
            </h2>
          </RevealMask>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[58ch] text-pretty text-[16px] leading-relaxed text-ink/70">
              {page.masterplanBody}
            </p>
          </Reveal>
          {page.masterplan && (
            <Reveal delay={0.15} className="mt-12">
              <FarmlandMap masterplan={page.masterplan} />
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-stone">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Reveal><ChapterMarker kicker={page.holdingsKicker ?? ""} /></Reveal>
              <RevealMask delay={0.1}>
                <h2 className="mt-8 max-w-[18ch] text-balance font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-7xl">
                  {page.holdingsHeading}
                </h2>
              </RevealMask>
            </div>
            <Reveal delay={0.2}>
              <p className="eyebrow max-w-[30ch] text-slate">{page.holdingsNote}</p>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {options.map((o, i) => (
              <Reveal key={o.slug} delay={(i % 2) * 0.1}>
                <div className="group border border-ink/15 bg-paper">
                  <div className="vignette relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={o.image ? urlFor(o.image).width(1200).height(750).url() : `https://picsum.photos/seed/${o.slug}/1200/750`}
                      alt={`${o.name}, drone survey`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-[transform,filter] duration-[1600ms] ease-out group-hover:scale-[1.06] group-hover:brightness-[1.04]"
                    />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl font-light text-ink lg:text-3xl">{o.name}</h3>
                      <span className={o.status === "Available" ? "eyebrow text-emerald" : "eyebrow text-ink/40"}>
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 border-t border-ink/15 pt-5">
                      <div><p className="eyebrow text-slate">Area</p><p className="mt-1 text-[15px] text-ink">{o.area}</p></div>
                      <div><p className="eyebrow text-slate">Price</p><p className="mt-1 text-[15px] text-ink">{o.price}</p></div>
                      <div><p className="eyebrow text-slate">Holding</p><p className="mt-1 text-[15px] text-ink">{o.acres}</p></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-6 py-24 sm:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-20 lg:py-32">
          <div>
            <Reveal><ChapterMarker kicker={page.dossierKicker ?? ""} /></Reveal>
            <RevealMask delay={0.1}>
              <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-6xl">
                {page.dossierHeading}
              </h2>
            </RevealMask>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-[50ch] text-pretty text-[16px] leading-relaxed text-ink/70">{page.dossierBody}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 text-[15px] leading-relaxed text-ink/50">
                Prefer to talk first? Call{" "}
                <a href={settings.phoneHref} className="text-emerald underline-offset-4 hover:underline">{settings.phone}</a>
                . A concierge answers, not a call centre.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <DossierForm holdings={options.map((o) => ({ slug: o.slug, name: o.name }))} whatsapp={settings.whatsapp} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: passes clean

Run: `npm run dev`, load `/farmlands`
Expected: masterplan map, holdings grid, and dossier form all render with migrated content; clicking a masterplan plot still shows its detail panel; submitting the dossier form still opens WhatsApp

- [ ] **Step 5: Commit**

```bash
git add app/farmlands/page.tsx components/FarmlandMap.tsx components/DossierForm.tsx
git commit -m "refactor: source farmlands page, masterplan and dossier form from Sanity"
```

---

### Task 16: Property detail page

**Files:**
- Modify: `app/properties/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProperty(slug)`, `getPropertySlugs()`, `getPropertiesByCategory(category)` from `sanity/queries.ts`

- [ ] **Step 1: Rewrite generateStaticParams, generateMetadata and the page component**

```tsx
// app/properties/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getProperty, getPropertiesByCategory, getPropertySlugs, getSiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PageHero } from "@/components/sections/PageHero";
import { Gallery } from "@/components/Gallery";
import { PropertyCard } from "@/components/PropertyCard";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: "Property · Josh Properties" };
  return {
    title: property.title,
    description: `${property.short} ${property.location}. ${property.price} · ${property.area}.`,
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const [property, settings] = await Promise.all([getProperty(slug), getSiteSettings()]);
  if (!property) notFound();

  const images = property.gallery && property.gallery.length > 0
    ? property.gallery.map((img, i) => ({
        src: urlFor(img).width(1600).height(1000).url(),
        alt: `${property.title}${i === 0 ? ", main view" : `, view ${i + 1}`}`,
      }))
    : [
        { src: `https://picsum.photos/seed/${property.slug}-hero/1600/1000`, alt: `${property.title}, main view` },
        { src: `https://picsum.photos/seed/${property.slug}-2/1600/1000`, alt: `${property.title}, interior detail` },
        { src: `https://picsum.photos/seed/${property.slug}-3/1600/1000`, alt: `${property.title}, exterior` },
        { src: `https://picsum.photos/seed/${property.slug}-4/1600/1000`, alt: `${property.title}, interior in light` },
        { src: `https://picsum.photos/seed/${property.slug}-5/1600/1000`, alt: `${property.title}, outlook` },
      ];

  const sameCategory = await getPropertiesByCategory(property.category);
  const more = sameCategory.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={`${property.category} · ${property.location}`}
        title={property.title}
        seed={`${property.slug}-hero`}
        image={property.image ? urlFor(property.image).width(2400).height(1200).url() : undefined}
      >
        <p>{property.short}</p>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-emerald">
          {property.price} · {property.area}
          {property.beds ? ` · ${property.beds}` : ""} · {property.status}
        </p>
      </PageHero>

      {/* "Walk through the property" gallery section — unchanged from before, uses `images` above */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20">
          <Reveal><ChapterMarker kicker="Walk through" /></Reveal>
          <RevealMask delay={0.1}>
            <h2 className="mt-8 max-w-[20ch] text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-6xl">
              Drag through the property.
            </h2>
          </RevealMask>
        </div>
        <Reveal delay={0.2} className="mt-12"><Gallery images={images} className="lg:px-0" /></Reveal>
      </section>

      {/* "Why this property exists" + facts sidebar section — unchanged structure, replace
          `site.phoneHref`/`site.phone` with `settings.phoneHref`/`settings.phone` */}
      <section className="bg-stone">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-6 py-24 sm:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24 lg:px-20 lg:py-32">
          <div>
            <Reveal><ChapterMarker kicker="The story" /></Reveal>
            <RevealMask delay={0.1}>
              <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-5xl">
                Why this property exists.
              </h2>
            </RevealMask>
            <div className="mt-10 space-y-6">
              {property.narrative.map((para, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="max-w-[64ch] text-pretty text-[17px] leading-relaxed text-ink/75">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="border border-ink/15 bg-paper">
                <div className="border-b border-ink/15 px-7 py-5"><p className="eyebrow text-slate">The facts</p></div>
                <dl className="divide-y divide-ink/10 px-7 py-2">
                  {property.specs.map((s, i) => (
                    <Reveal key={s.label} delay={0.05 * i}>
                      <div className="flex items-baseline justify-between gap-6 py-4 transition-colors duration-300 hover:bg-mist/50">
                        <dt className="text-[13px] uppercase tracking-[0.12em] text-ink/50">{s.label}</dt>
                        <dd className="text-right font-display text-lg text-ink">{s.value}</dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>
                <div className="border-t border-ink/15 p-7">
                  <p className="text-[14px] leading-relaxed text-ink/60">
                    The full chain of title, revenue records and survey maps are provided to serious enquirers before any payment is discussed.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <MagneticButton href="/contact">
                      <Button href="/contact" variant="filled" data-cursor="ENQUIRE" className="group w-full justify-center">
                        Enquire about this property
                        <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </MagneticButton>
                    <MagneticButton href={settings.phoneHref}>
                      <Button href={settings.phoneHref} variant="outline" className="w-full justify-center">
                        <Phone size={15} strokeWidth={1.5} />
                        {settings.phone}
                      </Button>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
            <div className="flex items-end justify-between gap-8">
              <div>
                <Reveal><ChapterMarker kicker="Also in this ground" /></Reveal>
                <RevealMask delay={0.1}>
                  <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-5xl">
                    If this is almost right.
                  </h2>
                </RevealMask>
              </div>
              <Reveal delay={0.2}>
                <Link
                  href={property.category === "villa" ? "/villas" : property.category === "apartment" ? "/apartments" : "/farmlands"}
                  className="link-underline eyebrow group flex items-center gap-2 whitespace-nowrap text-slate transition-colors hover:text-emerald"
                >
                  View the full list
                  <span className="h-px w-8 bg-slate/50 transition-all duration-300 group-hover:w-14 group-hover:bg-emerald" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              {more.map((p) => (<Reveal key={p.slug}><PropertyCard property={p} /></Reveal>))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: passes clean

Run: `npm run build`
Expected: all 9 property slugs prerender successfully via `generateStaticParams`

Run: `npm run dev`, load `/properties/jubilee-house`
Expected: gallery, narrative, specs, and "also in this ground" cards all render with migrated content

- [ ] **Step 3: Commit**

```bash
git add app/properties/\[slug\]/page.tsx
git commit -m "refactor: source property detail page from Sanity"
```

---

### Task 17: Contact page + ContactForm

**Files:**
- Modify: `app/contact/page.tsx`
- Modify: `app/contact/ContactForm.tsx`

**Interfaces:**
- Produces: `ContactForm({ whatsapp, phone, phoneHref }: { whatsapp: string; phone: string; phoneHref: string })`

- [ ] **Step 1: ContactForm.tsx — accept contact fields as props**

```tsx
// app/contact/ContactForm.tsx
"use client";
// remove: import { site } from "@/lib/site";

export function ContactForm({ whatsapp, phone, phoneHref }: { whatsapp: string; phone: string; phoneHref: string }) {
  // replace `site.whatsapp` (in submit()'s window.open call) with `whatsapp`
  // replace `site.phoneHref` with `phoneHref`, `site.phone` with `phone` (in the "sent" success state)
}
```

- [ ] **Step 2: app/contact/page.tsx — fetch contactPage + siteSettings**

```tsx
// app/contact/page.tsx
import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { getContactPage, getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Enquire privately",
  description:
    "Enquire privately with Josh Properties. A concierge replies within two working days, no walk-ins, no mailing list.",
};

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getContactPage(), getSiteSettings()]);

  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-28 sm:px-12 lg:px-20 lg:pb-40 lg:pt-32">
          <Reveal><ChapterMarker kicker={page.kicker} /></Reveal>
          <div className="mt-8 grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <div>
              <Reveal delay={0.1}>
                <h1 className="text-balance font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-6xl">
                  {page.heading}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-[50ch] text-pretty text-[17px] leading-relaxed text-ink/70">{page.body}</p>
              </Reveal>
              <Reveal delay={0.3}>
                <ContactForm whatsapp={settings.whatsapp} phone={settings.phone} phoneHref={settings.phoneHref} />
              </Reveal>
            </div>

            <aside className="lg:border-l lg:border-ink/15 lg:pl-14">
              <Reveal delay={0.15}>
                <h2 className="eyebrow text-slate">{page.concierceHeading}</h2>
                <ul className="mt-6 space-y-6">
                  <li>
                    <a href={settings.phoneHref} className="font-display text-2xl font-light text-ink transition-colors hover:text-emerald">
                      {settings.phone}
                    </a>
                    <p className="mt-1 text-sm text-ink/50">{settings.hours}</p>
                  </li>
                  <li>
                    <a href={`mailto:${settings.email}`} className="font-display text-2xl font-light text-ink transition-colors hover:text-emerald">
                      {settings.email}
                    </a>
                    <p className="mt-1 text-sm text-ink/50">{page.emailNote}</p>
                  </li>
                </ul>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-12 border-t border-ink/15 pt-10">
                  <h2 className="eyebrow text-slate">{page.officeHeading}</h2>
                  <address className="mt-5 not-italic">
                    <p className="text-[15px] leading-relaxed text-ink/70">{settings.address}</p>
                    <p className="mt-1 text-sm text-ink/50">{page.officeNote}</p>
                  </address>
                  <div className="vignette relative mt-8 aspect-[4/3] overflow-hidden rounded-[2px]">
                    <div className="absolute inset-0 bg-mist" />
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: passes clean

Run: `npm run dev`, load `/contact`, fill and submit the form
Expected: form still opens a WhatsApp deep link with the same message format as before, page copy matches migrated content

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx app/contact/ContactForm.tsx
git commit -m "refactor: source contact page and ContactForm from Sanity"
```

---

### Task 18: Farmlands page image asset gap check

**Files:**
- Read-only verification task, no file changes expected unless a gap is found

- [ ] **Step 1: Confirm farmlandOption images resolved during migration**

Open each `farmlandOption` document in Studio (`/studio`). If any show a missing/broken `image` field (because `mapFarmlandOption` in Task 7 looked for a file at `/images/farmland-<slug>.jpg` that didn't exist in `public/images/` at migration time), either upload a real photo directly in Studio now, or leave it — the farmlands page's fallback (`https://picsum.photos/seed/${o.slug}/1200/750`) already handles a missing image gracefully (verified in Task 15's `Image` `src` logic).

- [ ] **Step 2: No commit needed**

This is a content/data verification step, not a code change.

---

## Phase 6 — Cleanup and final verification

### Task 19: Delete data/*.ts and lib/site.ts

**Files:**
- Delete: `data/properties.ts`, `data/farmland.ts`, `data/testimonials.ts`, `data/faqs.ts`, `data/stats.ts`, `data/services.ts`, `data/process.ts`, `data/partners.ts`, `data/promises.ts`, `lib/site.ts`
- Modify: `scripts/migrate-to-sanity.ts` (its imports from `data/*` and `lib/site.ts` break once those files are deleted)

**Interfaces:**
- None — this is a pure deletion once nothing else in `app/` or `components/` imports from these paths

- [ ] **Step 1: Confirm nothing still imports from data/* or lib/site**

Run: `grep -rn 'from "@/data/\|from "@/lib/site"' app components --include='*.tsx' --include='*.ts'`
Expected: no output (Tasks 11–17 removed every consumer)

- [ ] **Step 2: Move the migration script's data source into a frozen snapshot, or accept it becomes historical**

The migration script (`scripts/migrate-to-sanity.ts`) was a one-off already run in Tasks 8–9. Delete it along with its test and the now-orphaned `scripts/mapToSanityDocs.ts`/`.test.ts` — they depended on `data/*.ts` types and have no further purpose once Sanity is the source of truth. If you want to keep the migration logic as a historical reference, it remains in git history (previous commits) without needing to keep the files on disk.

```bash
rm data/properties.ts data/farmland.ts data/testimonials.ts data/faqs.ts data/stats.ts data/services.ts data/process.ts data/partners.ts data/promises.ts lib/site.ts
rm scripts/migrate-to-sanity.ts scripts/mapToSanityDocs.ts scripts/mapToSanityDocs.test.ts
rmdir data 2>/dev/null || true
```

Leave `lib/utils.ts` (the `cn()` helper) — it's unrelated to content and still used everywhere.

- [ ] **Step 3: Remove the now-empty test script if no tests remain**

Check `npm run test` — if `app/api/revalidate/route.test.ts` is the only remaining test file, `vitest.config.ts` and the `test` script stay (that test is still valid and independent of `data/*.ts`).

- [ ] **Step 4: Verify**

Run: `npm run lint`
Expected: passes clean, no unresolved-import errors

Run: `npx tsc --noEmit`
Expected: passes clean

Run: `npm run test`
Expected: PASS (only `app/api/revalidate/route.test.ts` remains — `scripts/mapToSanityDocs.test.ts` was deleted in Step 2)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove static data files, fully migrated to Sanity"
```

---

### Task 20: Full site smoke check

**Files:**
- None — verification only

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: succeeds, all 9 property detail pages + villas/apartments/farmlands/contact/home prerender or render without error

- [ ] **Step 2: Manual page-by-page check**

Run: `npm run dev`, visit each of: `/`, `/villas`, `/apartments`, `/farmlands`, `/contact`, `/properties/jubilee-house`, `/studio`
Expected per page:
- `/` — hero scenes play on scroll with migrated text, stats show comma-formatted numbers, all sections render
- `/villas`, `/apartments` — PageHero + property grid render with migrated copy and images
- `/farmlands` — masterplan map interactive, holdings grid shows images, dossier form opens WhatsApp
- `/contact` — form opens WhatsApp with correct number
- `/properties/jubilee-house` — gallery, narrative, specs, related properties render
- `/studio` — every document type editable, singleton pinning works, image uploads work

- [ ] **Step 3: Lint and typecheck one final time**

Run: `npm run lint && npx tsc --noEmit`
Expected: both pass clean

- [ ] **Step 4: No commit needed (verification only) — if any issue is found, fix it and commit that fix normally**

---

### Task 21: Deployment note (manual, no code)

Not a code task — a reminder for whenever this site is deployed (e.g. to Vercel):

1. Set the same env vars from `.env.local` in the hosting platform's environment settings (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_TOKEN`, `SANITY_REVALIDATE_SECRET`)
2. In sanity.io/manage → API → Webhooks, add a webhook pointed at `https://<your-domain>/api/revalidate`, with the same secret as `SANITY_REVALIDATE_SECRET`, triggered on Create/Update/Delete for all document types, with the document's `_type` included in the payload (Sanity's default webhook payload already includes this)
3. Regenerate the `SANITY_API_TOKEN` shown earlier in this conversation from sanity.io/manage before going live, since it was pasted in plaintext in a chat transcript

---

## Self-review notes

- **Spec coverage:** every collection and singleton from the design spec has a schema task (4, 5), a query (6), a migration path (7–9), and at least one consuming component task (11–17). The masterplan gap noted during planning was folded into `categoryPage` (Task 5, Step 3) and wired end-to-end (Task 9, Task 15). The `promiseItem` gap (missing from the original spec's collection list) was added in Task 4.
- **Placeholder scan:** no TBD/TODO markers; every step has real code. The one caveat (Task 9, missing farmland/story image files) is explicitly resolved with a concrete fallback (`undefined` image field, already handled by optional chaining in every consuming component) rather than left vague.
- **Type consistency:** `Property`, `FarmlandOption`, `Testimonial`, `Faq`, `Stat`, `Service`, `ProcessStep`, `PartnerLogo`, `PromiseItem`, `SiteSettings`, `HomePage`, `CategoryPage`, `ContactPage` are all defined once in `sanity/queries.ts` (Task 6) and imported by type-only imports everywhere else — no redefinition drift.
- **Post-write correction:** initial drafts of Task 5/9/14 guessed at `app/apartments/page.tsx`'s copy before that file had been read. Read it during self-review and found it has an extra "outlook" section (`DayNightCity` + two paragraphs) that villas doesn't — added `outlookHeading`/`outlookBody1`/`outlookBody2` to the `categoryPage` schema (Task 5), corrected the migrated copy to the real strings (Task 9), and rewrote Task 14 Step 5 with the accurate page structure. Also confirmed `data/partners.ts`'s `{name, note}[]` shape matches `mapPartnerLogo`'s signature exactly — no change needed there.
