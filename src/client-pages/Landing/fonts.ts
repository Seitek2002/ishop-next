import localFont from "next/font/local";
import { JetBrains_Mono, Onest } from "next/font/google";

// Brand display face, self-hosted from public/assets/fonts (CSP allows only 'self' fonts).
export const benzin = localFont({
  src: [
    { path: "../../../public/assets/fonts/Benzin-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../../public/assets/fonts/Benzin-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../../public/assets/fonts/Benzin-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../../public/assets/fonts/Benzin-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const onest = Onest({
  subsets: ["cyrillic", "latin"],
  variable: "--font-text",
  display: "swap",
});

// Used only for the receipt, where a monospace face is part of the object being depicted.
export const receiptMono = JetBrains_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-receipt",
  display: "swap",
});

export const landingFontVars = `${benzin.variable} ${onest.variable} ${receiptMono.variable}`;
