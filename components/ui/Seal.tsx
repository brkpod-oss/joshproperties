import { cn } from "@/lib/utils";

interface SealProps {
  className?: string;
}

export function Seal({ className }: SealProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={cn("h-12 w-12", className)}
    >
      <defs>
        <path id="seal-top" d="M 27 50 A 23 23 0 0 1 73 50" />
        <path id="seal-bottom" d="M 28 54 A 21 21 0 0 0 72 54" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="41.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="29.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <text
        fill="currentColor"
        fontSize="6.4"
        letterSpacing="1.6"
        fontFamily="var(--font-mono)"
        style={{ textTransform: "uppercase" }}
      >
        <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
          Josh Properties
        </textPath>
      </text>
      <text
        fill="currentColor"
        fontSize="5"
        letterSpacing="1"
        fontFamily="var(--font-mono)"
        style={{ textTransform: "uppercase" }}
      >
        <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
          Private Advisory
        </textPath>
      </text>
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fill="currentColor"
        fontSize="21"
        fontFamily="var(--font-display)"
        fontWeight="300"
      >
        JP
      </text>
      {["12", "3", "6", "9"].map((a) => (
        <circle
          key={a}
          cx={50 + 35.5 * Math.cos((Number(a) * Math.PI) / 6)}
          cy={50 + 35.5 * Math.sin((Number(a) * Math.PI) / 6)}
          r="1.1"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
