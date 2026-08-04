"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export type GalleryImage = { src: string; alt: string };

interface GalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function Gallery({ images, className }: GalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onDown(e: React.PointerEvent) {
    setDragging(true);
    startX.current = e.clientX;
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
  }

  function onMove(e: React.PointerEvent) {
    if (!dragging) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = scrollLeft.current - (e.clientX - startX.current);
  }

  function end() {
    setDragging(false);
  }

  return (
    <div
      ref={trackRef}
      data-cursor="Drag"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={end}
      onPointerLeave={end}
      className={`flex snap-x snap-mandatory select-none gap-4 overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
    >
      {images.map((img, i) => (
        <figure
          key={i}
          className="relative aspect-[4/3] w-[82vw] shrink-0 snap-start overflow-hidden rounded-[2px] sm:w-[60vw] lg:w-[42vw]"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 60vw, 42vw"
            className="object-cover"
            priority={i === 0}
          />
          <span className="absolute bottom-4 left-4 bg-carbon/50 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-paper backdrop-blur">
            {i + 1} / {images.length}
          </span>
        </figure>
      ))}
    </div>
  );
}
