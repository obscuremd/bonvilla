"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "Activewear", href: "/activewear" },
  { label: "Bestsellers", href: "/bestsellers" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="relative w-full z-50">
      {/* Top announcement bar */}
      <div className="w-full border-b border-white/5 py-2 text-center">
        <p className="font-body text-[10px] tracking-[0.35em] uppercase text-[#c9a96e]/60">
          Complimentary Shipping on Orders Over $75 &nbsp;·&nbsp; New Summer
          Drop Now Live
        </p>
      </div>

      {/* Main nav bar */}
      <div
        className={`w-full transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* LEFT — Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ece4]/45 hover:text-[#c9a96e] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c9a96e] group-hover:w-full transition-all duration-400" />
              </Link>
            ))}
          </nav>

          {/* CENTER — Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex flex-col items-center gap-0.5">
              <span className="font-display text-xl md:text-2xl font-bold tracking-[0.12em] text-[#f0ece4]">
                BONVILLA
              </span>
              <span className="font-body text-[7px] tracking-[0.5em] uppercase text-[#c9a96e]/50 font-medium">
                Activewear
              </span>
            </Link>
          </div>

          {/* RIGHT — Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-[#f0ece4]/40 hover:text-[#c9a96e] transition-colors duration-200">
              <Search size={16} />
            </button>
            <button className="relative w-8 h-8 flex items-center justify-center text-[#f0ece4]/40 hover:text-[#c9a96e] transition-colors duration-200">
              <ShoppingBag size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Link href="/auth">
              <button className="font-body text-[11px] tracking-[0.15em] uppercase font-medium text-[#f0ece4]/50 hover:text-[#f0ece4] transition-colors duration-200 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full">
                Sign In
              </button>
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-3">
            <button className="relative text-[#f0ece4]/50 hover:text-[#c9a96e] transition-colors">
              <ShoppingBag size={18} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#f0ece4]/50 hover:text-[#f0ece4] transition-colors"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#111113]/98 backdrop-blur-xl border-b border-white/5 z-50"
          >
            <nav className="flex flex-col px-6 py-8 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block font-body text-sm tracking-[0.15em] uppercase text-[#f0ece4]/50 hover:text-[#c9a96e] transition-colors py-3 border-b border-white/5"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-3 pt-6">
                <Link
                  href="/auth"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="w-full py-3 font-body text-xs tracking-[0.2em] uppercase font-medium text-[#f0ece4]/50 border border-white/10 rounded-full hover:border-white/20 hover:text-[#f0ece4] transition-all">
                    Sign In
                  </button>
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="w-full py-3 font-body text-xs tracking-[0.2em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0b] rounded-full hover:bg-[#dfc08a] transition-all">
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
