import Image from "next/image";
import { site } from "@/lib/site";

const explore = [
  { label: "Villas", href: "/villas" },
  { label: "Apartments", href: "/apartments" },
  { label: "Farmlands", href: "/farmlands" },
  { label: "The Collection", href: "#collection" },
  { label: "Enquire", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-carbon text-paper">
      {/* Slow champagne glow, barely perceptible */}
      <div
        aria-hidden
        className="animate-[footerGlow_14s_ease-in-out_infinite_alternate] pointer-events-none absolute -top-48 right-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(193,163,109,0.16),transparent_70%)]"
      />
      {/* Large magazine wordmark */}
      <div aria-hidden className="pointer-events-none relative select-none">
        <p className="px-6 text-center font-display text-[clamp(5rem,17vw,15rem)] font-light leading-[0.8] tracking-[0.1em] text-paper/[0.045]">
          JOSH
        </p>
      </div>

      <div className="rule-solid relative w-full opacity-60" />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-10 pt-20 sm:px-12 lg:px-20">
        <div className="mb-20 border border-paper/15 outline outline-1 outline-paper/10 outline-offset-[3px] px-6 py-8 sm:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p className="stamp text-slate">Registered</p>
              <p className="mt-3 text-[14px] leading-relaxed text-paper/60">
                Real Estate (Regulation and Development) Act, 2016
              </p>
            </div>
            <div>
              <p className="stamp text-slate">RERA number</p>
              <p className="mt-3 font-display text-2xl font-light text-paper">
                P02400005461
              </p>
            </div>
            <div>
              <p className="stamp text-slate">Registration</p>
              <p className="mt-3 text-[14px] leading-relaxed text-paper/60">
                Counsel present at every close, from token to sub-registrar.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo.png"
              alt="Josh Properties"
              width={180}
              height={120}
              className="h-10 w-auto"
            />
            <p className="mt-6 max-w-[34ch] text-pretty text-[15px] leading-relaxed text-paper/50">
              Private real-estate advisory · Hyderabad · Est. 2017. Villas,
              apartments and farmland with verified titles and a single
              concierge from first call to registration.
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="eyebrow text-slate">Explore</p>
            <ul className="mt-5 space-y-3">
              {explore.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="link-underline text-[15px] text-paper/70 transition-colors hover:text-emerald"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Grounds">
            <p className="eyebrow text-slate">Grounds</p>
            <ul className="mt-5 space-y-3">
              {[
                "Jubilee Hills",
                "Kokapet",
                "Gachibowli",
                "Shankarpally",
                "Chevella",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="/farmlands"
                    className="link-underline text-[15px] text-paper/70 transition-colors hover:text-emerald"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-slate">Concierge</p>
            <address className="mt-5 space-y-3 not-italic">
              <p className="text-[15px] leading-relaxed text-paper/70">
                {site.address}
              </p>
              <p>
                <a href={site.phoneHref} className="link-underline text-[15px] text-paper/70 transition-colors hover:text-emerald">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={site.whatsapp} className="link-underline text-[15px] text-paper/70 transition-colors hover:text-emerald">
                  WhatsApp
                </a>
              </p>
              <p className="text-[13px] text-paper/40">{site.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-center">
          <p className="eyebrow text-slate">
            RERA no. P02400005461 · Registration by counsel at every close
          </p>
          <p className="text-[12px] text-paper/35">
            © 2026 {site.name}. {site.legalName} · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
