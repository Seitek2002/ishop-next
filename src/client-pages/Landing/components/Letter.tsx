"use client";

import { useRef } from "react";
import { LETTER } from "../content";
import { gsap, MOTION_OK, SplitText, useGSAP } from "../lib/gsap";
import Logo from "./Logo";
import ui from "../ui.module.scss";
import s from "./Letter.module.scss";

// The cover letter of the offer. Words ink in as the reader scrolls through it.
export default function Letter() {
  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(bodyRef.current, { type: "words", wordsClass: s.word });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: bodyRef.current,
              start: "top 78%",
              end: "bottom 42%",
              scrub: true,
            },
          },
        );
        return () => split.revert();
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} data-theme="lavender" className={s.letter} aria-labelledby="letter-greeting">
      <div className={`${ui.wrap} ${s.grid}`}>
        <p id="letter-greeting" className={s.greeting}>
          {LETTER.greeting}
        </p>
        <p ref={bodyRef} className={s.body}>
          {LETTER.body}
        </p>
        <div className={s.sign}>
          <Logo className={s.signLogo} />
          <span>
            {LETTER.signature[0]}
            <br />
            {LETTER.signature[1]}
          </span>
        </div>
      </div>
    </section>
  );
}
