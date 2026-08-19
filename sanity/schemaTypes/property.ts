import { defineField, defineType } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  description:
    "One listing = one property page on the website. To add a new property, click \"Create new\" above, fill the form and press Publish. Add the private property details, drag & drop photos, and paste the YouTube link if there is a walkthrough video.",
  fields: [
    defineField({
      name: "title",
      title: "Name of the property",
      type: "string",
      description: "e.g. \"2 BHK Resale - Pragathi Nagar\"",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Leave this as it is - it becomes the web address. Click Generate if it is empty.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "folio",
      title: "Folio number",
      type: "string",
      description: "A short file number, e.g. \"JP-001\". Listings are shown in this order.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Which section should this appear under?",
      options: { list: ["villa", "apartment", "farmland"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. \"Pragathi Nagar, Hyderabad\"",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "e.g. \"₹56 Lakhs (Negotiable)\"",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "area",
      title: "Area / SFT",
      type: "string",
      description: "e.g. \"1,015 sq.ft\" or \"UDS 26 sq.yds\"",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "beds",
      title: "Beds (optional)",
      type: "string",
      description: "e.g. \"2 BHK\"",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Is it still for sale?",
      options: { list: ["Available", "Under Offer", "Sold"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Main photo",
      type: "image",
      description: "Drag & drop the main photo here. This is used on cards across the site.",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Photo gallery",
      type: "array",
      description:
        "Drag & drop more photos here. Drag to reorder - the first photo is shown first in the gallery.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube walkthrough video (optional)",
      type: "url",
      description:
        "Paste the YouTube link (from the address bar or Share > Copy). Leave empty if there is no video. The video will play on the property page.",
    }),
    defineField({
      name: "short",
      title: "Short description",
      type: "text",
      rows: 2,
      description: "One or two lines shown under the photo on the property page.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "narrative",
      title: "Full description",
      type: "array",
      description: "One paragraph per block. Click Add to write another paragraph.",
      of: [{ type: "text", rows: 3 }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "specs",
      title: "Key facts (the points table)",
      type: "array",
      description:
        "Each fact has a label and a value, e.g. Label: \"Approval\", Value: \"GP Approved & Gramapanchyath\". Click Add to add more.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", description: "e.g. \"Approval\"", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", description: "e.g. \"GP Approved\"", validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: "tall",
      title: "Tall card layout",
      type: "boolean",
      description: "Leave off unless you want the card to be a tall portrait shape.",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      description:
        "Turn on to show this on the homepage. Only the first 3 properties with this on (by folio order) appear there.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "image" },
  },
});
