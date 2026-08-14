import type { Metadata, Viewport } from "next";
import { display, body, mono } from "../fonts";
import { getSiteSettings } from "@/sanity/queries";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCta } from "@/components/FloatingCta";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { PremiumCursor } from "@/components/motion/PremiumCursor";
import { PageTransition } from "@/components/motion/PageTransition";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://joshproperties.in"),
  title: {
    default: "Josh Properties · Villas, Apartments & Farmlands in Hyderabad",
    template: "%s · Josh Properties",
  },
  description:
    "Josh Properties is a private real-estate advisory curating villas, apartments and cleared-title farmland across Hyderabad and Telangana, with verified titles, drone surveys and a single concierge from first call to registration.",
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
    siteName: "Josh Properties",
    title: "Josh Properties · Villas, Apartments & Farmlands in Hyderabad",
    description: "Curators of Hyderabad's finest villas, apartments and farmlands.",
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
  themeColor: "#faf8f3",
  width: "device-width",
  initialScale: 1,
  // Extend into the notched/hole-punch area on phones so fixed chrome
  // (nav, floating CTA, lightbox) can pad against real safe-area insets.
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  if (!settings) {
    throw new Error("siteSettings document is missing — check Sanity Studio");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://joshproperties.in/#agency",
    name: settings.name,
    legalName: settings.legalName,
    description: settings.position,
    foundingDate: "2017",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Road No. 12",
      addressLocality: "Banjara Hills, Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500034",
      addressCountry: "IN",
    },
    telephone: settings.phone,
    email: settings.email,
    openingHours: "Mo-Sa 10:00-19:00",
    priceRange: "₹₹₹",
  };

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
        <PremiumCursor />
        <PageTransition />
        <div className="film-grain" aria-hidden />
        <Navbar settings={settings} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
        <FloatingCta whatsapp={settings.whatsapp} />
      </body>
    </html>
  );
}
