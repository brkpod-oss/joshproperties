import { stats } from "@/data/stats";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

export function Stats() {
  return (
    <section className="bg-obsidian">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-16 px-6 py-24 sm:px-12 lg:grid-cols-4 lg:px-20 lg:py-32">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1} className="relative px-4">
            <div className="flex flex-col items-start">
              <span className="font-display text-sm italic text-brass">{stat.numeral}</span>
              <span className="mt-6 font-display text-[5.5rem] font-light leading-none text-champagne tabular-nums lg:text-[7rem]">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="gold-rule-solid mt-6 w-10" />
              <span className="mt-4 max-w-[16ch] text-[15px] leading-snug text-pearl/80">
                {stat.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
