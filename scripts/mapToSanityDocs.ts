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
