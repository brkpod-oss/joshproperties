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
import {
  getHomePage, getSiteSettings, getStats, getPartnerLogos, getFeaturedProperties,
  getServices, getPromiseItems, getProcessSteps, getTestimonials, getFaqs,
} from "@/sanity/queries";

export default async function Home() {
  const [homePage, settings, stats, logos, featuredProperties, services, promiseItems, processSteps, testimonials, faqs] =
    await Promise.all([
      getHomePage(), getSiteSettings(), getStats(), getPartnerLogos(), getFeaturedProperties(),
      getServices(), getPromiseItems(), getProcessSteps(), getTestimonials(), getFaqs(),
    ]);

  return (
    <>
      <CinematicHero copy={homePage.hero} heroVideo={settings.heroVideo} />
      <TrustStrip logos={logos} />
      <Stats stats={stats} copy={homePage.stats} />
      <Featured properties={featuredProperties} copy={homePage.featured} />
      <Offerings services={services} copy={homePage.offerings} />
      <Story copy={homePage.story} />
      <FarmlandBand copy={homePage.farmlandBand} />
      <WhyJosh items={promiseItems} copy={homePage.whyJosh} />
      <Process steps={processSteps} copy={homePage.process} />
      <Testimonials items={testimonials} />
      <Faq items={faqs} copy={homePage.faqSection} />
      <FinalCta
        copy={homePage.finalCta}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        whatsapp={settings.whatsapp}
        reraNumber={settings.rera.number}
      />
    </>
  );
}
