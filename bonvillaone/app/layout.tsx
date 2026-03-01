import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Header from "@/components/localComponents/header";
import Footer from "@/components/localComponents/footer";

// Refined dual-font pairing: editorial serif display + clean geometric sans
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} bg-white`}
    >
      <body className="font-body antialiased relative text-[#425362] bg-white">
        {/* Ambient background layers */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Warm top-left accent */}
          <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] bg-[#5b1619]/[0.04] rounded-full blur-[140px]" />
          {/* Gold center glow */}
          <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-[#f4d6a4]/[0.12] rounded-full blur-[120px]" />
          {/* Bottom blue-grey */}
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[400px] bg-[#425362]/[0.03] rounded-full blur-[100px]" />
        </div>

        {/* Fine grain texture overlay */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Layout shell */}
        <div className="flex flex-col min-h-screen">
          <div className="px-5 md:px-12 lg:px-20">
            <Header />
          </div>

          <main className="flex-1 px-5 md:px-12 lg:px-20 py-8 space-y-24 md:space-y-32">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
