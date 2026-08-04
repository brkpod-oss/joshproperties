import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "outline" | "ghost" | "filled";
type Size = "md" | "lg";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-3 font-medium uppercase tracking-[0.12em] transition-[transform,background-color,border-color,color] duration-300 ease-out active:scale-[0.98] whitespace-nowrap";

const variants: Record<Variant, string> = {
  outline:
    "border border-ink/30 text-ink hover:border-gold hover:bg-gold/[0.06] text-[12px]",
  ghost: "text-ink/60 hover:text-ink group-hover:text-gold text-[12px]",
  filled: "bg-gold text-carbon hover:bg-brass text-[12px]",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3.5",
  lg: "px-9 py-4",
};

export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </a>
  );
}
