<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Josh Properties

Marketing site for **Josh Properties**, a luxury real-estate house in Hyderabad, Telangana — villas, apartments and farmland. Curated listings, an interactive farmland masterplan, and a dossier-gated concierge contact flow. No backend.

## Stack

- **Next.js 16.2.12** (App Router), React 19, TypeScript (strict)
- **Tailwind CSS v4** — `@import "tailwindcss"` + `@theme inline` tokens in `app/globals.css`
- **motion** (`motion/react`) for animation — not `framer-motion`
- **Lenis** smooth scroll, **lucide-react** icons, **clsx** + **tailwind-merge** via `cn()`
- `next.config.ts` sets `turbopack.root` to the repo to silence the multiple-lockfile warning.

## Commands

- `npm run dev` — dev server
- `npm run build` / `npm run start` — production
- `npm run lint` — ESLint (strict: `react-hooks/set-state-in-effect` and `react-hooks/refs` errors are on)
- No test suite configured.

## Architecture

- `app/page.tsx` — landing page; sections in a fixed order (Hero → TrustStrip → Stats → Featured → Offerings → Story → FarmlandBand → WhyJosh → Process → Testimonials → Faq → FinalCta)
- `app/layout.tsx` — metadata, JSON-LD (`RealEstateAgent`), Navbar, Footer, FloatingCta, SmoothScroll, ScrollProgress, Cursor, PageTransition, film-grain overlay
- `app/villas/`, `app/apartments/`, `app/farmlands/` — category listing pages
- `app/properties/[slug]/` — detail page for a single property (`generateStaticParams`, async `params: Promise<{ slug }>`); all 9 properties prerender at build
- `app/contact/` — concierge page + `ContactForm.tsx`
- `components/sections/` — one component per landing/page section (incl. `PageHero`)
- `components/ui/` — reusable primitives: `Button`, `MagneticButton`, `ChapterMarker`
- `components/motion/` — animation primitives: `Reveal`, `RevealMask`, `MaskLines`, `Parallax`, `CountUp`, `ScrollProgress`, `Cursor`, `SmoothScroll`, `PageTransition`
- `components/` (page-level) — `PropertyCard`, `PropertyListing`, `Gallery`, `FarmlandMap`, `DayNightCity`, `DossierForm`, `FloatingCta`
- `data/` — typed content files: `properties`, `farmland`, `stats`, `promises`, `services`, `process`, `partners`, `testimonials`, `faqs`
- `lib/site.ts` — single source of truth for brand config (name, phone, WhatsApp, email, address, hours, links, heroVideo)
- `lib/utils.ts` — `cn()` class merger
- Path alias `@/*` maps to the repo root (see `tsconfig.json`).

## Rules

- **Content lives in `data/*.ts` and `lib/site.ts` — never hardcode copy into components.** Edit those files to change marketing text, properties, stats, plots, etc.
- Components that use hooks, `motion`, Lenis, or event listeners must start with `"use client"`. Server components stay client-free (e.g. `Hero` reads `public/hero.mp4` via `existsSync`/`process.cwd()` and must NOT be a client component).
- Interactive surfaces (`a`, `button`, form controls) have `cursor: none` on fine pointers — don't fight the custom cursor.
- **Forms have no backend:** `ContactForm` and `DossierForm` compose a message and open a `wa.me` deep link (`site.whatsapp`) with the user's replies. Keep that flow.
- Images are `picsum.photos` placeholders keyed by a `seed` string (e.g. `josh-park`), allowlisted in `next.config.ts`. Use `next/image` with a unique, descriptive seed.
- Property `narrative` is `string[]`; wrap single paragraphs in `[...]`.
- **Placeholders to replace for launch:** phone/WhatsApp/email in `lib/site.ts`, the hero video at `public/hero.mp4` (site falls back to a picsum poster), and the office map block on `/contact`.

## Motion conventions

- Import from `motion/react`. Use `useReducedMotion()` in every animated component and disable/degrade motion when true.
- Standard ease curve: `[0.16, 1, 0.3, 1]`. Durations ~0.5–1s; springs for pointer-reactive motion (Cursor, MagneticButton).
- Reuse the primitives in `components/motion/` (e.g. `Reveal`, `RevealMask`, `MaskLines`) before writing bespoke animations.
- `SmoothScroll` (Lenis), `ScrollProgress`, `Cursor`, and `PageTransition` mount once in the root layout; all self-disable or degrade under reduced motion / coarse pointers.
- **Custom cursor + labels:** the global `Cursor` reads a `data-cursor="Label"` attribute and shows that label inside the ring. `PropertyCard` uses `Explore` (villa), `Explore`/darken (apartment), `Explore` (farmland); `Gallery` uses `Drag`; `FarmlandMap` uses `View`. Don't override `cursor: none` for these.
- **Page transitions:** `Button` renders `next/link` for internal paths (starts with `/`, not `#` or `http`), enabling client-side nav with the `PageTransition` curtain. Keep cross-page links internal so there are no white flashes.
- **Category signatures:** villas get a gentle scale+brightness hover; apartments get a deeper zoom with a dark city-night radial overlay (`DayNightCity` is the apartments signature scrubber, day→night); farmland gets a strong slow zoom. Preserve these.

## Design system

The site speaks a **heritage-registry / title-office** language: cold paper and stone, ink type, and an emerald "seal" green. Every surface should read as an artifact of a private land registry — a folio, a ledger, a deed, a stamp — not as a generic marketing page.

- **Colors are Tailwind theme tokens in `app/globals.css`:** `paper #f5f6f5`, `stone #e9ebe9`, `mist #dde0de`, `slate #646b67`, `ink #1c1e20`, `graphite #26282b`, `carbon #111315`, `chrome #b9bfc3`, `sage #9cc6ad` (dark-mode accent), `emerald #1f6a4a` (seal/verified — the ONE accent), `pine #173f2e` (emerald hover/dark). Use tokens, not raw hex.
- **Fonts load via `next/font` in `app/fonts.ts`:** `Cormorant Garamond` (display), `Schibsted Grotesk` (body — no 300 weight; use 400–600), `JetBrains Mono` (mono/registry metadata). Exposed as `font-display`, `font-body`, `font-mono`.
- **Registry devices (reuse, don't re-invent):**
  - `components/ui/Seal.tsx` — circular JP monogram seal ("Josh Properties · Private Advisory"). Use as watermark (large, `text-paper/[0.07]` on dark, `text-emerald/[0.07]` on paper) or as a small brand mark.
  - `components/ui/Stamp.tsx` — corner stamp with tones `available` (emerald), `sold` (slate, rotated), `reserved` (chrome), `muted`. Used on `PropertyCard` for status.
  - `components/motion/Parallax.tsx` — `useScroll`/`useTransform` y-parallax; wrap images in `absolute inset-[-12%]` inside an `overflow-hidden` container. Disables under reduced motion.
  - Double-frame "document" cards: `border border-ink/15 outline outline-1 outline-ink/10 outline-offset-[3px]` (Story folio, Stats ledger, Footer deed band).
- **Utilities in `globals.css`:** `.eyebrow` (mono, 11px, 0.22em, uppercase), `.stamp` (mono, 9px, 0.2em, uppercase), `.rule-solid`, `.vignette`, `.film-grain`, `.animate-marquee`, `heroZoom`.
- **Copy discipline (anti-slop):** NO em-dashes (use commas/colons/periods; en-dashes only in numeric ranges like `₹1–3 Cr`). No "Khammam", "Victory Atelier", "coordination charges" (except the deliberate FAQ line), no eyebrow on every section.
- **Eyebrow restraint:** max ~1 eyebrow per 3 sections. Home page currently uses three: hero kicker, "The collection" (Featured), "The farmland" (FarmlandBand). Don't add more.
- **Shape lock:** all-sharp system (radius 0–2px). No rounded cards; the only circles are the Seal. Timelines use sharp index squares, not circles.
- **Respect `prefers-reduced-motion` global CSS and the marquee fallback.**
- **Dark/light arc:** dark opening (Hero/Stats), long light "documents" chapter (Featured→Faq), dark close (FarmlandBand/FinalCta). Keep this triptych; don't scatter dark sections through the light chapter.

## SEO / metadata

- Set per-page `Metadata` via `export const metadata` in each `page.tsx` (see `layout.tsx` for site-wide defaults, `app/properties/[slug]/page.tsx` for dynamic per-property metadata).
- Update `lib/site.ts` if business details change (phone, hours, address, schema JSON-LD in layout).
