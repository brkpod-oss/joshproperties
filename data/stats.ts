export type Stat = {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  numeral: string;
};

export const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Homes composed", numeral: "I" },
  { value: 12, suffix: "+", label: "Years of practice", numeral: "II" },
  { value: 64, suffix: "%", label: "Referral rate", numeral: "III" },
  { value: 10, suffix: "", label: "Year warranty on built-in work", numeral: "IV" },
];
