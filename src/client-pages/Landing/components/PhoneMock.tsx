"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Search, ShoppingBag } from "lucide-react";
import { formatSom } from "../lib/scroll";
import s from "./PhoneMock.module.scss";

// Demo storefront inside the hero phone. Buttons work, so a visitor can try the
// buying flow their own customers would see.
const PRODUCTS = [
  { id: "shawarma", name: "Шаурма с курицей", price: 290, img: "/assets/images/Catalog/item-1.webp" },
  { id: "burger", name: "Чизбургер", price: 350, img: "/assets/images/Catalog/item-2.webp" },
  { id: "fries", name: "Картофель с беконом", price: 270, img: "/assets/images/Catalog/item-6.webp" },
  { id: "cake", name: "Шоколадный торт", price: 320, img: "/assets/images/Catalog/item-5.webp" },
];

const MODES = ["Доставка", "Самовывоз", "На месте"];
const CHIPS = ["Популярное", "Шаурма", "Бургеры", "Десерты"];

export default function PhoneMock() {
  const [mode, setMode] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({ burger: 1 });
  const [bump, setBump] = useState(0);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);

  const change = (id: string, delta: number) => {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
    setBump((b) => b + 1);
  };

  return (
    <div className={s.phone}>
      <div className={s.screen}>
        <div className={s.status} aria-hidden>
          <span>9:41</span>
          <span className={s.island} />
          <span className={s.sys}>
            <i />
            <i />
            <i />
          </span>
        </div>

        <div className={s.store}>
          <div className={s.storeHead}>
            <span className={s.avatar} aria-hidden>
              ВБ
            </span>
            <div>
              <div className={s.storeName}>Ваш бренд</div>
              <div className={s.storeMeta}>Открыто до 23:00</div>
            </div>
            <span className={s.searchBtn} aria-hidden>
              <Search size={14} strokeWidth={2.4} />
            </span>
          </div>

          <div className={s.modes} role="group" aria-label="Способ получения заказа">
            <span className={s.modeIndicator} style={{ transform: `translateX(${mode * 100}%)` }} aria-hidden />
            {MODES.map((m, i) => (
              <button
                key={m}
                type="button"
                className={s.mode}
                aria-pressed={mode === i}
                onClick={() => setMode(i)}
              >
                {m}
              </button>
            ))}
          </div>

          <div className={s.chips} aria-hidden>
            {CHIPS.map((c, i) => (
              <span key={c} className={i === 0 ? `${s.chip} ${s.chipActive}` : s.chip}>
                {c}
              </span>
            ))}
          </div>

          <div className={s.grid}>
            {PRODUCTS.map((p) => {
              const qty = cart[p.id] ?? 0;
              return (
                <article key={p.id} className={s.card}>
                  <div className={s.img}>
                    <Image src={p.img} alt="" fill sizes="140px" />
                  </div>
                  <div className={s.name}>{p.name}</div>
                  <div className={s.row}>
                    <span className={s.price}>{p.price} с</span>
                    <span className={s.stepper} data-active={qty > 0}>
                      {qty > 0 && (
                        <>
                          <button
                            type="button"
                            className={s.step}
                            aria-label={`Убрать «${p.name}» из корзины`}
                            onClick={() => change(p.id, -1)}
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className={s.qty}>{qty}</span>
                        </>
                      )}
                      <button
                        type="button"
                        className={s.step}
                        aria-label={`Добавить «${p.name}» в корзину`}
                        onClick={() => change(p.id, 1)}
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className={s.cartBar} data-empty={count === 0} aria-live="polite">
          <span className={s.cartIcon}>
            <ShoppingBag size={16} strokeWidth={2.2} />
            <span key={bump} className={s.badge}>
              {count}
            </span>
          </span>
          <span className={s.cartLabel}>{count === 0 ? "Корзина пуста" : MODES[mode]}</span>
          <span className={s.cartTotal}>{formatSom(total)} с</span>
        </div>
      </div>
    </div>
  );
}
