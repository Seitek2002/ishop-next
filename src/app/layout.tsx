import type { Metadata } from "next";
import "./globals.css";
import "./legacy-styles.scss";
import Providers from "./providers";
import WsGuard from "@/components/WsGuard";

export const metadata: Metadata = {
  title: "ishop",
  description: "ishop — онлайн-меню и заказы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <WsGuard />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
