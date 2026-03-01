import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Outfit } from "next/font/google";
import Header from "@/components/localComponents/header";
import Footer from "@/components/localComponents/footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
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
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="font-body antialiased bg-[#0a0a0b] text-[#f0ece4] min-h-screen">
        {/* Ambient radial glows */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#c9a96e]/[0.04] blur-[160px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#c9a96e]/[0.03] blur-[130px]" />
        </div>
        {/* Global noise texture */}
        <div className="noise-overlay fixed" />

        <div className="flex flex-col min-h-screen">
          <div className="px-5 md:px-10 lg:px-16">
            <Header />
          </div>
          <main className="flex-1 px-5 md:px-10 lg:px-16 py-10 space-y-28 md:space-y-36">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
