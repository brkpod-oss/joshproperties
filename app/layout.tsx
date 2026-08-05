import type { Metadata, Viewport } from "next";
import { display, body, mono } from "./fonts";
import { site } from "@/lib/site";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCta } from "@/components/FloatingCta";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { PageTransition } from "@/components/motion/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://joshproperties.in"),
  title: {
    default: "Josh Properties · Villas, Apartments & Farmlands in Hyderabad",
    template: "%s · Josh Properties",
  },
  description: site.position,
  keywords: [
    "farmlands for sale Hyderabad",
    "villas in Hyderabad",
    "apartments Jubilee Hills",
    "agricultural land Telangana",
    "cleared title farmland",
    "Josh Properties",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: "Josh Properties · Villas, Apartments & Farmlands in Hyderabad",
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
  themeColor: "#f8f5f0",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "https://joshproperties.in/#agency",
  name: site.name,
  legalName: site.legalName,
  description: site.position,
  foundingDate: "2017",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Road No. 12",
    addressLocality: "Banjara Hills, Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500034",
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
      <body className="flex min-h-full flex-col bg-paper font-body text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-emerald focus:px-5 focus:py-3 focus:text-carbon"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <PageTransition />
        <div className="film-grain" aria-hidden />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingCta />
      </body>
    </html>
  );
}
