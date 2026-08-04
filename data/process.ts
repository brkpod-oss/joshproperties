export type ProcessStep = {
  step: string;
  title: string;
  week: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "I",
    title: "The First Call",
    week: "Day 0",
    description:
      "A 30-minute call: what you are looking for, where, and the budget you mean, not the one you say. If we cannot serve it, we say so on the first call.",
  },
  {
    step: "II",
    title: "Private Viewing",
    week: "Day 3–7",
    description:
      "An appointment-only viewing, scheduled around you. For farmlands, a drone flight is scheduled and the boundaries walked with a surveyor before you decide.",
  },
  {
    step: "III",
    title: "Title & Survey",
    week: "Week 2",
    description:
      "Independent counsel runs the full chain of title, revenue records and survey maps. You receive the audit before any payment is discussed.",
  },
  {
    step: "IV",
    title: "Offer & Dossier",
    week: "Week 3",
    description:
      "A line-itemed offer: price, registration, stamp duty, survey, fencing. The dossier is yours to keep, whether you buy or not.",
  },
  {
    step: "V",
    title: "Booking & Registration",
    week: "Week 4–6",
    description:
      "Token booking, then registration at the sub-registrar with our counsel at your side. The land or home changes hands the way it should: in writing, in full.",
  },
];