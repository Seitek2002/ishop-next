"use client";

import { useRef, useState } from "react";
import { STEPS } from "../content";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import ui from "../ui.module.scss";
import s from "./Steps.module.scss";

const N = STEPS.items.length;

export default function Steps() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [reached, setReached] = useState(N);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const build = (axis: "scaleX" | "scaleY") => {
        setReached(1);
        gsap.fromTo(
          fillRef.current,
          { [axis]: 0 },
          {
            [axis]: 1,
            ease: "none",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.6,
              onUpdate: (self) => setReached(Math.min(N, Math.floor(self.progress * N) + 1)),
            },
          },
        );
        return () => setReached(N);
      };
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => build("scaleX"));
      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => build("scaleY"));
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="launch" data-theme="lavender" className={s.section} aria-labelledby="launch-title">
      <div className={ui.wrap}>
        <h2 id="launch-title" className={`${ui.h2} ${s.title}`}>
          {STEPS.title}
        </h2>

        <div ref={listRef} className={s.listWrap}>
          <span className={s.track} aria-hidden>
            <span ref={fillRef} className={s.fill} />
          </span>
          <ol className={s.list}>
            {STEPS.items.map((step, i) => (
              <li key={step.title} className={s.step} data-reached={i < reached}>
                <span className={s.dot} aria-hidden />
                <span className={s.num}>Шаг {i + 1}</span>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.text}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
