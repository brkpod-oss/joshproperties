export type Plot = {
  id: string;
  phase: number;
  size: string;
  status: "Available" | "Sold" | "Reserved";
  x: number;
  y: number;
};

export type FarmlandOption = {
  slug: string;
  name: string;
  area: string;
  price: string;
  status: "Available" | "Under Offer" | "Limited";
  acres: string;
  droneSeed: string;
};

export const masterplan: {
  name: string;
  river: boolean;
  plots: Plot[];
} = {
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
};

export const farmlandOptions: FarmlandOption[] = [
  {
    slug: "shankarpally-green-belt",
    name: "Shankarpally Green Belt",
    area: "5 acres",
    price: "₹2.2 Cr",
    status: "Available",
    acres: "28 acres total",
    droneSeed: "josh-shankarpally",
  },
  {
    slug: "moinabad-enclave",
    name: "Moinabad Enclave",
    area: "2–3 acres",
    price: "₹1.6 Cr",
    status: "Limited",
    acres: "2 plots left · Phase 1",
    droneSeed: "josh-moinabad",
  },
  {
    slug: "chevella-river-plate",
    name: "Chevella River Plate",
    area: "6 acres",
    price: "₹3.6 Cr",
    status: "Available",
    acres: "6 acres open",
    droneSeed: "josh-chevella",
  },
  {
    slug: "wyra-tract",
    name: "Wyra Tract",
    area: "10 acres",
    price: "₹4.4 Cr",
    status: "Under Offer",
    acres: "10 acres · full holding",
    droneSeed: "josh-wyra",
  },
];