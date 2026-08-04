import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Stats } from "@/components/sections/Stats";
import { StudioStory } from "@/components/sections/StudioStory";
import { WhyVictory } from "@/components/sections/WhyVictory";
import { Services } from "@/components/sections/Services";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Process } from "@/components/sections/Process";
import { Materials } from "@/components/sections/Materials";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Stats />
      <StudioStory />
      <WhyVictory />
      <Services />
      <SelectedWork />
      <Process />
      <Materials />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
