import { cn } from "@/lib/utils";

type StampTone = "available" | "sold" | "reserved" | "muted";

interface StampProps {
  label: string;
  tone?: StampTone;
  className?: string;
}

const tones: Record<StampTone, string> = {
  available: "border-emerald/70 text-emerald bg-emerald/[0.06]",
  sold: "border-slate/60 text-slate/80 bg-graphite/40 -rotate-3",
  reserved: "border-chrome/70 text-slate/90 bg-stone/40",
  muted: "border-slate/50 text-slate/70",
};

export function Stamp({ label, tone = "muted", className }: StampProps) {
  return (
    <span
      className={cn(
        "stamp inline-flex items-center border px-2.5 py-1 backdrop-blur-sm",
        tones[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
