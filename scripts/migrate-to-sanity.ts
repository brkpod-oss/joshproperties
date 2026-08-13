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

  await migrateSingletons(imageRefs);

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
