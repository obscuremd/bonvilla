"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  _id: string;
  name: string;
  slug: string;
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[--border]"
          : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo/BON 4.png" className="w-24 md:w-28" alt="Bonvilla" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Shop dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button className="nav-link flex items-center gap-1 px-4 py-2">
              Shop
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
                  className="absolute top-full left-0 mt-1 bg-white border border-[--border] rounded-2xl shadow-xl shadow-[--color-crimson]/8 p-2 min-w-[180px] z-50"
                >
                  <Link
                    href="/shop"
                    className="block px-3 py-2 rounded-lg font-body text-xs font-semibold tracking-[0.15em] uppercase text-[--color-crimson]/60 hover:bg-[--color-cream] hover:text-[--color-crimson] transition-colors"
                  >
                    All Products
                  </Link>
                  <div className="my-1 divider-subtle" />
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug}`}
                      className="block px-3 py-2 rounded-lg font-body text-sm text-[--color-slate]/70 hover:bg-[--color-cream] hover:text-[--color-crimson] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {staticLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link px-4 py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-[--color-slate]/60 hover:text-[--color-crimson] hover:bg-[--color-crimson]/5 transition-all">
            <Search size={16} />
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-[--color-slate]/60 hover:text-[--color-crimson] hover:bg-[--color-crimson]/5 transition-all">
            <ShoppingBag size={16} />
            <span className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full bg-[--color-crimson]" />
          </button>
          <div className="w-px h-5 bg-[--color-slate]/10 mx-1" />
          <Link href="/auth">
            <button className="btn-outline py-2 px-5 text-sm">Sign In</button>
          </Link>
          <Link href="/auth?tab=register">
            <button className="btn-primary py-2 px-5 text-sm">Join</button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button className="relative text-[--color-crimson]">
            <ShoppingBag size={18} />
            <span className="absolute top-0 right-0 w-[5px] h-[5px] rounded-full bg-[--color-crimson]" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[--color-crimson]/20 text-[--color-crimson] hover:bg-[--color-crimson]/5 transition-all"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-white border-t border-[--border]"
          >
            <nav className="flex flex-col px-4 py-6 gap-1">
              {/* Categories */}
              <p className="section-label px-3 mb-2">Shop</p>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold font-body text-[--color-crimson]/70 hover:bg-[--color-cream] rounded-xl transition-all"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-body text-[--color-slate]/70 hover:bg-[--color-cream] hover:text-[--color-crimson] rounded-xl transition-all"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="my-2 divider-subtle" />
              {staticLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-body text-[--color-slate]/70 hover:bg-[--color-cream] rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-4 pt-4 border-t border-[--border]">
                <Link
                  href="/auth"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="btn-outline w-full py-3 text-sm">
                    Sign In
                  </button>
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="btn-primary w-full py-3 text-sm">
                    Join
                  </button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
