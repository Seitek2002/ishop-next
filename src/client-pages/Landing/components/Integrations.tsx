"use client";

import { useState } from "react";
import { INTEGRATIONS, TERMS } from "../content";
import Logo from "./Logo";
import d from "./demo.module.scss";
import s from "./Integrations.module.scss";

const RADIUS = 39; // % of the orbit box

const position = (i: number, n: number) => {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(a) * RADIUS, y: 50 + Math.sin(a) * RADIUS };
};

export default function Integrations({ active }: { active: boolean }) {
  const [sel, setSel] = useState<number | null>(null);
  const n = INTEGRATIONS.length;
  const current = sel === null ? null : INTEGRATIONS[sel];

  return (
    <div className={d.card}>
      <div className={d.cardHead}>
        <span className={s.title}>Подключения</span>
        <span className={d.demoTag}>Наведите на сервис</span>
      </div>

      <div className={s.orbitWrap}>
        <div className={s.orbit} data-paused={sel !== null}>
          <svg viewBox="0 0 100 100" className={s.lines} aria-hidden>
            <circle cx="50" cy="50" r={RADIUS} className={s.track} />
            {INTEGRATIONS.map((it, i) => {
              const p = position(i, n);
              return (
                <line
                  key={it.name}
                  x1="50"
                  y1="50"
                  x2={p.x}
                  y2={p.y}
                  className={s.line}
                  data-on={sel === i}
                  data-dim={sel !== null && sel !== i}
                />
              );
            })}
          </svg>

          {INTEGRATIONS.map((it, i) => {
            const p = position(i, n);
            return (
              <button
                key={it.name}
                type="button"
                className={s.node}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                data-on={sel === i}
                aria-pressed={sel === i}
                tabIndex={active ? 0 : -1}
                onPointerEnter={() => setSel(i)}
                onPointerLeave={() => setSel(null)}
                onFocus={() => setSel(i)}
                onBlur={() => setSel(null)}
                onClick={() => setSel(i)}
              >
                <span className={s.nodeInner}>{it.name}</span>
              </button>
            );
          })}

          <div className={s.core} aria-hidden>
            <span className={s.coreInner}>
              <Logo className={s.coreLogo} />
            </span>
          </div>
        </div>
      </div>

      <p className={s.caption} aria-live="polite">
        {current ? (
          <>
            <b>{current.name}</b>: {current.kind.toLowerCase()}
          </>
        ) : (
          <>
            <b>{TERMS.integrations} готовых интеграций.</b> На схеме самые востребованные.
          </>
        )}
      </p>
    </div>
  );
}
