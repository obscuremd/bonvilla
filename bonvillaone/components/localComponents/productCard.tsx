/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Heart, ShoppingBag, Star } from "lucide-react";

export default function ProductCard({ product }: { product: ProductData }) {
  // Guard: if product is missing essential data, render nothing (or a placeholder)
  if (
    !product ||
    !product.colorVariants ||
    product.colorVariants.length === 0
  ) {
    return (
      <div className="relative w-[170px] sm:w-[210px] md:w-[230px] flex-shrink-0">
        <div className="w-full h-[240px] sm:h-[280px] md:h-[300px] rounded-2xl bg-gray-100 animate-pulse" />
        <div className="pt-2.5 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  // Safely get the current variant (fallback if index is out of bounds)
  const variant = product.colorVariants[activeVariantIdx];
  const hasSecondImage = variant.images && variant.images.length > 1;
  const discount = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100,
  );

  function handleVariantChange(idx: number) {
    if (product.colorVariants[idx]) {
      setActiveVariantIdx(idx);
      setImageIdx(0);
    }
  }

  // Safe image array (fallback to placeholder)
  const images = variant.images?.length
    ? variant.images
    : ["/placeholder-image.jpg"];

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <motion.div
        className="relative w-[170px] sm:w-[210px] md:w-[230px] flex-shrink-0 group cursor-pointer"
        onHoverStart={() => {
          setIsHovered(true);
          if (hasSecondImage) setImageIdx(1);
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          setImageIdx(0);
        }}
      >
        {/* Image container */}
        <div className="relative w-full h-[240px] sm:h-[280px] md:h-[300px] rounded-2xl overflow-hidden bg-[#faf8f5]">
          {images.map((src, i) => (
            <motion.img
              key={`${activeVariantIdx}-${i}`}
              src={src}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: imageIdx === i ? 1 : 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
          ))}

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Badge
                className={`font-body text-[9px] sm:text-[10px] font-semibold tracking-wide rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 ${
                  product.badge === "Bestseller"
                    ? "bg-[#5b1619] text-[#f4d6a4]"
                    : "bg-[#f4d6a4] text-[#5b1619]"
                }`}
              >
                {product.badge}
              </Badge>
            </div>
          )}

          {/* Discount tag */}
          {discount > 0 && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="font-body text-[9px] sm:text-[10px] font-bold bg-white text-[#5b1619] rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-sm">
                -{discount}%
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlist(!wishlist);
            }}
            className={`absolute top-9 sm:top-11 right-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              wishlist
                ? "bg-[#5b1619] text-white"
                : "bg-white/80 text-[#425362] opacity-0 group-hover:opacity-100"
            } shadow-sm`}
          >
            <Heart size={11} fill={wishlist ? "currentColor" : "none"} />
          </button>

          {/* Image dot indicator (only if more than 1 image) */}
          {hasSecondImage && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    imageIdx === i
                      ? "w-3.5 h-1 sm:w-4 sm:h-1.5 bg-white"
                      : "w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Add to cart – slides up on hover */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 12, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 z-10 p-2.5 sm:p-3"
          >
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full flex items-center justify-center gap-1.5 bg-[#5b1619] hover:bg-[#4a1113] text-white font-body font-semibold text-[10px] sm:text-xs py-2 sm:py-2.5 rounded-xl transition-colors duration-200 shadow-lg shadow-[#5b1619]/25"
            >
              <ShoppingBag size={11} />
              Add to Bag
            </button>
          </motion.div>
        </div>

        {/* Info row */}
        <div className="pt-2.5 sm:pt-3 px-0.5 space-y-1.5 sm:space-y-2">
          {/* Color swatches (only if variants exist) */}
          {product.colorVariants.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              {product.colorVariants.map((v, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    handleVariantChange(i);
                  }}
                  title={v.name}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${
                    activeVariantIdx === i
                      ? "border-[#5b1619] scale-125 shadow-sm"
                      : "border-transparent hover:border-[#5b1619]/40"
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              ))}
              <span className="font-body text-[9px] sm:text-[10px] text-[#425362]/50 ml-0.5 sm:ml-1">
                {variant.name}
              </span>
            </div>
          )}

          {/* Name + category */}
          <div>
            {/* <p className="font-body text-[9px] sm:text-[10px] text-[#425362]/45 uppercase tracking-widest">
                {product.category}
              </p> */}
            <h3 className="font-body text-xs sm:text-sm font-semibold text-[#425362] leading-tight mt-0.5 group-hover:text-[#5b1619] transition-colors duration-200">
              {product.name}
            </h3>
          </div>

          {/* Price + rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="font-body text-sm sm:text-base font-bold text-[#5b1619]">
                ${product.discountedPrice}
              </span>
              <span className="font-body text-[10px] sm:text-xs text-[#425362]/40 line-through">
                ${product.originalPrice}
              </span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star size={9} className="fill-[#f4d6a4] text-[#f4d6a4]" />
              <span className="font-body text-[9px] sm:text-[10px] text-[#425362]/60">
                {product.rating}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
