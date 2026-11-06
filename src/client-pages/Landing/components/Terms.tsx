"use client";

import { useEffect, useRef, useState } from "react";
import { TERMS, TERMS_SECTION as T } from "../content";
import { gsap } from "../lib/gsap";
import { formatSom } from "../lib/scroll";
import ui from "../ui.module.scss";
import d from "./demo.module.scss";
import s from "./Terms.module.scss";

const MIN = 100_000;
const MAX = 3_000_000;
const STEP = 50_000;

// Number that tweens to each new value. React renders it once; GSAP owns the text after.
function Tween({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  const [initial] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { v: current.current };
    const tween = gsap.to(state, {
      v: value,
      duration: calm ? 0 : 0.7,
      ease: "power3.out",
      onUpdate: () => {
        current.current = state.v;
        el.textContent = formatSom(state.v);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {formatSom(initial)}
    </span>
  );
}

export default function Terms() {
  const [turnover, setTurnover] = useState(600_000);
  const [rateIdx, setRateIdx] = useState(1);
  const [row, setRow] = useState<{ top: number; height: number } | null>(null);
  const tableWrap = useRef<HTMLDivElement>(null);

  const rate = TERMS.aggregatorRates[rateIdx];
  const them = turnover * rate;
  const us = turnover * TERMS.commissionRate;
  const yearly = (them - us) * 12;
  const progress = (turnover - MIN) / (MAX - MIN);

  const highlight = (e: React.PointerEvent<HTMLTableRowElement> | React.FocusEvent<HTMLTableRowElement>) => {
    const wrap = tableWrap.current;
    if (!wrap) return;
    const r = e.currentTarget.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    setRow({ top: r.top - w.top, height: r.height });
  };

  return (
    <section id="terms" data-theme="purple" className={s.section} aria-labelledby="terms-title">
      <div className={ui.wrap}>
        <div className={s.head}>
          <h2 id="terms-title" className={ui.h2}>
            {T.title}
          </h2>
          <p className={ui.lead}>{T.lead}</p>
        </div>

        <div className={s.calc}>
          <div className={s.controls}>
            <label htmlFor="turnover" className={s.label}>
              {T.turnoverLabel}
            </label>
            <div className={s.turnover}>
              <Tween value={turnover} /> сом
            </div>
            <input
              id="turnover"
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={turnover}
              onChange={(e) => setTurnover(Number(e.target.value))}
              aria-valuetext={`${formatSom(turnover)} сом`}
              className={s.range}
              style={{ "--p": progress } as React.CSSProperties}
              data-cursor="Тяните"
            />
            <div className={s.scale} aria-hidden>
              <span>100 тыс</span>
              <span>1,5 млн</span>
              <span>3 млн</span>
            </div>

            <div className={s.rate}>
              <span className={s.label} id="rate-label">
                {T.rateLabel}
              </span>
              <div
                className={`${d.segmented} ${s.rateSeg}`}
                role="group"
                aria-labelledby="rate-label"
                style={{ "--count": TERMS.aggregatorRates.length, "--index": rateIdx } as React.CSSProperties}
              >
                {TERMS.aggregatorRates.map((r, i) => (
                  <button
                    key={r}
                    type="button"
                    className={d.segment}
                    aria-pressed={rateIdx === i}
                    onClick={() => setRateIdx(i)}
                  >
                    {Math.round(r * 100)}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={s.results}>
            <div className={s.result}>
              <div className={s.resultRow}>
                <span>{T.aggregatorTakes}</span>
                <span className={s.resultValue}>
                  <Tween value={them} /> сом
                </span>
              </div>
              <span className={s.bar} data-kind="them" style={{ transform: "scaleX(1)" }} />
            </div>
            <div className={s.result}>
              <div className={s.resultRow}>
                <span>{T.ishopTakes}</span>
                <span className={s.resultValue}>
                  <Tween value={us} /> сом
                </span>
              </div>
              <span className={s.bar} data-kind="us" style={{ transform: `scaleX(${us / them})` }} />
            </div>
            <div className={s.keep}>
              <span className={s.keepLabel}>{T.keepYearly}</span>
              <span className={s.keepValue}>
                <Tween value={yearly} /> сом
              </span>
            </div>
          </div>
        </div>

        <div className={s.compare}>
          <h3 className={s.compareTitle}>{T.compareTitle}</h3>
          <div ref={tableWrap} className={s.tableWrap} onPointerLeave={() => setRow(null)}>
            <span
              className={s.rowLight}
              aria-hidden
              data-on={row !== null}
              style={row ? { transform: `translateY(${row.top}px)`, height: row.height } : undefined}
            />
            <table className={s.table}>
              <thead>
                <tr>
                  <th scope="col">
                    <span className={ui.srOnly}>Параметр</span>
                  </th>
                  <th scope="col">{T.themLabel}</th>
                  <th scope="col">{T.usLabel}</th>
                </tr>
              </thead>
              <tbody>
                {T.compare.map((r) => (
                  <tr key={r.param} onPointerEnter={highlight} onFocus={highlight} tabIndex={-1}>
                    <th scope="row">{r.param}</th>
                    <td className={s.them}>{r.them}</td>
                    <td>
                      <span className={s.us}>{r.us}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
