import { promises } from "@/data/promises";
import { Reveal } from "@/components/motion/Reveal";

export function WhyJosh() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 className="text-balance font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink lg:text-5xl">
            Why Hyderabad&rsquo;s quietest buyers deal with us.
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <div className="group border-t border-ink/15 pt-6 transition-colors duration-300 hover:border-emerald/60">
                <h3 className="font-display text-2xl font-normal text-ink">
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
