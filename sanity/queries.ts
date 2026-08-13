import { client } from "./client";

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
