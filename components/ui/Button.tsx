import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
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
    "border border-ink/30 text-ink hover:border-emerald hover:bg-emerald/[0.06] text-[12px]",
  ghost: "text-ink/60 hover:text-ink group-hover:text-emerald text-[12px]",
  filled:
    "bg-emerald text-ink hover:bg-bronze hover:text-paper text-[12px]",
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
  const cls = cn(base, variants[variant], sizes[size], className);
  const internal =
    typeof props.href === "string" &&
    props.href.startsWith("/") &&
    !props.href.startsWith("#") &&
    !props.href.startsWith("http");
  const { href, ...rest } = props;

  if (internal && href) {
    return (
      <Link
        className={cls}
        href={href}
        {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <a className={cls} {...props}>
      {children}
    </a>
  );
}
