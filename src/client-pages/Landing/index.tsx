"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Included from "./components/Included";
import Letter from "./components/Letter";
import Steps from "./components/Steps";
import Terms from "./components/Terms";
import { gsap, ScrollTrigger, useGSAP } from "./lib/gsap";
import { scrollToTarget, setLenis } from "./lib/scroll";
import { THEMES, type ThemeName } from "./lib/themes";
import ui from "./ui.module.scss";

export default function Landing({ fontVars }: { fontVars: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis share one frame.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Fonts change line breaks, and line breaks move every trigger.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // In-page anchors go through Lenis; the call-back CTA also focuses the phone field.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = a?.getAttribute("href");
      if (!a || !href || href === "#") return;
      e.preventDefault();
      const fine = window.matchMedia("(pointer: fine)").matches;
      scrollToTarget(href, () => {
        if (href === "#contact" && fine) {
          document.getElementById("lead-phone")?.focus({ preventScroll: true });
        }
      });
      history.replaceState(null, "", href);
    };

    // Buttons with data-fill grow their hover fill from the pointer's entry/exit point.
    const setOrigin = (e: PointerEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>("[data-fill]");
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${e.clientX - r.left}px`);
      btn.style.setProperty("--y", `${e.clientY - r.top}px`);
    };

    root.addEventListener("click", onClick);
    root.addEventListener("pointerover", setOrigin);
    root.addEventListener("pointerout", setOrigin);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("pointerover", setOrigin);
      root.removeEventListener("pointerout", setOrigin);
    };
  }, []);

  // Page colour follows the section in the middle of the viewport.
  // Only the fixed backdrop animates per frame. The theme variables are inherited by every
  // element, so tweening them restyled the whole page on each frame (measured: ~2x frame time
  // while scrolling); they now switch once, partway through the fade.
  useGSAP(
    () => {
      const root = rootRef.current;
      const backdrop = backdropRef.current;
      if (!root || !backdrop) return;
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = calm ? 0 : 0.9;
      const apply = (name: ThemeName) => {
        const theme = THEMES[name];
        gsap.to(backdrop, { backgroundColor: theme["--bg"], duration, ease: "power2.out", overwrite: true });
        gsap.set(root, { ...theme, delay: duration * 0.3, overwrite: true });
      };

      gsap.utils.toArray<HTMLElement>("[data-theme]", root).forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) apply(section.dataset.theme as ThemeName);
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={`${ui.root} ${fontVars}`}>
      <div ref={backdropRef} className={ui.backdrop} aria-hidden />
      <a href="#contact" className={ui.skip}>
        Перейти к форме заявки
      </a>
      <Header />
      <main>
        <Hero />
        <Letter />
        <Included />
        <HowItWorks />
        <Terms />
        <Steps />
        <Contact />
      </main>
      <Footer />
      <Cursor rootRef={rootRef} />
    </div>
  );
}
