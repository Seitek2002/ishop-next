"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CHAT } from "../content";
import Logo from "./Logo";
import d from "./demo.module.scss";
import s from "./AiChat.module.scss";

type Msg = { id: number; from: "client" | "ai"; text: string; time: string };

// Deepened channel hues so white message text keeps >= 4.5:1 contrast.
const CHANNEL_COLORS = ["#0f7a40", "#186fa6", "#c9245c"];

const opening = (): Msg[] => [
  { id: 0, from: "client", text: CHAT.opener.client, time: "23:47" },
  { id: 1, from: "ai", text: CHAT.opener.ai, time: "23:47" },
];

// The visitor plays the customer; canned answers show how the operator handles a late-night order.
export default function AiChat({ active }: { active: boolean }) {
  const [channel, setChannel] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>(opening);
  const [used, setUsed] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const nextId = useRef(2);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const minute = (offset: number) => `23:${String(Math.min(59, 48 + offset)).padStart(2, "0")}`;

  const ask = (i: number) => {
    if (typing || used.includes(i)) return;
    const reply = CHAT.replies[i];
    const t = minute(used.length);
    setUsed((u) => [...u, i]);
    setMsgs((m) => [...m, { id: nextId.current++, from: "client", text: reply.ask, time: t }]);
    setTyping(true);
    timer.current = window.setTimeout(
      () => {
        setTyping(false);
        setMsgs((m) => [...m, { id: nextId.current++, from: "ai", text: reply.answer, time: t }]);
      },
      Math.min(1800, 700 + reply.answer.length * 10),
    );
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setTyping(false);
    setUsed([]);
    setMsgs(opening());
  };

  const left = CHAT.replies.map((r, i) => ({ ...r, i })).filter((r) => !used.includes(r.i));

  return (
    <div className={d.card} style={{ "--channel": CHANNEL_COLORS[channel] } as React.CSSProperties}>
      <div className={d.cardHead}>
        <div className={s.who}>
          <span className={s.avatar}>
            <Logo className={s.avatarLogo} />
          </span>
          <span>
            <span className={s.name}>Ваш бренд</span>
            <span className={s.status}>
              <i className={s.online} /> AI-оператор, {CHAT.channels[channel]}
            </span>
          </span>
        </div>
        <div
          className={d.segmented}
          role="group"
          aria-label="Канал"
          style={{ "--count": CHAT.channels.length, "--index": channel } as React.CSSProperties}
        >
          {CHAT.channels.map((c, i) => (
            <button
              key={c}
              type="button"
              className={d.segment}
              aria-pressed={channel === i}
              onClick={() => setChannel(i)}
              tabIndex={active ? 0 : -1}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div ref={listRef} className={s.list} aria-live="polite" data-lenis-prevent>
        <div className={s.day}>Сегодня, ночью</div>
        {msgs.map((m) => (
          <div key={m.id} className={s.msg} data-from={m.from}>
            <p className={s.bubble}>
              {m.text}
              <span className={s.time}>{m.time}</span>
            </p>
          </div>
        ))}
        {typing && (
          <div className={s.msg} data-from="ai">
            <p className={`${s.bubble} ${s.typing}`} aria-label="AI-оператор печатает">
              <i />
              <i />
              <i />
            </p>
          </div>
        )}
      </div>

      <div className={s.composer}>
        <span className={s.hint}>{left.length ? "Спросите как покупатель" : "Диалог завершён"}</span>
        <div className={s.chips}>
          {left.map((r) => (
            <button key={r.ask} type="button" className={s.chip} disabled={typing} onClick={() => ask(r.i)}>
              {r.ask}
            </button>
          ))}
          {used.length > 0 && (
            <button type="button" className={`${s.chip} ${s.reset}`} onClick={reset}>
              <RotateCcw size={14} strokeWidth={2.4} aria-hidden />
              Начать заново
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
