export type Testimonial = {
  quote: string;
  name: string;
  context: string;
  project: string;
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We bought two five-acre plots at Shankarpally without once visiting the site. Josh flew the land, sent us the survey, and registered everything over three video calls from Dubai. Eighteen months later the title is still the cleanest paper I hold.",
    name: "The Anand Family",
    context: "Dubai + Hyderabad",
    project: "Shankarpally · 10 acres",
    featured: true,
  },
  {
    quote:
      "Three developers had shown us the same villa with three different price stories. Josh showed it once, with the full title chain on the table, and the number they quoted was the number on the sale deed.",
    name: "Dr. Meera K",
    context: "Jubilee Hills",
    project: "The Jubilee House",
  },
  {
    quote:
      "They advised us not to buy the first two properties we liked. That honesty is why we closed the third without hesitation.",
    name: "The Rao Family",
    context: "Hyderabad",
    project: "Banjara Hills duplex",
  },
  {
    quote:
      "The concierge walked us through registration like it was a rehearsal: every document in order, every fee itemised. We were in and out of the sub-registrar in under an hour.",
    name: "The Pillai Family",
    context: "Chennai + Hyderabad",
    project: "Moinabad · 2 acres",
  },
];