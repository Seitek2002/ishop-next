"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { HOW } from "../content";
import AiChat from "./AiChat";
import Dashboard from "./Dashboard";
import Integrations from "./Integrations";
import ui from "../ui.module.scss";
import s from "./HowItWorks.module.scss";

const PANELS = [AiChat, Dashboard, Integrations];

export default function HowItWorks() {
  const [tab, setTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (tab + keys[e.key] + HOW.tabs.length) % HOW.tabs.length;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="how" data-theme="lavender" className={s.section} aria-labelledby="how-title">
      <div className={ui.wrap}>
        <div className={s.head}>
          <h2 id="how-title" className={ui.h2}>
            {HOW.title}
          </h2>
          <p className={ui.lead}>{HOW.lead}</p>
        </div>

        <div className={s.layout}>
          <div role="tablist" aria-label="Демо" aria-orientation="vertical" className={s.tabs} onKeyDown={onKeyDown}>
            {HOW.tabs.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === i}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === i ? 0 : -1}
                className={s.tab}
                onClick={() => setTab(i)}
              >
                <span className={s.tabTitle}>{t.title}</span>
                <span className={s.tabTextWrap}>
                  <span className={s.tabText}>{t.text}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={s.stage}>
            {HOW.tabs.map((t, i) => {
              const Panel = PANELS[i];
              const on = tab === i;
              return (
                <div
                  key={t.id}
                  role="tabpanel"
                  id={`panel-${t.id}`}
                  aria-labelledby={`tab-${t.id}`}
                  aria-hidden={!on}
                  inert={!on}
                  data-active={on}
                  className={s.panel}
                >
                  <Panel active={on} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
