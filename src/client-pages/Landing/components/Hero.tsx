"use client";

import { useRef } from "react";
import { CONTACTS, HERO } from "../content";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { ArrowBadge, Roll } from "./ButtonParts";
import Magnetic from "./Magnetic";
import OrderFeed from "./OrderFeed";
import PhoneMock from "./PhoneMock";
import ui from "../ui.module.scss";
import s from "./Hero.module.scss";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const tilt = tiltRef.current;
      const glow = glowRef.current;
      if (!root || !tilt || !glow) return;
      const mm = gsap.matchMedia();

      // Leaving the hero: headline drifts up slower than the phone.
      mm.add(MOTION_OK, () => {
        const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
        gsap.to(titleRef.current, { yPercent: -22, ease: "none", scrollTrigger: scrub });
        gsap.to(stageRef.current, { y: -160, ease: "none", scrollTrigger: scrub });
      });

      // Pointer: phone tilts toward the cursor and a soft light follows it.
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        gsap.set(tilt, { transformPerspective: 1100 });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1, ease: "power3.out" });

        const light = { x: root.clientWidth * 0.7, y: root.clientHeight * 0.4 };
        // Written on the glow layer itself (no children), not the section, so pointer
        // moves repaint one element instead of restyling the whole hero.
        const paint = () => {
          glow.style.setProperty("--mx", `${light.x}px`);
          glow.style.setProperty("--my", `${light.y}px`);
        };
        const lx = gsap.quickTo(light, "x", { duration: 1.4, ease: "power3.out", onUpdate: paint });
        const ly = gsap.quickTo(light, "y", { duration: 1.4, ease: "power3.out", onUpdate: paint });

        const move = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * 18);
          rx(-py * 12);
          lx(e.clientX - r.left);
          ly(e.clientY - r.top);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerleave", leave);
        return () => {
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: rootRef },
  );

  const lines = HERO.titleLines;

  return (
    <section ref={rootRef} id="top" data-theme="purple" className={s.hero}>
      <div ref={glowRef} className={s.glow} aria-hidden />

      <div className={`${ui.wrap} ${s.inner}`}>
        <div className={s.letterhead}>
          <span>{HERO.letterhead}</span>
          <span className={s.place}>
            {HERO.place}, {new Date().getFullYear()}
          </span>
        </div>

        <h1 ref={titleRef} className={s.title}>
          {lines.map((line, i) => (
            <span key={line} className={s.line}>
              <span className={s.lineInner} style={{ "--i": i } as React.CSSProperties}>
                {line}
                {i < lines.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>

        <div className={s.bottom}>
          <p className={s.lead}>{HERO.lead}</p>
          <div className={s.actions}>
            <Magnetic>
              <a href="#contact" className={ui.btn} data-fill>
                <Roll>{HERO.primary}</Roll>
                <ArrowBadge />
              </a>
            </Magnetic>
            <a
              href={CONTACTS.demoUrl}
              target="_blank"
              rel="noopener"
              className={ui.link}
              data-cursor="Демо"
            >
              {HERO.secondary}
            </a>
          </div>
        </div>
      </div>

      <div ref={stageRef} className={s.stage}>
        <div className={s.stageIntro}>
          <div ref={tiltRef} className={s.tilt}>
            <PhoneMock />
          </div>
          <OrderFeed className={s.feed} />
        </div>
      </div>
    </section>
  );
}
