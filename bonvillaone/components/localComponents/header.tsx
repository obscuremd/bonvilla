"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthDialog } from "@/components/localComponents/AuthDialog";

interface Category {
  _id: string;
  name: string;
  slug: string;
}
interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const staticLinks = [
  { label: "Bestsellers", href: "/bestsellers" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("bon_cart") ?? "[]");
      setCartCount(
        cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0),
      );
    };
    update();
    window.addEventListener("bon_cart_update", update);
    return () => window.removeEventListener("bon_cart_update", update);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  }

  function openAuth(mode: "login" | "register") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[rgba(244,214,164,0.3)]" : "bg-transparent"}`}
      >
        <div className="w-full flex justify-between items-center h-16 md:h-20">
          <Link href="/">
            <img
              src="/logo/BON 4.png"
              className="w-24 md:w-28"
              alt="Bonvilla"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="nav-link flex items-center gap-1 px-4 py-2">
                Shop{" "}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {shopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 bg-white border border-[rgba(244,214,164,0.4)] rounded-2xl shadow-xl p-2 min-w-[180px] z-50"
                  >
                    <Link
                      href="/shop"
                      className="block px-3 py-2.5 rounded-lg font-body text-sm text-[rgba(66,83,98,0.7)] hover:bg-[#faf8f5] hover:text-[#5b1619] transition-colors"
                    >
                      All Products
                    </Link>
                    <div className="my-1 divider-subtle" />
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/category/${cat.slug}`}
                        className="block px-3 py-2.5 rounded-lg font-body text-sm text-[rgba(66,83,98,0.7)] hover:bg-[#faf8f5] hover:text-[#5b1619] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {staticLinks.map((l) => (
              <Link key={l.label} href={l.href} className="nav-link px-4 py-2">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-[rgba(66,83,98,0.6)] hover:text-[#5b1619] hover:bg-[rgba(91,22,25,0.05)] transition-all">
              <Search size={16} />
            </button>
            <Link href="/cart">
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-[rgba(66,83,98,0.6)] hover:text-[#5b1619] hover:bg-[rgba(91,22,25,0.05)] transition-all">
                <ShoppingBag size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#5b1619] text-white font-body font-bold text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
            <div className="w-px h-5 bg-[rgba(66,83,98,0.15)] mx-1" />
            {user ? (
              <div className="flex items-center gap-2">
                {(user.role === "admin" || user.role === "super_admin") && (
                  <Link href="/cms">
                    <button className="btn-outline py-2 px-4 text-xs">
                      CMS
                    </button>
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 font-body text-sm text-[rgba(66,83,98,0.7)] hover:text-[#5b1619] px-3 py-2 rounded-full hover:bg-[rgba(91,22,25,0.05)] transition-all">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border-2 border-[rgba(244,214,164,0.4)]"
                      />
                    ) : (
                      <User size={16} />
                    )}
                    <span className="max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-[rgba(244,214,164,0.4)] rounded-xl shadow-xl p-2 min-w-[140px] z-50">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg font-body text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="btn-outline py-2 px-5 text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="btn-primary py-2 px-5 text-sm"
                >
                  Join
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart">
              <button className="relative text-[#5b1619]">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5b1619] text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(91,22,25,0.2)] text-[#5b1619]"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="md:hidden overflow-hidden bg-white border-t border-[rgba(244,214,164,0.3)]"
            >
              <nav className="flex flex-col px-4 py-6 gap-1">
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 font-body text-sm text-[rgba(66,83,98,0.7)] hover:bg-[#faf8f5] rounded-xl"
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 font-body text-sm text-[rgba(66,83,98,0.7)] hover:bg-[#faf8f5] rounded-xl"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="my-2 divider-subtle" />
                {staticLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 font-body text-sm text-[rgba(66,83,98,0.7)] hover:bg-[#faf8f5] rounded-xl"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="flex gap-3 mt-4 pt-4 border-t border-[rgba(244,214,164,0.3)]">
                  {user ? (
                    <button
                      onClick={logout}
                      className="btn-outline w-full py-3 text-sm text-red-500 border-red-200"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          openAuth("login");
                        }}
                        className="btn-outline flex-1 py-3 text-sm"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          openAuth("register");
                        }}
                        className="btn-primary flex-1 py-3 text-sm"
                      >
                        Join
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultMode={authMode}
        onSuccess={(u) => {
          setUser(u);
          setAuthOpen(false);
          if (u.role === "admin" || u.role === "super_admin")
            window.location.href = "/cms";
        }}
      />
    </>
  );
}
