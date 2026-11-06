"use client";

import { useEffect, useState } from "react";
import { CONTACTS, HERO, NAV } from "../content";
import { lockScroll } from "../lib/scroll";
import { Roll } from "./ButtonParts";
import Logo from "./Logo";
import Magnetic from "./Magnetic";
import ui from "../ui.module.scss";
import s from "./Header.module.scss";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 200);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  return (
    <header
      className={s.header}
      data-hidden={hidden && !open}
      data-solid={solid || open}
      data-open={open}
    >
      <div className={s.bar}>
        <a href="#top" className={s.brand} aria-label="iShop.kg, в начало страницы">
          <Logo className={s.logo} />
          <span>iShop.kg</span>
        </a>

        <nav className={s.nav} aria-label="Разделы предложения">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={s.navLink}>
              <Roll>{item.label}</Roll>
            </a>
          ))}
        </nav>

        <div className={s.actions}>
          <a href={CONTACTS.phoneHref} className={s.phone}>
            <Roll>{CONTACTS.phone}</Roll>
          </a>
          <Magnetic className={s.ctaWrap}>
            <a href="#contact" className={`${ui.btn} ${ui.btnSm}`} data-fill>
              <Roll>{HERO.primary}</Roll>
            </a>
          </Magnetic>
          <button
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="landing-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={s.burger} aria-hidden />
            <span className={ui.srOnly}>{open ? "Закрыть меню" : "Открыть меню"}</span>
          </button>
        </div>
      </div>

      <div id="landing-menu" className={s.menu} aria-hidden={!open} inert={!open}>
        <nav aria-label="Меню" className={s.menuNav}>
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={s.menuLink}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className={s.menuFoot}>
          <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
          <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
        </div>
      </div>
    </header>
  );
}
