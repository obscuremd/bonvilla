"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingCart,
  Users,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/cms", icon: LayoutDashboard },
  { label: "Categories", href: "/cms/categories", icon: Tag },
  { label: "Products", href: "/cms/products", icon: Package },
  { label: "Orders", href: "/cms/orders", icon: ShoppingCart },
  { label: "Users", href: "/cms/users", icon: Users },
  { label: "Content", href: "/cms/content", icon: FileText },
];

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="flex min-h-screen bg-[--color-bg]">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-[--color-border] bg-[--color-surface]">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[--color-border]">
          <p className="font-display text-lg font-bold text-[--color-text] tracking-wide">
            BONVILLA
          </p>
          <p className="font-body text-[9px] tracking-[0.35em] uppercase text-[--color-gold]/50 mt-0.5">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const active =
              path === href || (href !== "/cms" && path.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`cms-nav-item ${active ? "active" : ""}`}
              >
                <Icon size={15} />
                <span>{label}</span>
                {active && (
                  <ChevronRight
                    size={12}
                    className="ml-auto text-[--color-gold]/40"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[--color-border]">
          <button className="cms-nav-item w-full text-left text-red-400/60 hover:text-red-400 hover:bg-red-500/8">
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-[--color-border] bg-[--color-surface]/80 backdrop-blur-sm sticky top-0 z-30">
          <h1 className="font-body font-semibold text-sm text-[--color-text]">
            {nav.find(
              (n) =>
                path === n.href ||
                (n.href !== "/cms" && path.startsWith(n.href)),
            )?.label ?? "CMS"}
          </h1>
          <Link href="/" className="btn-text text-[10px]">
            ← View Site
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
