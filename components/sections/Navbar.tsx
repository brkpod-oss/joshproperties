"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Seal } from "@/components/ui/Seal";
import { site } from "@/lib/site";

const navLinks = [
  { label: "Villas", href: "/villas" },
  { label: "Apartments", href: "/apartments" },
  { label: "Farmlands", href: "/farmlands" },
  { label: "The Collection", href: "#collection" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto flex max-w-[1440px] items-center justify-between border px-5 py-3 transition-colors duration-300 sm:px-6 ${
          solid
            ? "border-stone bg-paper/92 backdrop-blur-xl"
            : "border-paper/15 bg-transparent"
        }`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex items-center"
          aria-label="Josh Properties, home"
        >
          <Image
            src="/logo.png"
            alt="Josh Properties"
            width={160}
            height={107}
            priority
            className="h-9 w-auto transition-opacity duration-300 sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`eyebrow group relative transition-colors duration-200 hover:text-emerald ${
                solid ? "text-ink/60" : "text-paper/75"
              }`}
            >
              {l.label}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-emerald transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className={`hidden border px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 sm:inline-flex ${
              solid
                ? "border-ink/30 text-ink hover:border-emerald hover:bg-emerald/[0.06]"
                : "border-paper/40 text-paper hover:border-paper hover:bg-paper/10"
            }`}
          >
            Enquire privately
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center border transition-colors duration-300 lg:hidden ${
              solid
                ? "border-ink/30 text-ink"
                : "border-paper/40 text-paper"
            }`}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-carbon/95 backdrop-blur-2xl lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="flex h-full flex-col justify-between px-6 pb-10 pt-32 sm:px-12"
            >
              <ul className="flex flex-col gap-6">
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: 0.05 * i + 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-[2.5rem] font-light leading-none tracking-[-0.02em] text-paper transition-colors hover:text-emerald sm:text-5xl"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="font-display text-[2.5rem] font-light leading-none tracking-[-0.02em] text-emerald sm:text-5xl"
                  >
                    Enquire
                  </Link>
                </motion.li>
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-5 border-t border-paper/15 pt-8"
              >
                <div className="flex items-center gap-3">
                  <Seal className="h-9 w-9 text-paper/80" />
                  <div className="flex flex-col gap-1">
                    <a href={site.phoneHref} className="stamp text-paper">
                      {site.phone}
                    </a>
                    <span className="text-[12px] text-paper/45">{site.hours}</span>
                  </div>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
