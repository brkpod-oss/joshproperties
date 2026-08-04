"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";

const navLinks = [
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-gold/15 bg-ivory/85 px-5 py-4 backdrop-blur-xl sm:px-8">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          Victory <span className="italic text-gold">Atelier</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="eyebrow group relative text-ink/60 transition-colors duration-200 hover:text-gold"
            >
              {l.label}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden border border-ink/30 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-gold hover:bg-gold/[0.06] sm:inline-flex"
          >
            Book a visit
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-gold/30 text-ink lg:hidden"
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-3 max-w-[1440px] rounded-[2px] border border-gold/20 bg-carbon/95 p-8 backdrop-blur-2xl lg:hidden"
          >
            <ul className="flex flex-col gap-6">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl font-light text-ivory transition-colors hover:text-champagne"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="border-t border-gold/20 pt-6">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="eyebrow text-champagne"
                >
                  {site.phone} · Book a visit
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
