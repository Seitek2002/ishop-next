"use client";

import { useEffect, useRef, useState } from "react";
import { formatSom } from "../lib/scroll";
import d from "./demo.module.scss";
import ui from "../ui.module.scss";
import s from "./Dashboard.module.scss";

// Illustrative week of a small café; the panel is labelled as demo data.
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
type Metric = { id: string; label: string; unit: string; values: number[] };

const METRICS: Metric[] = [
  { id: "revenue", label: "Выручка", unit: "сом", values: [38400, 42100, 39800, 51200, 68900, 84300, 72600] },
  { id: "orders", label: "Заказы", unit: "шт.", values: [41, 46, 43, 55, 74, 92, 79] },
];

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const REVENUE = sum(METRICS[0].values);
const ORDERS = sum(METRICS[1].values);
const WEEKEND_SHARE = Math.round(((METRICS[0].values[4] + METRICS[0].values[5]) / REVENUE) * 100);

// Clean axis: ~4 steps of 1/2/2.5/5 × 10^n.
const niceScale = (max: number) => {
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
};

const tickLabel = (v: number) => (v >= 10000 ? `${v / 1000} тыс` : formatSom(v));

export default function Dashboard({ active }: { active: boolean }) {
  const [metric, setMetric] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Columns grow from the baseline the first time the panel is actually seen.
  useEffect(() => {
    if (!active || shown || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [active, shown]);

  const m = METRICS[metric];
  const { top, ticks } = niceScale(Math.max(...m.values));
  const maxIdx = m.values.indexOf(Math.max(...m.values));
  const pct = (v: number) => (shown ? (v / top) * 100 : 0);

  return (
    <div ref={ref} className={d.card}>
      <div className={d.cardHead}>
        <div className={s.titleWrap}>
          <span className={s.title}>Неделя в цифрах</span>
          <span className={d.demoTag}>Демо-данные</span>
        </div>
        <div
          className={d.segmented}
          role="group"
          aria-label="Показатель на графике"
          style={{ "--count": METRICS.length, "--index": metric } as React.CSSProperties}
        >
          {METRICS.map((x, i) => (
            <button
              key={x.id}
              type="button"
              className={d.segment}
              aria-pressed={metric === i}
              onClick={() => setMetric(i)}
              tabIndex={active ? 0 : -1}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <dl className={s.kpis}>
        <div>
          <dt>Выручка</dt>
          <dd>{formatSom(REVENUE)} сом</dd>
        </div>
        <div>
          <dt>Заказы</dt>
          <dd>{ORDERS}</dd>
        </div>
        <div>
          <dt>Средний чек</dt>
          <dd>{formatSom(REVENUE / ORDERS)} сом</dd>
        </div>
      </dl>

      <div className={s.chart}>
        <div className={s.plot}>
          {ticks.map((t) => (
            <div key={t} className={s.grid} style={{ bottom: `${(t / top) * 100}%` }} aria-hidden>
              <span className={s.tick}>{tickLabel(t)}</span>
            </div>
          ))}
          <div className={s.cols} data-hovering={hover !== null}>
            {m.values.map((v, i) => (
              <button
                key={DAYS[i]}
                type="button"
                className={s.col}
                data-hover={hover === i}
                aria-label={`${DAYS[i]}: ${formatSom(v)} ${m.unit}`}
                tabIndex={active ? 0 : -1}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
              >
                <span
                  className={s.bar}
                  style={{ height: `${pct(v)}%`, transitionDelay: shown ? `${i * 45}ms` : "0ms" }}
                />
                {i === maxIdx && hover === null && shown && (
                  <span className={s.capLabel} style={{ bottom: `calc(${pct(v)}% + 8px)` }}>
                    {formatSom(v)}
                  </span>
                )}
                {hover === i && (
                  <span className={s.tip} style={{ bottom: `calc(${pct(v)}% + 10px)` }}>
                    <b>{DAYS[i]}</b>
                    {formatSom(v)} {m.unit}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className={s.axis} aria-hidden>
          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>

      {/* Table twin of the chart for screen readers and keyboard users. */}
      <table className={ui.srOnly}>
        <caption>
          {m.label} по дням недели, {m.unit}
        </caption>
        <tbody>
          {DAYS.map((day, i) => (
            <tr key={day}>
              <th scope="row">{day}</th>
              <td>{formatSom(m.values[i])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={s.insight}>
        Пятница и суббота дают {WEEKEND_SHARE}% недельной выручки — понятно, в какие дни запускать акции.
      </p>
    </div>
  );
}
