"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Send } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
};

const projectTypes = [
  "Full home",
  "Kitchen",
  "Bedroom",
  "Living room",
  "Office / commercial",
  "Other",
];

const budgets = [
  "Under ₹10 lakh",
  "₹10–20 lakh",
  "₹20–35 lakh",
  "₹35 lakh+",
  "Not sure yet",
];

const initial: FormState = {
  name: "",
  phone: "",
  projectType: "",
  budget: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError(null);
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !/^[+\d][\d\s-]{7,14}$/.test(form.phone.trim())) {
      setError("Please add your name and a phone number we can reach you on.");
      return;
    }
    const text = [
      `New consultation request — victoryatelier.in`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Project: ${form.projectType || "—"}`,
      `Budget: ${form.budget || "—"}`,
      form.message ? `\nNotes:\n${form.message}` : "",
    ].join("\n");
    window.open(
      `https://wa.me/919542765232?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSent(true);
  }

  const inputClass =
    "w-full border-b border-gold/30 bg-transparent py-3 text-[15px] text-ink placeholder:text-ink/35 transition-colors focus:border-gold focus:outline-none";

  if (sent) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 border border-gold/40 bg-bone/60 p-10"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check size={20} strokeWidth={1.5} />
        </span>
        <h2 className="mt-6 font-display text-3xl font-light text-ink">
          Request received.
        </h2>
        <p className="mt-3 max-w-[42ch] text-pretty text-[15px] leading-relaxed text-ink/65">
          We&rsquo;ve opened WhatsApp with your details — just hit send there and
          we&rsquo;ll call you within two working days. Prefer to talk? Dial{" "}
          <a href={site.phoneHref} className="text-gold underline-offset-4 hover:underline">
            {site.phone}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-14 space-y-10">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow text-bronze">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            placeholder="How should we address you?"
            value={form.name}
            onChange={set("name")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="eyebrow text-bronze">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+91 …"
            value={form.phone}
            onChange={set("phone")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="eyebrow text-bronze">
            Project type
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {projectTypes.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setForm((f) => ({ ...f, projectType: p }))}
                  className={cn(
                    "border px-4 py-2 text-[13px] transition-colors",
                  form.projectType === p
                    ? "border-gold bg-gold/10 text-ink"
                    : "border-gold/30 text-ink/60 hover:border-gold/60"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="budget" className="eyebrow text-bronze">
            Budget range
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setForm((f) => ({ ...f, budget: b }))}
                  className={cn(
                    "border px-4 py-2 text-[13px] transition-colors",
                  form.budget === b
                    ? "border-gold bg-gold/10 text-ink"
                    : "border-gold/30 text-ink/60 hover:border-gold/60"
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow text-bronze">
          Anything else? (optional)
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Timeline, Vastu considerations, rooms, rough ideas…"
          value={form.message}
          onChange={set("message")}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      {error && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[13px] text-red-800"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        className="group inline-flex items-center gap-3 bg-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.12em] text-carbon transition-colors duration-300 hover:bg-brass active:scale-[0.98]"
      >
        <Send size={15} strokeWidth={1.5} />
        Send request
        <ArrowRight
          size={15}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>
    </form>
  );
}
