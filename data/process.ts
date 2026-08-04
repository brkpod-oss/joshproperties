export type ProcessStep = {
  step: string;
  title: string;
  week: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "I",
    title: "Consultation",
    week: "Week 0",
    description: "A 60-minute conversation in our studio or your home. We listen — how the family lives, what frustrates it, what the budget reality is.",
  },
  {
    step: "II",
    title: "Site Visit",
    week: "Week 1",
    description: "Laser-measured floor plan, a fifty-photo survey, a Vastu audit. We measure and photograph before we ever propose.",
  },
  {
    step: "III",
    title: "Concept Design",
    week: "Weeks 2–3",
    description: "Two full concept directions — plans, renders of three key rooms, material and lighting palettes. You choose, or mix.",
  },
  {
    step: "IV",
    title: "Detailed Design",
    week: "Weeks 4–6",
    description: "Every room in detail. Working drawings for the workshop, material specifications with vendor and price, a line-itemed quote.",
  },
  {
    step: "V",
    title: "Execution",
    week: "Weeks 7–13",
    description: "Our craftsmen build in our workshop and install on site. Weekly photo and video updates, a site walk every Saturday.",
  },
  {
    step: "VI",
    title: "Final Handover",
    week: "Week 14",
    description: "A documented walkthrough, snags fixed within seven days, warranty cards, maintenance guide — and the keys to a finished home.",
  },
];
