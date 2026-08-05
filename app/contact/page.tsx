import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { site } from "@/lib/site";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Enquire privately",
  description:
    "Enquire privately with Josh Properties. A concierge replies within two working days, no walk-ins, no mailing list.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-28 sm:px-12 lg:px-20 lg:pb-40 lg:pt-32">
          <Reveal>
            <ChapterMarker kicker="Start here" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <div>
              <Reveal delay={0.1}>
                <h1 className="text-balance font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-ink lg:text-6xl">
                  A conversation, not a sales call.
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-[50ch] text-pretty text-[17px] leading-relaxed text-ink/70">
                  Tell us what you are looking for and where. Within two
                  working days a concierge, the same person who will sit
                  beside you at registration, calls to arrange a private
                  viewing.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <ContactForm />
              </Reveal>
            </div>

            <aside className="lg:border-l lg:border-ink/15 lg:pl-14">
              <Reveal delay={0.15}>
                <h2 className="eyebrow text-slate">The concierge line</h2>
                <ul className="mt-6 space-y-6">
                  <li>
                    <a
                      href={site.phoneHref}
                      className="font-display text-2xl font-light text-ink transition-colors hover:text-emerald"
                    >
                      {site.phone}
                    </a>
                    <p className="mt-1 text-sm text-ink/50">{site.hours}</p>
                  </li>
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="font-display text-2xl font-light text-ink transition-colors hover:text-emerald"
                    >
                      {site.email}
                    </a>
                    <p className="mt-1 text-sm text-ink/50">
                      Replies within two working days
                    </p>
                  </li>
                </ul>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-12 border-t border-ink/15 pt-10">
                  <h2 className="eyebrow text-slate">The office</h2>
                  <address className="mt-5 not-italic">
                    <p className="text-[15px] leading-relaxed text-ink/70">
                      {site.address}
                    </p>
                    <p className="mt-1 text-sm text-ink/50">
                      Visits strictly by appointment
                    </p>
                  </address>
                  <div className="vignette relative mt-8 aspect-[4/3] overflow-hidden rounded-[2px]">
                    {/* Replace with an embedded map or the office storefront */}
                    <div className="absolute inset-0 bg-mist" />
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
