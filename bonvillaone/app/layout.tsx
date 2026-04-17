import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import LayoutContent from "@/screens/HomeScreen/LayoutContent";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bonvilla — Elevated Activewear",
  description:
    "Premium gymwear designed to sculpt, support, and elevate your everyday strength.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased relative">
        {/* Ambient background layers */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden
        >
          <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] bg-[--color-crimson]/[0.04] rounded-full blur-[140px]" />
          <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-[--color-gold]/[0.12] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[400px] bg-[--color-slate]/[0.03] rounded-full blur-[100px]" />
        </div>
        <div className="noise-overlay" aria-hidden />

        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
