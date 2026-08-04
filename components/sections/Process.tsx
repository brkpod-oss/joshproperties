import { processSteps } from "@/data/process";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { RevealMask } from "@/components/motion/RevealMask";

export function Process() {
  return (
    <section id="process" className="bg-ivory">
      <div className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal>
          <ChapterMarker kicker="How it works" />
        </Reveal>
        <RevealMask delay={0.1}>
          <h2 className="mt-8 max-w-[18ch] text-balance font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-6xl">
            From first conversation to final handover.
          </h2>
        </RevealMask>

        <div className="relative mt-20 lg:ml-10">
          <div
            aria-hidden
            className="absolute left-[21px] top-2 bottom-2 w-px bg-gold/30 lg:left-[22px]"
          />
          <ol className="space-y-14">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={Math.min(i * 0.05, 0.15)}>
                <li className="relative grid grid-cols-[44px_1fr] gap-6 lg:grid-cols-[44px_1fr_auto] lg:gap-10">
                  <span className="relative z-10 mt-1 flex h-[44px] w-[44px] items-center justify-center rounded-full border border-gold/40 bg-ivory font-mono text-[11px] tracking-[0.1em] text-gold">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-display text-2xl font-normal text-ink lg:text-3xl">
                        {step.title}
                      </h3>
                      <span className="eyebrow text-gold">{step.week}</span>
                    </div>
                    <p className="mt-3 max-w-[58ch] text-pretty text-[15px] leading-relaxed text-ink/60">
                      {step.description}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
