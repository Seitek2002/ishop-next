"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { CONTACTS, FEATURES, INCLUDED } from "../content";
import { DESKTOP, gsap, MOTION_OK, useGSAP, type ScrollTrigger } from "../lib/gsap";
import { scrollToY } from "../lib/scroll";
import Logo from "./Logo";
import ui from "../ui.module.scss";
import s from "./Included.module.scss";

const pad = (n: number) => String(n).padStart(2, "0");
const PAPER = 1; // timeline duration of the paper feed; the stamp lands after it

type Geometry = { H: number; h0: number; bottoms: number[] };

/**
 * The offer as a till receipt. On desktop the section pins and the paper feeds out of
 * the printer as you scroll; the left column explains the line being printed.
 * On small screens or with reduced motion it is a static receipt with descriptions inline.
 */
export default function Included() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const geomRef = useRef<Geometry>({ H: 0, h0: 0, bottoms: [] });
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [printed, setPrinted] = useState(FEATURES.length);
  const [active, setActive] = useState(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Intl.DateTimeFormat("ru-RU").format(new Date()));
  }, []);

  useGSAP(
    () => {
      const paper = paperRef.current;
      const stamp = stampRef.current;
      if (!paper || !stamp) return;
      const mm = gsap.matchMedia();

      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const measure = () => {
          const bottoms = lineRefs.current.map((li) => (li ? li.offsetTop + li.offsetHeight : 0));
          geomRef.current = { H: paper.offsetHeight, h0: bottoms[0] + 6, bottoms };
        };
        measure();

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            // ~200px of scroll per printed line: slow enough to read the explanation on the left.
            end: () => `+=${(geomRef.current.H - geomRef.current.h0) * 2.8 + 500}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
          onUpdate: () => {
            const g = geomRef.current;
            const emerged = g.H - Number(gsap.getProperty(paper, "y"));
            const n = g.bottoms.filter((b) => b <= emerged + 2).length;
            setPrinted(n);
            setActive(Math.max(0, Math.min(FEATURES.length - 1, n - 1)));
          },
        });

        tl.fromTo(paper, { y: () => geomRef.current.H - geomRef.current.h0 }, { y: 0, duration: PAPER });
        tl.fromTo(
          stamp,
          { scale: 2.6, opacity: 0, rotate: -34 },
          { scale: 1, opacity: 1, rotate: -12, duration: 0.07, ease: "back.out(2.4)" },
          PAPER + 0.03,
        );
        tl.to({}, { duration: 0.12 });
        triggerRef.current = tl.scrollTrigger ?? null;

        return () => {
          triggerRef.current = null;
          setPrinted(FEATURES.length);
          setActive(0);
        };
      });

      // Static receipt on phones: the stamp still lands when it scrolls into view.
      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        gsap.fromTo(
          stamp,
          { scale: 2.6, opacity: 0, rotate: -34 },
          {
            scale: 1,
            opacity: 1,
            rotate: -12,
            duration: 0.6,
            ease: "back.out(2.4)",
            scrollTrigger: { trigger: stamp, start: "top 75%" },
          },
        );
      });
    },
    { scope: rootRef },
  );

  // Progress segments scroll to the point where that line has just been printed.
  const jumpTo = (i: number) => {
    const st = triggerRef.current;
    const g = geomRef.current;
    if (!st || !g.H) return;
    const feed = (g.bottoms[i] + 4 - g.h0) / (g.H - g.h0);
    const total = st.animation?.duration() ?? PAPER;
    const progress = Math.min(1, Math.max(0, (feed * PAPER) / total));
    scrollToY(st.start + (st.end - st.start) * progress);
  };

  const current = FEATURES[active];

  return (
    <section ref={rootRef} id="included" data-theme="ink" className={s.section} aria-labelledby="included-title">
      <div ref={pinRef} className={s.pin}>
        <div className={`${ui.wrap} ${s.layout}`}>
          <div className={s.left}>
            <div className={s.intro}>
              <h2 id="included-title" className={ui.h2}>
                {INCLUDED.title}
              </h2>
              <p className={ui.lead}>
                {INCLUDED.lead} <span className={s.scrollHint}>{INCLUDED.scrollHint}</span>
              </p>
            </div>

            <div className={s.detail}>
              <div className={s.counter} aria-hidden>
                <span key={active} className={s.counterNow}>
                  {pad(active + 1)}
                </span>
                <span className={s.counterAll}>из {FEATURES.length}</span>
              </div>
              <div key={active} className={s.detailBody}>
                <h3 className={s.detailTitle}>{current.title}</h3>
                <p className={s.detailText}>{current.text}</p>
              </div>
              <div className={s.segments}>
                {FEATURES.map((f, i) => (
                  <button
                    key={f.line}
                    type="button"
                    className={s.seg}
                    data-on={i < printed}
                    data-current={i === active}
                    aria-label={`Позиция ${i + 1}: ${f.line}`}
                    onClick={() => jumpTo(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={s.right}>
            <div className={s.window}>
              <div ref={paperRef} className={s.paper}>
                <header className={s.rHead}>
                  <Logo className={s.rLogo} />
                  <div className={s.rBrand}>iShop.kg</div>
                  <div className={s.rTitle}>{INCLUDED.receiptTitle}</div>
                  <dl className={s.rMeta}>
                    <div>
                      <dt>Кому</dt>
                      <dd>{INCLUDED.recipient}</dd>
                    </div>
                    <div>
                      <dt>Дата</dt>
                      <dd suppressHydrationWarning>{date || "сегодня"}</dd>
                    </div>
                    <div>
                      <dt>Тел.</dt>
                      <dd>{CONTACTS.phone}</dd>
                    </div>
                  </dl>
                </header>

                <ol className={s.items}>
                  {FEATURES.map((f, i) => (
                    <li
                      key={f.line}
                      ref={(el) => {
                        lineRefs.current[i] = el;
                      }}
                      className={s.item}
                      data-printed={i < printed}
                    >
                      <span className={s.num}>{pad(i + 1)}</span>
                      <span className={s.name}>{f.line}</span>
                      <span className={s.leader} aria-hidden />
                      <span className={s.val}>вкл.</span>
                      <span className={s.desc}>{f.text}</span>
                    </li>
                  ))}
                </ol>

                <dl className={s.totals}>
                  {INCLUDED.totals.map((t) => (
                    <div key={t.label}>
                      <dt>{t.label}</dt>
                      <dd>{t.value}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={CONTACTS.demoUrl}
                  target="_blank"
                  rel="noopener"
                  className={s.qrRow}
                  data-cursor="Демо"
                >
                  <QRCode value={CONTACTS.demoUrl} size={88} bgColor="transparent" fgColor="#1C0F24" />
                  <span>{INCLUDED.qrCaption}</span>
                </a>
                <p className={s.thanks}>*** {INCLUDED.thanks} ***</p>

                <div ref={stampRef} className={s.stamp} aria-hidden>
                  {INCLUDED.stamp}
                </div>
              </div>
            </div>

            <div className={s.printer} aria-hidden>
              <span className={s.slot} />
              <span className={s.led} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
