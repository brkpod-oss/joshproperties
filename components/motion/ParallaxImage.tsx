"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  speed?: number;
}

export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  sizes,
  speed = 12,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-[-16%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imgClassName)}
        />
      </motion.div>
    </div>
  );
}
