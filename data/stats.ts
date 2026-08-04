export type Stat = {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  numeral: string;
};

export const stats: Stat[] = [
  { value: 1200, suffix: "+", label: "Acres of farmlands curated", numeral: "I" },
  { value: 4800, suffix: "", label: "Villas, homes & plots delivered", numeral: "II" },
  { value: 98, suffix: "%", label: "Clear-title deals closed", numeral: "III" },
  { value: 9, suffix: "", label: "Years of quiet advisory", numeral: "IV" },
];