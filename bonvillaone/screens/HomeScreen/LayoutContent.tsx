"use client";

import Footer from "@/components/localComponents/footer";
import Header from "@/components/localComponents/header";
import { usePathname } from "next/navigation";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-5 md:px-12 lg:px-20">
        {!pathname.startsWith("/cms") && <Header />}
      </div>
      <main className="flex-1 px-5 md:px-12 lg:px-20 py-8 space-y-24 md:space-y-32">
        {children}
      </main>
      {!pathname.startsWith("/cms") && <Footer />}
    </div>
  );
}
