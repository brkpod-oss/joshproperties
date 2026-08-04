import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Reveal } from "@/components/motion/Reveal";

function Stars() {
  return (
    <div aria-label="Five stars" className="flex gap-1 text-emerald">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export function Testimonials() {
  const featured = testimonials.find((t) => t.featured) ?? testimonials[0];
  const rest = testimonials.filter((t) => t !== featured);

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <figure className="mx-auto max-w-[820px] text-center">
          <Reveal>
            <blockquote className="text-balance font-display text-3xl font-light italic leading-[1.25] text-ink lg:text-[2.75rem]">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
          </Reveal>
          <Reveal delay={0.15}>
            <figcaption className="mt-10 flex flex-col items-center gap-3">
              <Stars />
              <span className="font-display text-xl text-ink">{featured.name}</span>
              <span className="eyebrow text-slate">
                {featured.project} · {featured.context}
              </span>
            </figcaption>
          </Reveal>
        </figure>

        <div className="mt-24 grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-3">
          {rest.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="border-t border-ink/15 pt-8">
                <blockquote className="text-pretty text-[15px] leading-relaxed text-ink/70">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6">
                  <p className="font-display text-lg text-ink">{t.name}</p>
                  <p className="eyebrow mt-1 text-slate">{t.context}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
