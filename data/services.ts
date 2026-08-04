export type Service = {
  slug: string;
  numeral: string;
  name: string;
  description: string;
  detail: string;
  href: string;
};

export const services: Service[] = [
  {
    slug: "villas",
    numeral: "I",
    name: "Villas",
    description: "Houses on quiet, tree-lined plots, from first viewing to keys.",
    detail:
      "Freehold villas across Jubilee Hills, Kokapet and Medchal. Each home is shown with its full title chain, verified by an independent counsel before a single rupee moves.",
    href: "/villas",
  },
  {
    slug: "apartments",
    numeral: "II",
    name: "Apartments",
    description: "Altitudes made private, from penthouses to park residences.",
    detail:
      "A small, curated list of apartments and penthouses in the city's sharpest towers, chosen for light, outlook and the quietness of the corridor, not commission.",
    href: "/apartments",
  },
  {
    slug: "farmlands",
    numeral: "III",
    name: "Farmlands",
    description: "Cleared-title agricultural land, surveyed by drone.",
    detail:
      "Over 1,200 acres of farmland across Shankarpally, Moinabad, Chevella and beyond, each holding flown, boundary-surveyed and title-verified before it is offered.",
    href: "/farmlands",
  },
  {
    slug: "advisory",
    numeral: "IV",
    name: "Private Advisory",
    description: "For buyers who want counsel, not a sales pitch.",
    detail:
      "Land acquisition, exit planning and NRI purchase management. You get the same opinion we give ourselves, even when it means advising you not to buy.",
    href: "/contact",
  },
];