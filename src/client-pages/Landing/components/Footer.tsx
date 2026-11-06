"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { CONTACTS, FOOTER, NAV } from "../content";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { scrollToY } from "../lib/scroll";
import { Roll } from "./ButtonParts";
import Magnetic from "./Magnetic";
import ui from "../ui.module.scss";
import s from "./Footer.module.scss";

const WORD = "iShop.kg".split("");

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const word = wordRef.current;
      if (!word) return;
      const letters = gsap.utils.toArray<HTMLElement>(`.${s.letter}`, word);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(letters, {
          yPercent: 105,
          rotate: 8,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: word, start: "top 92%" },
        });
      });

      // Letters near the pointer lift, like keys being pressed in reverse.
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const lifts = letters.map((el) => gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }));
        const move = (e: PointerEvent) => {
          letters.forEach((el, i) => {
            const r = el.getBoundingClientRect();
            const dist = Math.abs(e.clientX - (r.left + r.width / 2));
            const k = Math.max(0, 1 - dist / (r.width * 1.6));
            lifts[i](-k * r.height * 0.14);
          });
        };
        const leave = () => lifts.forEach((lift) => lift(0));
        word.addEventListener("pointermove", move);
        word.addEventListener("pointerleave", leave);
        return () => {
          word.removeEventListener("pointermove", move);
          word.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <footer ref={rootRef} data-theme="ink" className={s.footer}>
      <div className={`${ui.wrap} ${s.top}`}>
        <div className={s.contact}>
          <p className={s.question}>{FOOTER.question}</p>
          <a href={CONTACTS.phoneHref} className={s.bigPhone}>
            <Roll>{CONTACTS.phone}</Roll>
          </a>
          <a href={`mailto:${CONTACTS.email}`} className={ui.link}>
            {CONTACTS.email}
          </a>
        </div>

        <nav className={s.col} aria-label={FOOTER.nav}>
          <span className={s.colTitle}>{FOOTER.nav}</span>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={s.colLink}>
              <Roll>{item.label}</Roll>
            </a>
          ))}
        </nav>

        <div className={s.col}>
          <span className={s.colTitle}>{FOOTER.demo}</span>
          <a href={CONTACTS.demoUrl} target="_blank" rel="noopener" className={s.colLink} data-cursor="Демо">
            <Roll>ishop.kg/Exponenta</Roll>
          </a>
          <span className={s.city}>{CONTACTS.city}</span>
        </div>
      </div>

      <div ref={wordRef} className={s.word} aria-hidden>
        {WORD.map((ch, i) => (
          <span key={i} className={s.letterMask}>
            <span className={s.letter}>{ch}</span>
          </span>
        ))}
      </div>

      <div className={`${ui.wrap} ${s.bottom}`}>
        <span>© {new Date().getFullYear()} iShop.kg</span>
        <Link href="/privacy" className={s.small}>
          {FOOTER.privacy}
        </Link>
        <Magnetic>
          <button type="button" className={s.toTop} onClick={() => scrollToY(0)}>
            <ArrowUp size={18} strokeWidth={2.4} aria-hidden />
            {FOOTER.top}
          </button>
        </Magnetic>
      </div>
    </footer>
  );
}
