"use client";

import { useEffect, useRef, useState } from "react";
import { QrCode, ShoppingBag, Truck, UtensilsCrossed, type LucideIcon } from "lucide-react";
import s from "./OrderFeed.module.scss";

// Illustrative notifications a store owner receives; cycles while the hero is on screen.
const ORDERS: { icon: LucideIcon; title: string; meta: string; sum: string }[] = [
  { icon: Truck, title: "Новый заказ №1042", meta: "Доставка", sum: "2 450 с" },
  { icon: QrCode, title: "Оплачено по QR", meta: "Заказ №1041", sum: "1 180 с" },
  { icon: UtensilsCrossed, title: "Заказ на стол №7", meta: "На месте", sum: "3 600 с" },
  { icon: ShoppingBag, title: "Новый заказ №1043", meta: "Самовывоз", sum: "890 с" },
];

type Item = { key: number; idx: number };

export default function OrderFeed({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setItems([{ key: 0, idx: 0 }]);
      return;
    }

    let n = 0;
    let onScreen = true;
    const push = () => {
      if (!onScreen || document.hidden) return;
      const item = { key: n, idx: n % ORDERS.length };
      n += 1;
      setItems((prev) => [item, ...prev].slice(0, 4));
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(el);

    const first = window.setTimeout(push, 1700);
    const timer = window.setInterval(push, 3000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className ? `${s.feed} ${className}` : s.feed} aria-hidden>
      {items.map((item, pos) => {
        const order = ORDERS[item.idx];
        const Icon = order.icon;
        return (
          <div key={item.key} className={s.slot} style={{ "--pos": pos } as React.CSSProperties}>
            <div className={s.note}>
              <span className={s.icon}>
                <Icon size={18} strokeWidth={2.2} />
              </span>
              <span className={s.body}>
                <span className={s.title}>{order.title}</span>
                <span className={s.meta}>{order.meta}</span>
              </span>
              <span className={s.side}>
                <span className={s.sum}>{order.sum}</span>
                <span className={s.time}>сейчас</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
