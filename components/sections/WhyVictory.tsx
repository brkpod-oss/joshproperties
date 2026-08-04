import { promises } from "@/data/promises";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";

export function WhyVictory() {
  return (
    <section className="bg-linen">
      <div className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <ChapterMarker kicker="Why Victory" className="justify-center" />
          <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-5xl">
            Why Khammam&rsquo;s most discerning homeowners choose Victory.
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <div className="group border-t border-gold/30 pt-6 transition-colors duration-300 hover:border-gold">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-2xl font-normal text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-ink/60">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
