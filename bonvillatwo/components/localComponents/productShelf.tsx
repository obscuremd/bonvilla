"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./productCard";

export default function ProductShelf({
  title,
  label,
  products,
}: {
  title: string;
  label: string;
  products: ProductData[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const check = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [check]);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -500 : 500,
      behavior: "smooth",
    });

  return (
    <section className="w-full space-y-7">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <span className="label-tag">{label}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#f0ece4]">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="hidden sm:block font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ece4]/30 hover:text-[#c9a96e] transition-colors duration-200 border-b border-transparent hover:border-[#c9a96e]/30 pb-0.5"
          >
            View All
          </Link>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2">
            {[
              { dir: "left" as const, can: canLeft, Icon: ArrowLeft },
              { dir: "right" as const, can: canRight, Icon: ArrowRight },
            ].map(({ dir, can, Icon }) => (
              <motion.button
                key={dir}
                onClick={() => scroll(dir)}
                disabled={!can}
                animate={{ opacity: can ? 1 : 0.2 }}
                whileHover={can ? { scale: 1.05 } : {}}
                whileTap={can ? { scale: 0.95 } : {}}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                  can
                    ? "border-white/10 text-[#f0ece4]/50 hover:border-[#c9a96e]/40 hover:text-[#c9a96e] hover:bg-[#c9a96e]/8"
                    : "border-white/5 text-[#f0ece4]/15 cursor-default"
                }`}
              >
                <Icon size={14} strokeWidth={1.5} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Gold rule */}
      <div className="divider-gold" />

      {/* Scroll container */}
      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 transition-opacity duration-300"
          style={{ opacity: canLeft ? 1 : 0 }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 transition-opacity duration-300"
          style={{ opacity: canRight ? 1 : 0 }}
        />

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
