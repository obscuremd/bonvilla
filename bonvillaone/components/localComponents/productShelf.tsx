"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./productCard";

function ProductShelf({
  title,
  label,
  products: list,
}: {
  title: string;
  label: string;
  products: ProductData[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_AMOUNT = 520; // px per click — roughly 2 cards

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }

  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <span className="section-label">{label}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#5b1619]">
            {title}
          </h2>
        </div>

        {/* Right side: View All + arrows */}
        <div className="flex items-center gap-2">
          <Link href="/shop">
            <Button
              variant="ghost"
              className="hidden sm:flex font-body text-sm text-[#5b1619] hover:bg-[#5b1619]/5 rounded-full px-4"
            >
              View All →
            </Button>
          </Link>

          {/* Prev arrow */}
          <motion.button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            animate={{ opacity: canScrollLeft ? 1 : 0.3 }}
            whileHover={canScrollLeft ? { scale: 1.06 } : {}}
            whileTap={canScrollLeft ? { scale: 0.94 } : {}}
            transition={{ duration: 0.18 }}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-200 ${
              canScrollLeft
                ? "border-[#5b1619]/25 text-[#5b1619] bg-white hover:bg-[#5b1619] hover:text-white hover:border-[#5b1619] shadow-sm"
                : "border-[#425362]/10 text-[#425362]/25 bg-white cursor-default"
            }`}
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </motion.button>

          {/* Next arrow */}
          <motion.button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            animate={{ opacity: canScrollRight ? 1 : 0.3 }}
            whileHover={canScrollRight ? { scale: 1.06 } : {}}
            whileTap={canScrollRight ? { scale: 0.94 } : {}}
            transition={{ duration: 0.18 }}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-200 ${
              canScrollRight
                ? "border-[#5b1619]/25 text-[#5b1619] bg-white hover:bg-[#5b1619] hover:text-white hover:border-[#5b1619] shadow-sm"
                : "border-[#425362]/10 text-[#425362]/25 bg-white cursor-default"
            }`}
          >
            <ChevronRight size={16} strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-gold" />

      {/* Scroll shelf — no scrollbar */}
      <div className="relative">
        {/* Left fade mask */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10"
            />
          )}
        </AnimatePresence>

        {/* Right fade mask */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10"
            />
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Mobile: View All link */}
      <div className="sm:hidden text-center pt-1">
        <Link href="/shop">
          <Button
            variant="outline"
            size="sm"
            className="font-body text-xs text-[#5b1619] border-[#5b1619]/20 rounded-full px-6 hover:bg-[#5b1619] hover:text-white"
          >
            View All
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default ProductShelf;
