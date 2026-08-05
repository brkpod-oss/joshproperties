import Image from "next/image";
import type { ReactNode } from "react";
import { RevealMask } from "@/components/motion/RevealMask";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  seed: string;
  /** Optional local image that overrides the seeded picsum placeholder. */
  image?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, seed, image, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-carbon">
      <div className="absolute inset-0 opacity-50">
        <Image
          src={image ?? `https://picsum.photos/seed/${seed}/2400/1200`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/50 to-carbon/60" />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-20 pt-44 sm:px-12 lg:px-20 lg:pb-28 lg:pt-56">
        <p className="eyebrow text-emerald">{eyebrow}</p>
        <RevealMask delay={0.1}>
          <h1 className="mt-6 max-w-[20ch] text-balance font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-paper lg:text-7xl">
            {title}
          </h1>
        </RevealMask>
        {children && <div className="mt-8 max-w-[56ch] text-pretty text-lg leading-relaxed text-paper/70">{children}</div>}
      </div>
    </section>
  );
}
