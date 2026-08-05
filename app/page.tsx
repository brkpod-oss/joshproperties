import { CinematicHero } from "@/components/CinematicHero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Stats } from "@/components/sections/Stats";
import { Featured } from "@/components/sections/Featured";
import { Offerings } from "@/components/sections/Offerings";
import { Story } from "@/components/sections/Story";
import { FarmlandBand } from "@/components/sections/FarmlandBand";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { WhyJosh } from "@/components/sections/WhyJosh";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <CinematicHero />
      <TrustStrip />
      <Stats />
      <Featured />
      <Offerings />
      <Story />
      <FarmlandBand />
      <WhyJosh />
      <Process />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
