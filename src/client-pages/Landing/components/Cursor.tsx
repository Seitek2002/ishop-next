"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "../lib/gsap";
import s from "./Cursor.module.scss";

type Props = { rootRef: RefObject<HTMLElement | null> };

/**
 * Dot + trailing ring. The ring grows over interactive elements and shows a short
 * label when the target has data-cursor="…". Enabled only for fine pointers
 * without reduced-motion; touch devices keep their native behaviour.
 */
export default function Cursor({ rootRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !wrap || !ring || !dot || !label) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    root.dataset.cursor = "on";

    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

    let visible = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set([ring, dot], { x: e.clientX, y: e.clientY });
        wrap.dataset.visible = "true";
      }
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const text = target.closest('input[type="tel"], input[type="text"], textarea');
      if (text) {
        wrap.dataset.state = "text";
        return;
      }
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        label.textContent = labelled.dataset.cursor ?? "";
        wrap.dataset.state = "label";
        return;
      }
      const interactive = target.closest('a, button, [role="tab"], input, label');
      wrap.dataset.state = interactive ? "hover" : "idle";
    };

    const down = () => (wrap.dataset.pressed = "true");
    const up = () => (wrap.dataset.pressed = "false");
    const leave = () => {
      visible = false;
      wrap.dataset.visible = "false";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      delete root.dataset.cursor;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [rootRef]);

  return (
    <div ref={wrapRef} className={s.cursor} data-visible="false" data-state="idle" aria-hidden>
      <div ref={ringRef} className={s.ring}>
        <div className={s.ringShape}>
          <span ref={labelRef} className={s.label} />
        </div>
      </div>
      <div ref={dotRef} className={s.dot}>
        <div className={s.dotShape} />
      </div>
    </div>
  );
}
