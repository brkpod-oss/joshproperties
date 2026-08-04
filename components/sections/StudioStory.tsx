import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

function Signature() {
  return (
    <svg
      width="96"
      height="28"
      viewBox="0 0 96 28"
      fill="none"
      aria-hidden
      className="text-gold"
    >
      <path
        d="M2 20C14 6 22 24 34 12C44 3 52 22 62 10C70 2 80 16 94 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 25L72 25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function StudioStory() {
  return (
    <section id="studio" className="relative overflow-hidden bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 py-28 sm:px-12 lg:grid-cols-2 lg:gap-24 lg:px-20 lg:py-40">
        <Reveal className="order-1">
          <div className="vignette relative aspect-[4/5] overflow-hidden rounded-[2px] lg:mr-24">
            <ParallaxImage
              src="https://picsum.photos/seed/victory-studio/1000/1250"
              alt="Reading corner in teak and brass, finished by Victory Atelier"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="absolute inset-0"
            />
          </div>
          <p className="eyebrow mt-6 text-bronze">
            Photographed in natural light · Khammam
          </p>
        </Reveal>

        <div className="order-2">
          <Reveal>
            <ChapterMarker kicker="The Studio" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-8 font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-6xl">
              We don&rsquo;t just design interiors.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[30ch] font-display text-2xl font-light italic leading-snug text-gold">
              We build the rooms you&rsquo;ll live the rest of your life in.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-[60ch] text-pretty text-[17px] leading-relaxed text-ink/70">
              Victory began in 2012 as a two-person carpentry workshop. Twelve
              years later, eight of our fourteen people still build your home
              in our own workshop — because the work that defines the result is
              the work we never outsource.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-6 max-w-[60ch] text-pretty text-[17px] leading-relaxed text-ink/70">
              Every project is drawn from a blank page, quoted line by line,
              reviewed by a Vastu consultant, and handed over with a ten-year
              warranty that is written, not verbal.
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="mt-12">
              <Signature />
              <p className="mt-3 font-display text-sm italic text-bronze">
                &mdash; Studio Director, Victory Atelier
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
