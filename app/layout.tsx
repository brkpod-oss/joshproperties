import type { Metadata, Viewport } from "next";
import { display, body, mono } from "./fonts";
import { site } from "@/lib/site";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCta } from "@/components/FloatingCta";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://victoryatelier.in"),
  title: {
    default: "Victory Atelier — Interior Design Studio in Khammam",
    template: "%s · Victory Atelier",
  },
  description:
    "Twelve years. Five hundred homes. Khammam's interior design studio with in-house craftsmanship, line-itemed quotes, Vastu-aware design and a ten-year warranty.",
  keywords: [
    "interior design Khammam",
    "interior designers Telangana",
    "modular kitchen Khammam",
    "home interiors",
    "Vastu interior design",
    "Victory Interiors",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: "Victory Atelier — Interior Design Studio in Khammam",
    description: site.tagline,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://victoryatelier.in/#studio",
  name: site.name,
  legalName: site.legalName,
  description: site.position,
  foundingDate: "2012",
  address: {
    "@type": "PostalAddress",
    streetAddress: "H.No. 12-3-45",
    addressLocality: "Khammam",
    addressRegion: "Telangana",
    postalCode: "507001",
    addressCountry: "IN",
  },
  telephone: site.phone,
  email: site.email,
  openingHours: "Mo-Sa 10:00-19:00",
  priceRange: "₹₹₹",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-body text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#services"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-gold focus:px-5 focus:py-3 focus:text-carbon"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Cursor />
        <div className="film-grain" aria-hidden />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCta />
      </body>
    </html>
  );
}
