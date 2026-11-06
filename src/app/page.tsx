import type { Metadata } from "next";
import Landing from "@/client-pages/Landing";
import { landingFontVars } from "@/client-pages/Landing/fonts";

export const metadata: Metadata = {
  title: "iShop.kg — интернет-магазин под вашим брендом за один день",
  description:
    "Коммерческое предложение для кафе, ресторанов и магазинов Кыргызстана: брендированная витрина, заказы 24/7, QR-оплата, доставка и AI-оператор. Подключение 0 сом.",
};

export default function Page() {
  return <Landing fontVars={landingFontVars} />;
}
