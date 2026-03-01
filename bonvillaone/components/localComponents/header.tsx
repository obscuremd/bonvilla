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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm shadow-[#5b1619]/5 border-b border-[#f4d6a4]/30"
          : "bg-transparent"
      }`}
    >
      <div className="w-full mx-auto flex justify-between items-center h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          <img src="/logo/BON 4.png" className="w-24 md:w-28" alt="Bonvilla" />
        </Link>

        {/* Desktop Nav — centered */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-[#425362] hover:text-[#5b1619] transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute bottom-1 left-4 right-4 h-px bg-[#f4d6a4] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#425362] hover:text-[#5b1619] hover:bg-[#5b1619]/5 transition-all duration-200">
            <Search size={17} />
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#425362] hover:text-[#5b1619] hover:bg-[#5b1619]/5 transition-all duration-200">
            <ShoppingBag size={17} />
            <span className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full bg-[#5b1619]" />
          </button>
          <div className="w-px h-5 bg-[#425362]/15 mx-1" />
          <Link href="/auth">
            <button className="text-sm font-semibold text-[#5b1619] px-5 py-2 rounded-full border border-[#5b1619]/20 hover:bg-[#5b1619] hover:text-white hover:border-[#5b1619] transition-all duration-300">
              Sign In
            </button>
          </Link>
          <Link href="/auth?tab=register">
            <button className="text-sm font-semibold text-white bg-[#5b1619] px-5 py-2 rounded-full hover:bg-[#4a1113] hover:shadow-lg hover:shadow-[#5b1619]/25 hover:-translate-y-[1px] transition-all duration-300">
              Join
            </button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#5b1619]">
            <ShoppingBag size={18} />
            <span className="absolute top-1.5 right-1.5 w-[5px] h-[5px] rounded-full bg-[#5b1619]" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#5b1619]/20 text-[#5b1619] hover:bg-[#5b1619]/5 transition-all"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-white border-t border-[#f4d6a4]/30"
          >
            <nav className="flex flex-col px-4 py-6 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-[#425362] hover:text-[#5b1619] hover:bg-[#5b1619]/5 rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-3 mt-4 pt-4 border-t border-[#f4d6a4]/30">
                <Link
                  href="/auth"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="w-full py-3 text-sm font-semibold text-[#5b1619] border border-[#5b1619]/20 rounded-full hover:bg-[#5b1619]/5 transition-all">
                    Sign In
                  </button>
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="w-full py-3 text-sm font-semibold text-white bg-[#5b1619] rounded-full hover:bg-[#4a1113] transition-all">
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
