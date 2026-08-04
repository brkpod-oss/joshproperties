export type PropertyCategory = "villa" | "apartment" | "farmland";

export type Spec = { label: string; value: string };

export type Property = {
  slug: string;
  title: string;
  category: PropertyCategory;
  location: string;
  price: string;
  area: string;
  beds?: string;
  status: "Available" | "Under Offer" | "Sold";
  seed: string;
  short: string;
  narrative: string[];
  specs: Spec[];
  tall?: boolean;
  featured?: boolean;
};

export const properties: Property[] = [
  {
    slug: "jubilee-house",
    title: "The Jubilee House",
    category: "villa",
    location: "Jubilee Hills, Hyderabad",
    price: "₹12.5 Cr",
    area: "8,400 sq.ft",
    beds: "5 BHK",
    status: "Available",
    seed: "josh-jubilee-house",
    tall: true,
    featured: true,
    short:
      "A five-bedroom villa set on a serene half-acre plot, finished in Teakwood and Jaisalmer stone.",
    narrative: [
      "The Jubilee House stands on one of Jubilee Hills' quietest lanes, reached only by foot from the road below. Every window frames a canopy of tamarind and rain trees that predate the house by forty years.",
      "The interior is a study in restraint: Jaisalmer stone floors, oiled teak joinery, and vast, still planes of lime plaster. A 5.4-metre ceiling lifts the living floor and lets the late light fall, unhurried, across the day.",
      "Two wings share one roofline but live as separate houses: a private suite at the east, guest rooms at the west, joined by a court whose only book is the sky.",
    ],
    specs: [
      { label: "Built-up", value: "8,400 sq.ft" },
      { label: "Plot", value: "1,200 sq.yd" },
      { label: "Bedrooms", value: "5 + study" },
      { label: "Vastu", value: "East-facing, verified" },
      { label: "Title", value: "Clear, full chain" },
      { label: "Garden", value: "1,800 sq.ft" },
    ],
  },
  {
    slug: "kokapet-retreat",
    title: "The Kokapet Retreat",
    category: "villa",
    location: "Kokapet, Hyderabad",
    price: "₹6.8 Cr",
    area: "6,400 sq.ft",
    beds: "4 BHK",
    status: "Available",
    seed: "josh-kokapet",
    short:
      "A four-bedroom modern villa minutes from T-Hub and the outer ring road.",
    narrative: [
      "Twenty minutes from the Financial District yet wrapped in its own treeline, the Kokapet Retreat is built for a family that wants the city and the silence in the same week.",
      "A double-height court draws the evening light to the centre, then lets it run across a reflecting pool that fronts the whole rear elevation.",
    ],
    specs: [
      { label: "Built-up", value: "6,400 sq.ft" },
      { label: "Plot", value: "900 sq.yd" },
      { label: "Bedrooms", value: "4 + family lounge" },
      { label: "Title", value: "Clear, full chain" },
      { label: "Parking", value: "2 covered" },
    ],
  },
  {
    slug: "medchal-farmhouse",
    title: "The Medchal Farmhouse",
    category: "villa",
    location: "Medchal, Hyderabad",
    price: "₹4.2 Cr",
    area: "5,200 sq.ft + 1.2 ac",
    beds: "4 BHK",
    status: "Under Offer",
    seed: "josh-medchal",
    short:
      "A farmhouse villa on 1.2 acres of orchard, with rooms opening onto citrus groves.",
    narrative: [
      "A farmhouse proper: 1.2 acres of mango and citrus set back from the Medchal–Kompally road, with a single four-bedroom house at its quiet centre.",
      "The verandah is 3.6 metres deep, wide enough to read, dine and watch the orchard do its slow work. Ownership runs to the full acreage, not a measured garden.",
    ],
    specs: [
      { label: "Built-up", value: "5,200 sq.ft" },
      { label: "Land", value: "1.2 acres" },
      { label: "Bedrooms", value: "4 + study" },
      { label: "Water", value: "Borewell + tank" },
      { label: "Title", value: "Agricultural, clear" },
    ],
  },
  {
    slug: "skyline-penthouse",
    title: "The Skyline Penthouse",
    category: "apartment",
    location: "Financial District, Hyderabad",
    price: "₹7.9 Cr",
    area: "4,100 sq.ft",
    beds: "4 BHK",
    status: "Available",
    seed: "josh-skyline",
    featured: true,
    short:
      "A double-height penthouse overlooking the Financial District skyline at night.",
    narrative: [
      "At 46 storeys the Skyline Penthouse holds the most private address in the Financial District: an entire floor, a private lobby lift, and a double-height living volume that turns the dusk skyline into a mural.",
      "By night the city becomes the decoration: the north glass wall recedes and a ring of district towers glows like a lit racetrack around the horizon.",
    ],
    specs: [
      { label: "Terrace", value: "1,200 sq.ft private" },
      { label: "Bedrooms", value: "4 + utility" },
      { label: "Lifts", value: "Private lobby" },
      { label: "Parking", value: "3 reserved" },
      { label: "Title", value: "Clear, full chain" },
    ],
  },
  {
    slug: "park-residences",
    title: "The Park Residences",
    category: "apartment",
    location: "Gachibowli, Hyderabad",
    price: "₹3.1 Cr",
    area: "2,750 sq.ft",
    beds: "3 BHK",
    status: "Available",
    seed: "josh-park",
    short:
      "A three-bed residence set back from the ring road, overlooking a planted green median.",
    narrative: [
      "Across from a working park, the Park Residences forces none of its light. North-east orientation, deep aprons, and windows that lower to sit height keep the afternoons cool without air-conditioning.",
    ],
    specs: [
      { label: "Built-up", value: "2,750 sq.ft" },
      { label: "Bedrooms", value: "3 + study" },
      { label: "Floor", value: "7 of 14" },
      { label: "Amenity", value: "Club + pool" },
    ],
  },
  {
    slug: "boulevard-duplex",
    title: "The Boulevard Duplex",
    category: "apartment",
    location: "Banjara Hills, Hyderabad",
    price: "₹4.6 Cr",
    area: "3,400 sq.ft",
    beds: "3 BHK",
    status: "Available",
    seed: "josh-boulevard",
    short:
      "A duplex on the oldest tree-lined avenue in Banjara Hills.",
    narrative: [
      "Banjara Hills in miniature: a maisonette on Boulevard Road with stairs that do the quiet work of a proper house, balconies on three faces, and a corner study where the street's neem trees arrive at the window.",
    ],
    specs: [
      { label: "Built-up", value: "3,400 sq.ft" },
      { label: "Bedrooms", value: "3 + den" },
      { label: "Floors", value: "Duplex" },
      { label: "Title", value: "Clear, full chain" },
    ],
  },
  {
    slug: "shadkaralle-green-belt",
    title: "Shadkaralle Green Belt",
    category: "farmland",
    location: "Shankarpally, Hyderabad",
    price: "₹60 L / acre",
    area: "28 acres · 4.8 acres/plot",
    status: "Available",
    seed: "josh-shankarpally",
    short:
      "Cleared-title farmland anchored against a forest green belt, 90 minutes from the city.",
    narrative: [
      "A 28-acre green belt ten minutes west of the Outer Ring Road at Macha Bollaram, offered as 5-acre family plots or one holding.",
      "Borewell water at 280 feet, a protected forest boundary on three sides, and black soil that wants orchards. Every title is cleared before a rupee is paid or a plot marked.",
    ],
    specs: [
      { label: "Plot", value: "from 4.8 acres" },
      { label: "Price", value: "₹2.2 Cr / 5 acres" },
      { label: "Title", value: "Clear RTC, verified" },
      { label: "Water", value: "Borewell permitted" },
      { label: "Boundary", value: "Survey + fencing" },
    ],
  },
  {
    slug: "moinabad-plots",
    title: "Moinabad Plot Enclave",
    category: "farmland",
    location: "Moinabad, Hyderabad",
    price: "₹1.45 Cr / 3 ac",
    area: "3 acres / plot",
    status: "Under Offer",
    seed: "josh-moinabad",
    featured: true,
    short:
      "A compact 3-acre enclave on the approach to the lake district.",
    narrative: [
      "Sixteen plots on the gentle plateau above Moinabad lake, each between two and three acres. The road frontage is thirty metres, and the sub-soil is the same granite shelf that holds the lake in place.",
      "A drone grid survey has already laid the boundaries; the phases move only as the soil moves.",
    ],
    specs: [
      { label: "Plot", value: "2–3 acres" },
      { label: "Price", value: "₹1.6 Cr / 2 ac" },
      { label: "Road", value: "30 m frontage" },
      { label: "Title", value: "Clear RTC, verified" },
      { label: "Status", value: "Phase 1 · 2 plots left" },
    ],
  },
  {
    slug: "chevella-river-plate",
    title: "Chevella River Plate",
    category: "farmland",
    location: "Chevella, Hyderabad",
    price: "₹3.6 Cr open",
    area: "6 acres",
    status: "Available",
    seed: "josh-chevella",
    short:
      "A whole six-acre run on the Munneru rivercourse, open and unencumbered.",
    narrative: [
      "A rare intact holding: six acres running to the Munneru's seasonal rivercourse, with water today at nine metres. Also open, so the tree plan and the house plan are yours to draw.",
    ],
    specs: [
      { label: "Area", value: "6 acres" },
      { label: "Price", value: "₹3.6 Cr open" },
      { label: "Water", value: "River frontage" },
      { label: "Title", value: "Open RTC, verified" },
    ],
  },
];

export const categories: {
  slug: PropertyCategory;
  name: string;
  blurb: string;
  count: number;
}[] = [
  { slug: "villa", name: "Villas", blurb: "Houses on quiet, tree-lined plots.", count: 3 },
  { slug: "apartment", name: "Apartments", blurb: "Altitudes made private.", count: 3 },
  { slug: "farmland", name: "Farmlands", blurb: "Cleared-title land, surveyed by drone.", count: 3 },
];

export function getProperty(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function getByCategory(category: PropertyCategory) {
  return properties.filter((p) => p.category === category);
}

export const featuredProperties = properties.filter((p) => p.featured);