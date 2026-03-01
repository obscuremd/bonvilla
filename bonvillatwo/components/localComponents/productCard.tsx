"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus } from "lucide-react";

export default function ProductCard({ product }: { product: ProductData }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setIsHovered] = useState(false);
  const [loved, setLoved] = useState(false);

  const variant = product.colorVariants[variantIdx];
  const discount = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100,
  );

  return (
    <Link href={`/product/${product.slug}`} className="block flex-shrink-0">
      <motion.article
        className="relative w-[168px] sm:w-[200px] md:w-[220px] cursor-pointer group"
        onHoverStart={() => {
          setIsHovered(true);
          if (variant.images.length > 1) setImgIdx(1);
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          setImgIdx(0);
        }}
      >
        {/* ── Image frame ── */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#111113] rounded-xl border border-white/6">
          {/* Images crossfade */}
          {variant.images.map((src, i) => (
            <motion.img
              key={`${variantIdx}-${i}`}
              src={src}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{
                opacity: imgIdx === i ? 1 : 0,
                scale: imgIdx === i ? 1 : 1.04,
              }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            />
          ))}

          {/* Gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/20 to-transparent" />

          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            {product.badge ? (
              <span
                className={`font-body text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full ${
                  product.badge === "Bestseller"
                    ? "bg-[#c9a96e] text-[#0a0a0b]"
                    : "bg-[#f0ece4]/10 text-[#f0ece4] border border-white/10"
                }`}
              >
                {product.badge}
              </span>
            ) : (
              <span />
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                setLoved(!loved);
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                loved
                  ? "bg-[#c9a96e] text-[#0a0a0b]"
                  : "bg-[#0a0a0b]/40 border border-white/10 text-[#f0ece4]/40 opacity-0 group-hover:opacity-100"
              }`}
            >
              <Heart size={11} fill={loved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Bottom content inside image */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-3 space-y-2.5">
            {/* Slide-up Add button */}
            <AnimatePresence>
              {hovered && (
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.preventDefault()}
                  className="w-full flex items-center justify-center gap-2 bg-[#c9a96e] hover:bg-[#dfc08a] text-[#0a0a0b] font-body font-semibold text-[10px] tracking-[0.1em] uppercase py-2.5 rounded-lg transition-colors duration-200"
                >
                  <Plus size={11} strokeWidth={2.5} />
                  Add to Bag
                </motion.button>
              )}
            </AnimatePresence>

            {/* Color swatches */}
            <div className="flex items-center gap-1.5">
              {product.colorVariants.map((v, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setVariantIdx(i);
                    setImgIdx(0);
                  }}
                  className={`w-3 h-3 rounded-full border transition-all duration-200 ${
                    variantIdx === i
                      ? "border-[#c9a96e] scale-[1.35] shadow-sm shadow-[#c9a96e]/30"
                      : "border-white/20 hover:border-white/50"
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              ))}
              {/* Image dot indicator */}
              {variant.images.length > 1 && (
                <div className="ml-auto flex gap-0.5">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-300 ${
                        imgIdx === i
                          ? "w-3.5 h-1 bg-[#c9a96e]"
                          : "w-1 h-1 bg-white/25"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Discount ribbon */}
          <div className="absolute top-3 left-0 -z-0">
            <span className="font-body text-[9px] font-bold text-[#c9a96e] bg-[#c9a96e]/10 border-r border-t border-b border-[#c9a96e]/20 py-1 px-2 rounded-r-full">
              -{discount}%
            </span>
          </div>
        </div>

        {/* ── Info below image ── */}
        <div className="pt-3 space-y-1.5 px-0.5">
          <p className="font-body text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]/60">
            {product.category}
          </p>
          <h3 className="font-body text-[13px] font-medium text-[#f0ece4]/80 leading-tight group-hover:text-[#f0ece4] transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="font-body text-sm font-semibold text-[#c9a96e]">
              ${product.discountedPrice}
            </span>
            <span className="font-body text-xs text-[#f0ece4]/22 line-through">
              ${product.originalPrice}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
