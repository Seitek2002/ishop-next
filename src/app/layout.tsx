import type { Metadata } from "next";
import "./globals.css";
import "./legacy-styles.scss";
import Providers from "./providers";
import WsGuard from "@/components/WsGuard";
import { Inter } from "next/font/google";

const geistInter = Inter({
  variable: "--font-geist-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ishop",
  description: "ishop — онлайн-меню и заказы",
  icons: {
    icon: "/assets/icons/header-logo.svg",
    shortcut: "/assets/icons/header-logo.svg",
    apple: "/assets/icons/header-logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistInter.variable} antialiased`}>
        <WsGuard />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
