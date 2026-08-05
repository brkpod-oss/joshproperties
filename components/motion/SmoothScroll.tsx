"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Coarse pointers (phones, tablets): native momentum + rubber-banding is
    // the premium mobile feel. Lenis only smooths wheel/keyboard scroll, so
    // on touch it would add a permanent rAF loop for no benefit.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", onRefresh);
    return () => {
      window.removeEventListener("load", onRefresh);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
