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
