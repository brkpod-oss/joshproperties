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
      "We live in Dubai and bought a flat in Khammam in 2023. We needed a designer who could handle everything without us being there. They did our 2,800 sq.ft home in 14 weeks, sent weekly videos, and handed over a home we walked into with our kids — without a single thing to fix.",
    name: "The Reddy Family",
    context: "Dubai + Khammam",
    project: "The Reddy Home · 2,800 sq.ft",
    featured: true,
  },
  {
    quote:
      "I'd been to Livspace in Hyderabad and almost signed. Then I met Victory Atelier and saw the same quality for thirty percent less, with a team I could actually call. Three years in, our home still feels new.",
    name: "The Iyer Family",
    context: "Khammam",
    project: "The Iyer Apartment",
  },
  {
    quote:
      "Three other designers gave my mother generic layouts. Victory's designer sat with her for two hours, asked about the rituals she performs, the deities she prays to. The result is a pooja room my mother calls perfect.",
    name: "The Krishnan Family",
    context: "Khammam",
    project: "The Krishnan Pooja Room",
  },
  {
    quote:
      "They told us the project would take 14 weeks. It took 14 weeks. They said Häfele hinges. The hinges have Häfele stamped on them. This is what an interior firm should be.",
    name: "The Sharma Family",
    context: "Warangal",
    project: "The Sharma Kitchen",
  },
];
