"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductShelf from "@/components/localComponents/productShelf";
import { products } from "@/lib/data";

/* ─── Dummy product data ─────────────────────── */
const product = {
  id: "1",
  name: "Sculpt Seamless Set",
  category: "Matching Set",
  tagline: "Engineered for every curve, built for every rep.",
  description:
    "The Sculpt Seamless Set is crafted from our signature 4-way stretch fabric that moves with your body — not against it. With targeted compression zones, a buttery-soft feel, and a second-skin fit, this set supports you through every squat, stretch and sprint.",
  originalPrice: 89,
  discountedPrice: 62,
  rating: 4.9,
  reviewCount: 214,
  badge: "Bestseller",
  features: [
    "Moisture-wicking seamless knit",
    "4-way stretch with shape retention",
    "Medium-impact bra with removable pads",
    "High-rise waistband with tummy control",
    "Squat-proof fabric technology",
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
  colorVariants: [
    {
      name: "Onyx",
      hex: "#1a1a1a",
      images: [
        "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW4lMjBmaXRuZXNzfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      name: "Dusty Rose",
      hex: "#d4a0a0",
      images: [
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW4lMjBmaXRuZXNzfGVufDB8fDB8fHww",
      ],
    },
    {
      name: "Sage",
      hex: "#a8b5a0",
      images: [
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80",
      ],
    },
  ],
};

/* ─── Image Gallery ──────────────────────────── */
function ImageGallery({ images }: { images: string[] }) {
  const [mainIdx, setMainIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Promote thumbnail at idx to front: current main slides to last thumb
  function selectImage(idx: number) {
    if (idx === mainIdx) return;
    setDirection(idx > mainIdx ? 1 : -1);
    setMainIdx(idx);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-[#faf8f5] shadow-xl shadow-[#5b1619]/10 ring-1 ring-[#f4d6a4]/20">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={mainIdx}
            custom={direction}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[mainIdx]}
              alt="Product"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={() =>
            selectImage((mainIdx - 1 + images.length) % images.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#5b1619] shadow hover:bg-white transition"
        >
          ‹
        </button>
        <button
          onClick={() => selectImage((mainIdx + 1) % images.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#5b1619] shadow hover:bg-white transition"
        >
          ›
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => selectImage(i)}
            className={`relative flex-shrink-0 w-[72px] h-[90px] rounded-xl overflow-hidden transition-all duration-300 ${
              mainIdx === i
                ? "ring-2 ring-[#5b1619] ring-offset-2 scale-105 shadow-md"
                : "ring-1 ring-[#f4d6a4]/30 opacity-60 hover:opacity-100 hover:ring-[#5b1619]/30"
            }`}
          >
            <Image src={src} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Accordion Item ─────────────────────────── */
function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#f4d6a4]/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-body font-semibold text-sm text-[#425362]">
          {title}
        </span>
        {open ? (
          <ChevronUp size={15} className="text-[#5b1619]" />
        ) : (
          <ChevronDown size={15} className="text-[#425362]/50" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 font-body text-sm text-[#425362]/70 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Product Page ───────────────────────────── */
export default function ProductPage() {
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);

  const activeColor = product.colorVariants[activeColorIdx];
  const discount = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100,
  );

  function handleAddToBag() {
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2200);
  }

  return (
    <div className="w-full space-y-24">
      {/* Breadcrumb */}
      <nav className="font-body text-xs text-[#425362]/45 flex items-center gap-2">
        <Link href="/" className="hover:text-[#5b1619] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#5b1619] transition-colors">
          Shop
        </Link>
        <span>/</span>
        <Link
          href="/shop/sets"
          className="hover:text-[#5b1619] transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#5b1619]">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
        {/* ── Gallery ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ImageGallery images={activeColor.images} />
        </motion.div>

        {/* ── Product info ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="space-y-7 lg:sticky lg:top-24"
        >
          {/* Category + badge */}
          <div className="flex items-center gap-3">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#5b1619]/55 font-semibold">
              {product.category}
            </span>
            {product.badge && (
              <Badge className="bg-[#5b1619] text-[#f4d6a4] font-body text-[10px] font-semibold px-2.5 rounded-full">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Name */}
          <div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#5b1619]">
              {product.name}
            </h1>
            <p className="font-body text-sm text-[#425362]/60 mt-2 italic">
              {product.tagline}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(product.rating)
                      ? "fill-[#f4d6a4] text-[#f4d6a4]"
                      : "text-[#425362]/20"
                  }
                />
              ))}
            </div>
            <span className="font-body text-sm font-semibold text-[#5b1619]">
              {product.rating}
            </span>
            <span className="font-body text-xs text-[#425362]/45">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-[#5b1619]">
              ${product.discountedPrice}
            </span>
            <span className="font-body text-lg text-[#425362]/40 line-through">
              ${product.originalPrice}
            </span>
            <span className="font-body text-xs font-bold bg-[#f4d6a4]/40 text-[#5b1619] px-2.5 py-1 rounded-full">
              Save {discount}%
            </span>
          </div>

          <div className="divider-gold" />

          {/* Color selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm font-semibold text-[#425362]">
                Colour
              </span>
              <span className="font-body text-sm text-[#5b1619] font-medium">
                {activeColor.name}
              </span>
            </div>
            <div className="flex gap-3">
              {product.colorVariants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setActiveColorIdx(i)}
                  title={v.name}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    activeColorIdx === i
                      ? "border-[#5b1619] shadow-md scale-110"
                      : "border-transparent hover:border-[#5b1619]/30 hover:scale-105"
                  }`}
                  style={{ backgroundColor: v.hex }}
                >
                  {activeColorIdx === i && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-[#5b1619]/30" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm font-semibold text-[#425362]">
                Size
              </span>
              <button className="font-body text-xs text-[#5b1619] underline underline-offset-2">
                Size Guide
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-10 rounded-xl font-body text-sm font-semibold border transition-all duration-200 ${
                    selectedSize === s
                      ? "bg-[#5b1619] text-white border-[#5b1619] shadow-md"
                      : "bg-transparent text-[#425362] border-[#425362]/20 hover:border-[#5b1619] hover:text-[#5b1619]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + CTA row */}
          <div className="flex items-center gap-3">
            {/* Qty picker */}
            <div className="flex items-center border border-[#425362]/15 rounded-full overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-11 flex items-center justify-center text-[#425362] hover:bg-[#f4d6a4]/20 transition-colors font-body font-semibold text-lg"
              >
                −
              </button>
              <span className="w-10 text-center font-body font-semibold text-[#425362] text-sm">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-11 flex items-center justify-center text-[#425362] hover:bg-[#f4d6a4]/20 transition-colors font-body font-semibold text-lg"
              >
                +
              </button>
            </div>

            {/* Add to bag */}
            <Button
              onClick={handleAddToBag}
              disabled={!selectedSize}
              className={`flex-1 h-11 rounded-full font-body font-semibold text-sm gap-2 transition-all duration-300 ${
                addedToBag
                  ? "bg-green-600 hover:bg-green-600 text-white shadow-lg"
                  : "bg-[#5b1619] hover:bg-[#4a1113] text-white hover:shadow-xl hover:shadow-[#5b1619]/25 hover:-translate-y-[1px]"
              } disabled:opacity-40`}
            >
              <ShoppingBag size={15} />
              {addedToBag
                ? "Added ✓"
                : selectedSize
                  ? "Add to Bag"
                  : "Select a Size"}
            </Button>

            {/* Wishlist */}
            <button
              onClick={() => setWishlist(!wishlist)}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
                wishlist
                  ? "bg-[#5b1619] border-[#5b1619] text-white shadow-md"
                  : "border-[#425362]/20 text-[#425362] hover:border-[#5b1619] hover:text-[#5b1619]"
              }`}
            >
              <Heart size={15} fill={wishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-3 py-2">
            {[
              { icon: Truck, label: "Free Delivery", sub: "Orders over $50" },
              { icon: RotateCcw, label: "Free Returns", sub: "30-day window" },
              { icon: Shield, label: "Secure Pay", sub: "SSL encrypted" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#faf8f5] border border-[#f4d6a4]/30"
              >
                <Icon size={16} className="text-[#5b1619]" />
                <span className="font-body text-[10px] font-semibold text-[#425362] text-center leading-tight">
                  {label}
                </span>
                <span className="font-body text-[9px] text-[#425362]/45 text-center">
                  {sub}
                </span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="space-y-0">
            <AccordionItem title="Product Details">
              <p className="mb-3">{product.description}</p>
              <ul className="space-y-1.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#f4d6a4] mt-0.5">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Size & Fit">
              Our model is 5&apos;8&quot; and wears size S. The Sculpt Seamless
              Set fits true to size with a body-hugging, compressive fit. If you
              are between sizes, we recommend sizing up for a more relaxed feel.
            </AccordionItem>
            <AccordionItem title="Care Instructions">
              Machine wash cold (30°C) on a gentle cycle. Do not tumble dry —
              lay flat to preserve shape. Do not bleach or iron. Wash inside out
              for best longevity.
            </AccordionItem>
            <AccordionItem title="Delivery & Returns">
              Standard delivery: 3–5 business days. Express delivery: 1–2
              business days. Free returns within 30 days of purchase — items
              must be unworn with tags attached.
            </AccordionItem>
          </div>
        </motion.div>
      </div>

      {/* Recommended */}
      <div className="border-t border-[#f4d6a4]/30 pt-16">
        <ProductShelf
          title="Made for You"
          label="Recommended"
          products={[...products].reverse()}
        />
      </div>
    </div>
  );
}
