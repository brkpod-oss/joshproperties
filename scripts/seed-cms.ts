import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // skip if no .env.local
  }
}

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

loadEnvLocal();

const writeClient = createClient({
  projectId: must("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: must("NEXT_PUBLIC_SANITY_DATASET"),
  apiVersion: must("NEXT_PUBLIC_SANITY_API_VERSION"),
  token: must("SANITY_API_TOKEN"),
  useCdn: false,
});

const HOLDING_OPTIONS = [
  "A villa",
  "An apartment",
  "Farmland",
  "Private advisory",
  "NRI purchase",
  "Other",
];

const BUDGET_OPTIONS = ["Under ₹1 Cr", "₹1–3 Cr", "₹3–6 Cr", "₹6 Cr+", "Not sure yet"];

const DEFAULT_KEYWORDS = [
  "farmlands for sale Hyderabad",
  "villas in Hyderabad",
  "apartments Jubilee Hills",
  "agricultural land Telangana",
  "cleared title farmland",
  "Josh Properties",
];

const DEFAULT_ORG = {
  foundingYear: "2017",
  streetAddress: "Road No. 12",
  addressLocality: "Banjara Hills, Hyderabad",
  postalCode: "500034",
  openingHours: "Mo-Sa 10:00-19:00",
  priceRange: "₹₹₹",
};

async function seedSettings() {
  const patch = writeClient.patch("siteSettings");
  const result = await patch
    .setIfMissing({
      siteUrl: "https://joshproperties.in",
      ogTitle: "Josh Properties · Private Property Advisory",
      ogDescription:
        "A private real-estate advisory curating villas, apartments and cleared-title farmland across Hyderabad and Telangana. Verified titles, drone surveys, one concierge.",
      metaDescription:
        "Josh Properties is a private real-estate advisory curating villas, apartments and cleared-title farmland across Hyderabad and Telangana, with verified titles, drone surveys and a single concierge from first call to registration.",
      keywords: DEFAULT_KEYWORDS,
      legal: {
        disclaimer:
          "Josh Properties acts as an advisory and curation house for private real-estate holdings. All information is subject to verification of title and records before any payment is discussed. Nothing on this website constitutes legal, financial or investment advice.",
      },
      org: DEFAULT_ORG,
      socialLinks: [],
    })
    .commit();
  console.log("siteSettings: patched", result._id ?? "n/a");
}

async function seedEnquiryOptions() {
  const docs = [
    ...HOLDING_OPTIONS.map((label, i) => ({
      _id: `enq-holding-${i + 1}`,
      _type: "enquiryOption",
      label,
      group: "holding",
      order: i,
      active: true,
    })),
    ...BUDGET_OPTIONS.map((label, i) => ({
      _id: `enq-budget-${i + 1}`,
      _type: "enquiryOption",
      label,
      group: "budget",
      order: i,
      active: true,
    })),
  ];
  const tx = writeClient.transaction();
  for (const doc of docs) tx.createIfNotExists(doc);
  const result = await tx.commit();
  console.log(`enquiryOption: seeded ${docs.length} (results: ${result?.results?.length ?? "n/a"})`);
}

async function seedPropertyPage() {
  await writeClient
    .patch("propertyPage")
    .setIfMissing({
      factsOriginLabel: "Ground holdings",
      groundHeading: "Also in this ground",
      photosLabel: "Photographs",
      photosNote: "On request from the Private Advisory",
    })
    .commit();
  console.log("propertyPage: patched");
}

async function seedPropertiesPublished() {
  const existing = await writeClient.fetch(`*[_type == "property" && published == null]{_id, title}`);
  if (existing.length === 0) {
    console.log("property: published flag already set on all docs");
    return;
  }
  const tx = writeClient.transaction();
  for (const doc of existing) {
    tx.patch(doc._id, { set: { published: true } });
  }
  const result = await tx.commit();
  console.log(`property: set published=true on ${existing.length} (results: ${result?.results?.length ?? "n/a"})`);
}

const PROJECT_ID = "farmland-project-river-plate";

const PROJECT = {
  _id: PROJECT_ID,
  _type: "farmlandProject",
  name: "The River Plate",
  slug: { _type: "slug", current: "river-plate" },
  location: "Shankarpally, RR District",
  acres: "28 acres",
  river: true,
  note: "The river plate, surveyed 2025. Flown by drone, boundary-marked, shown by appointment.",
  order: 0,
  published: true,
};

const PLOTS = [
  { id: "A1", title: "Riverfront A1", size: "3.2 acres", phase: 1, status: "Available", x: 8, y: 16, order: 0 },
  { id: "A2", title: "Riverfront A2", size: "2.8 acres", phase: 1, status: "Available", x: 30, y: 16, order: 1 },
  { id: "A3", title: "Riverfront A3", size: "2.4 acres", phase: 1, status: "Reserved", x: 52, y: 16, order: 2 },
  { id: "A4", title: "Riverfront A4", size: "3.6 acres", phase: 1, status: "Sold", x: 74, y: 16, order: 3 },
  { id: "B1", title: "Plate B1", size: "3.0 acres", phase: 2, status: "Available", x: 8, y: 48, order: 4 },
  { id: "B2", title: "Plate B2", size: "2.6 acres", phase: 2, status: "Sold", x: 30, y: 48, order: 5 },
  { id: "B3", title: "Plate B3", size: "3.4 acres", phase: 2, status: "Available", x: 52, y: 48, order: 6 },
  { id: "B4", title: "Plate B4", size: "2.9 acres", phase: 2, status: "Reserved", x: 74, y: 48, order: 7 },
];

async function seedFarmland() {
  await writeClient.createIfNotExists(PROJECT);
  let createdPlots = 0;
  const tx = writeClient.transaction();
  for (const p of PLOTS) {
    const doc = {
      _id: `farmland-plot-${p.id.toLowerCase()}`,
      _type: "farmlandPlot",
      project: { _type: "reference", _ref: PROJECT_ID },
      id: p.id,
      title: p.title,
      size: p.size,
      phase: p.phase,
      status: p.status,
      x: p.x,
      y: p.y,
      order: p.order,
    };
    tx.createIfNotExists(doc);
    createdPlots++;
  }
  await tx.commit();
  console.log(`farmland: project "${PROJECT.name}" + ${createdPlots} plots`);
}

async function seedCategoryPageOutlook() {
  const ids: string[] = await writeClient.fetch(`*[_type == "categoryPage" && category == "apartment"]._id`);
  for (const id of ids) {
    await writeClient
      .patch(id)
      .setIfMissing({
        outlookKicker: "Outlook · day to night",
        outlookNote:
          "The skyline is the decoration. Drag the scrubber and watch the tower change with the light.",
      })
      .commit();
  }
  console.log(`categoryPage(apartment): outlook copy seeded (${ids.length} doc)`);
}

async function main() {
  await seedSettings();
  await seedEnquiryOptions();
  await seedPropertyPage();
  await seedPropertiesPublished();
  await seedFarmland();
  await seedCategoryPageOutlook();
  console.log("Seed complete.");
  process.stdin.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});