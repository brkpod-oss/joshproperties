import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AtelierCardProps {
  children: ReactNode;
  className?: string;
}

export function AtelierCard({ children, className }: AtelierCardProps) {
  return <div className={cn("atelier-card", className)}>{children}</div>;
}
