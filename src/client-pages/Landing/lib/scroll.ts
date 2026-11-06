"use client";

import type Lenis from "lenis";

// The landing owns a single Lenis instance; components reach it through here
// instead of threading it through context.
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const scrollToY = (y: number, immediate = false) => {
  if (instance) {
    instance.scrollTo(y, { immediate, duration: 1.2 });
  } else {
    window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  }
};

export const scrollToTarget = (selector: string, onComplete?: () => void) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (instance) {
    // force: the mobile menu stops Lenis while open, and its links fire before it closes.
    instance.scrollTo(el, { offset: 0, duration: 1.4, force: true, onComplete: () => onComplete?.() });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
    onComplete?.();
  }
};

export const lockScroll = (locked: boolean) => {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
};

export const formatSom = (value: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(value));
