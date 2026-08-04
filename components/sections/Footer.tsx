import { services } from "@/data/services";
import { site } from "@/lib/site";

const studioLinks = [
  { label: "The Studio", href: "#studio" },
  { label: "The Work", href: "#work" },
  { label: "The Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-carbon text-ivory">
      <div className="gold-rule-solid w-full opacity-60" />
      <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-20 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-medium tracking-tight">
              Victory <span className="italic text-gold">Atelier</span>
            </p>
            <p className="mt-4 max-w-[34ch] text-pretty text-[15px] leading-relaxed text-ivory/50">
              Interior design studio · Khammam · Est. 2012. In-house
              craftsmanship, line-itemed quotes, a ten-year warranty.
            </p>
          </div>

          <nav aria-label="Studio">
            <p className="eyebrow text-bronze">The Studio</p>
            <ul className="mt-5 space-y-3">
              {studioLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[15px] text-ivory/70 transition-colors hover:text-champagne"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Compositions">
            <p className="eyebrow text-bronze">Services</p>
            <ul className="mt-5 space-y-3">
              {services.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <a
                    href="#services"
                    className="text-[15px] text-ivory/70 transition-colors hover:text-champagne"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-bronze">Contact</p>
            <address className="mt-5 space-y-3 not-italic">
              <p className="text-[15px] leading-relaxed text-ivory/70">
                {site.address}
              </p>
              <p>
                <a href={site.phoneHref} className="text-[15px] text-ivory/70 transition-colors hover:text-champagne">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={site.whatsapp} className="text-[15px] text-ivory/70 transition-colors hover:text-champagne">
                  WhatsApp
                </a>
              </p>
              <p className="text-[13px] text-ivory/40">{site.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-6 border-t border-gold/15 pt-8 md:flex-row md:items-center">
          <p className="eyebrow text-bronze">
            Member, IIID · IGBC certified · Asian Paints Beautiful Homes Partner
          </p>
          <p className="text-[12px] text-ivory/35">
            © 2026 {site.name}. {site.legalName} · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
