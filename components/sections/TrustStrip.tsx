import { partnerLogos } from "@/data/partners";

export function TrustStrip() {
  return (
    <section aria-label="Material partners" className="border-y border-gold/15 bg-linen">
      <p className="eyebrow pb-2 pt-8 text-center text-bronze">
        Material partners · 8 global brands
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 px-6 pb-10 pt-6">
        {partnerLogos.map((logo) => (
          <div key={logo.name} className="flex items-baseline gap-3">
            <span className="font-display text-xl font-medium tracking-tight text-ink/40 transition-colors duration-300 hover:text-ink/80">
              {logo.name}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-ink/25 md:inline">
              {logo.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
