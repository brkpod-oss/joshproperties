# Sanity CMS integration — design

Date: 2026-08-13
Status: Approved, pending implementation

## Goal

Every piece of content and copy on the Josh Properties site — properties, farmland
plots, stats, testimonials, FAQs, services, process steps, partner logos, brand/contact
info, and per-section page copy (including hero, story, footer, etc.) — becomes editable
through a Sanity Studio, without a code deploy. Images move into Sanity's asset pipeline
so they're swappable too.

## Sanity project

- Project ID: `u8d6w2kb` (existing project, "josh properties", Growth Trial plan)
- Dataset: `production` (public ACL — confirmed via Sanity management API)
- Credentials live in `.env.local` (git-ignored): `NEXT_PUBLIC_SANITY_PROJECT_ID`,
  `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_TOKEN`
  (Editor token, used only server-side for migration + preview, never exposed to client)

## Architecture

- `sanity/env.ts` — reads the env vars above, single source of truth
- `sanity/client.ts` — typed `createClient` instance (CDN-enabled for reads, no CDN for
  the token-authenticated write client used by the migration script)
- `sanity/image.ts` — `urlFor()` helper via `@sanity/image-url`
- `sanity/schemaTypes/` — one file per document type, indexed in `sanity/schemaTypes/index.ts`
- `sanity.config.ts` — Studio config (project id, dataset, schema, plugins: structure tool,
  vision tool for GROQ debugging)
- `app/studio/[[...tool]]/page.tsx` — mounts `NextStudio` from `next-sanity`, embedded at
  `/studio`. No separate deploy.
- `sanity/queries.ts` — every GROQ query used by the site, each fetch tagged for
  `revalidateTag` (e.g. `{ next: { tags: ["property"] } }`)
- `app/api/revalidate/route.ts` — POST endpoint, verifies Sanity's webhook signature
  (`@sanity/webhook` `isValidSignature`) against a shared secret, then calls
  `revalidateTag()` for the document type(s) in the payload
- `next.config.ts` — add `cdn.sanity.io` to `images.remotePatterns`

### Data flow

Page-level Server Components fetch content via GROQ and pass it down as props — the same
shape the client components already expect from `data/*.ts` today. Client components
(`Stats`, `Featured`, `Navbar`, `Footer`, `Offerings`, etc.) stop importing from
`data/*`/`lib/site` directly and instead receive the data as props from their parent page
or from `app/layout.tsx` (for the nav/footer/site-wide bits, which are needed on every
page).

This is a mechanical, low-risk refactor: the component internals (motion, JSX, styling)
don't change, only where the data comes from.

## Content model

### Collections (repeatable documents)

- **`property`** — `slug`, `folio`, `title`, `category` (villa/apartment/farmland),
  `location`, `price`, `area`, `beds?`, `status`, `image` (Sanity image), `gallery`
  (array of Sanity images), `short`, `narrative` (array of strings — one per paragraph),
  `specs` (array of `{label, value}`), `tall?`, `featured?`
- **`farmlandOption`** — `slug`, `name`, `area`, `price`, `status`, `acres`, `image`
  (Sanity image, replaces the current picsum-seed fallback used on `/farmlands`)
- **`testimonial`** — `quote`, `name`, `context`, `project`, `featured?`
- **`faq`** — `question`, `answer`, `order` (int, for manual ordering in Studio)
- **`stat`** — `value` (number), `suffix`, `prefix?`, `label`, `numeral`, `order`
- **`service`** — `slug`, `numeral`, `name`, `description`, `detail`, `href`, `order`
- **`processStep`** — `step`, `title`, `week`, `description`, `order`
- **`partnerLogo`** — `name`, `note`, `order`

`order` fields exist only where the current array order is meaningful and not otherwise
derivable (stats/services/process are numbered I–V already via their own field, so Studio's
drag-orderable list view is used instead of a redundant `order` int — kept consistent with
existing numerals).

### Singletons (one instance, no list view)

- **`siteSettings`** — `name`, `legalName`, `city`, `state`, `phone`, `phoneHref`,
  `whatsapp`, `email`, `address`, `hours`, `tagline`, `position`, `heroVideo`, `logo`
  (Sanity image), `navLinks` (array of `{label, href}`), `footerExploreLinks`,
  `footerGroundsLinks`, `rera` (`{registeredUnder, number, note}`), `enquireLabel`
- **`homePage`** — nested objects, one per section: `hero` (5 scene text groups —
  see risk note below), `trustStrip` (label text), `stats` (header label + folio range
  text), `featured` (heading, body), `offerings` (heading, body), `story` (folio label,
  heading, italic line, two body paragraphs, signoff), `farmlandBand` (heading, cta label),
  `whyJosh`, `process` (heading, body), `testimonials` (heading), `faq` (heading),
  `finalCta` (heading, body, cta label)
- **`categoryPage`** — `category` (villa/apartment/farmland, used as the doc's identity),
  `eyebrow`, `title`, `intro` — 3 documents, one per category page
- **`contactPage`** — heading, body, office block copy

### Field type decisions

- Body copy: plain `string`/`text` fields, not Portable Text. Matches the current data
  shapes exactly, keeps Studio simple. Can upgrade individual fields later if rich text
  (bold/links) becomes genuinely needed.
- Images: native Sanity `image` type with hotspot enabled (lets an editor recompose a crop
  without a code change, useful given `object-cover` is used everywhere).

### Known risk: hero choreography

`CinematicHero` drives 5 scroll-scrubbed text scenes with scroll-progress ranges tuned to
short, specific phrases ("Hyderabad", "THE TITLE / COMES FIRST."). Making these fields
free text in Studio means a much longer edit could visually overflow its `max-w` container
or throw off the timing feel. Studio field descriptions will note a recommended max length
per field, but the choreography itself is not CMS-adaptive — that would need a larger
rework of the hero component, out of scope here.

## Migration

`scripts/migrate-to-sanity.ts` — one-off, run once with `SANITY_API_TOKEN`:

1. Upload every file in `public/images/` (villa stills + the 4 new Sangareddy renders) as
   Sanity assets, keep a filename → asset reference map
2. Create all `property`, `farmlandOption`, `testimonial`, `faq`, `stat`, `service`,
   `processStep`, `partnerLogo` documents from the current `data/*.ts` contents, wiring in
   image references from step 1
3. Create the `siteSettings`, `homePage`, `categoryPage` (×3), `contactPage` singletons
   from `lib/site.ts` and the hardcoded strings currently in `Navbar.tsx`, `Footer.tsx`,
   and each section component
4. Print a summary (documents created, images uploaded) for manual verification in Studio

After manual confirmation that Studio shows everything correctly and the site renders
identically against Sanity data, `data/*.ts` and `lib/site.ts` are deleted. The migration
script stays in git history but is not part of the ongoing app.

## Revalidation

Site isn't statically exported (`next.config.ts` has no `output: "export"`), so ISR with
on-demand revalidation is viable on any Node-capable host (Vercel, etc.).

Once deployed, a Sanity webhook (configured in sanity.io/manage, pointed at
`https://<domain>/api/revalidate`) fires on every publish. The route verifies the
signature, reads the document `_type` from the payload, and calls `revalidateTag(_type)`.
Local dev doesn't need the webhook — data is always fetched fresh from Sanity's API.

## Out of scope (this pass)

- Visual/live preview (Sanity Presentation tool with draft overlays) — structured editing
  only for now, changes go live via the webhook within seconds of publish, not live as you
  type
- Portable Text / rich formatting
- Multi-language / localization
- Role-based Studio permissions beyond the single Editor token already issued
