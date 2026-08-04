import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
  italicWord?: string;
}

export function DisplayHeading({
  children,
  className,
  italicWord,
}: SectionHeadingProps) {
  if (!italicWord) {
    return (
      <h2 className={cn("font-display font-light leading-[1.02] tracking-[-0.02em]", className)}>
        {children}
      </h2>
    );
  }

  const parts = children?.toString().split(italicWord);
  return (
    <h2 className={cn("font-display font-light leading-[1.02] tracking-[-0.02em]", className)}>
      {parts?.[0]}
      <em className="italic">{italicWord}</em>
      {parts?.[1]}
    </h2>
  );
}
