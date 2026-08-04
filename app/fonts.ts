import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";

export const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});
