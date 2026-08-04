export type Service = {
  slug: string;
  numeral: string;
  name: string;
  description: string;
  detail: string;
  seed: string;
  projectCount: number;
};

export const services: Service[] = [
  {
    slug: "full-home-interiors",
    numeral: "I",
    name: "Full Home Interiors",
    description:
      "The signature offering — a complete home, designed and built line by line.",
    detail:
      "Space planning, custom furniture, modular kitchen, wardrobes, false ceiling, lighting, finishes and final styling. A dedicated project manager from first sketch to handover, with a 10-year structural warranty.",
    seed: "victory-living-room",
    projectCount: 48,
  },
  {
    slug: "modular-kitchens",
    numeral: "II",
    name: "Modular Kitchens",
    description:
      "L, U, parallel or island — laid out after a 90-minute audit of how you actually cook.",
    detail:
      "Exclusive Häfele and Hettich hardware, never knockoffs. Granite, quartz, marble or solid-surface countertops. Designed in-house, fabricated in our own 4,500 sq.ft workshop.",
    seed: "victory-kitchen",
    projectCount: 36,
  },
  {
    slug: "wardrobes-storage",
    numeral: "III",
    name: "Wardrobes & Storage",
    description:
      "Per-room, per-person. We design around the contents of your current wardrobe.",
    detail:
      "Hinged, sliding, walk-in, loft, his-and-hers. Pull-outs, jewelry trays, shoe racks, internal lighting — every fitting chosen with you.",
    seed: "victory-wardrobe",
    projectCount: 42,
  },
  {
    slug: "tv-units",
    numeral: "IV",
    name: "TV Units & Walls",
    description:
      "Treated as architecture, not furniture — the first thing a guest sees.",
    detail:
      "Floor-mounted, floating, full-wall panelling, fireplace or bar integrations. Fluted panels, veneer, stone cladding, brass inlay. Concealed wiring as standard.",
    seed: "victory-tv-wall",
    projectCount: 31,
  },
  {
    slug: "pooja-units",
    numeral: "V",
    name: "Pooja Units",
    description:
      "Over four hundred designed in twelve years — reviewed by our in-house Vastu consultant.",
    detail:
      "Wall-mounted, temple-style, walk-in rooms, or pooja-study combinations. Burmese teak, brass fittings, concealed lighting. Placement and direction checked against your family's traditions.",
    seed: "victory-pooja",
    projectCount: 44,
  },
  {
    slug: "painting-finishes",
    numeral: "VI",
    name: "Painting & Finishes",
    description:
      "A dedicated finishing supervisor — because a wrong paint job ruins a right design.",
    detail:
      "Asian Paints Royale, texture finishes, imported wallpaper, Italian lime wash. Three coats minimum, seven-day cure, floors masked, no over-spray.",
    seed: "victory-finish",
    projectCount: 29,
  },
];
