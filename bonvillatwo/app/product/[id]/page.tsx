"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import { products } from "@/lib/data";
import ProductShelf from "@/components/localComponents/productShelf";

/* ── Dummy product ───────────────────────── */
const product = {
  name: "Sculpt Seamless Set",
  category: "Matching Set",
  tagline: "Engineered for every curve, built for every rep.",
  description:
    "The Sculpt Seamless Set is crafted from our signature 4-way stretch fabric that moves with your body — not against it. Targeted compression zones, buttery-soft feel, and a second-skin fit support you through every squat, stretch and sprint.",
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
        "https://images.unsplash.com/photo-1695407893256-d57e95db4eda?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&auto=format&fit=crop&q=85",
      ],
    },
    {
      name: "Dusty Rose",
      hex: "#d4a0a0",
      images: [
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1695407893256-d57e95db4eda?w=900&auto=format&fit=crop&q=85",
      ],
    },
    {
      name: "Sage",
      hex: "#a8b5a0",
      images: [
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=900&auto=format&fit=crop&q=85",
      ],
    },
  ],
};

/* ── Gallery ─────────────────────────────── */
function Gallery({ images }: { images: string[] }) {
  const [main, setMain] = useState(0);
  const [dir, setDir] = useState(1);

  function go(i: number) {
    if (i === main) return;
    setDir(i > main ? 1 : -1);
    setMain(i);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#111113] border border-white/6">
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.div
            key={main}
            custom={dir}
            initial={{ x: dir * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -40, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[main]}
              alt="Product"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Prev / next */}
        {[
          {
            label: "‹",
            fn: () => go((main - 1 + images.length) % images.length),
            side: "left-3",
          },
          {
            label: "›",
            fn: () => go((main + 1) % images.length),
            side: "right-3",
          },
        ].map(({ label, fn, side }) => (
          <button
            key={label}
            onClick={fn}
            className={`absolute ${side} top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#0a0a0b]/60 backdrop-blur-sm border border-white/10 text-[#f0ece4]/60 hover:text-[#c9a96e] hover:border-[#c9a96e]/30 transition-all duration-200 flex items-center justify-center text-base`}
          >
            {label}
          </button>
        ))}

        {/* Index counter */}
        <div className="absolute bottom-4 right-4 font-body text-[10px] text-[#f0ece4]/35 tracking-widest">
          {String(main + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </div>
      </div>

      {/* Thumbnails */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`relative flex-shrink-0 w-[68px] h-[88px] rounded-xl overflow-hidden border transition-all duration-250 ${
              main === i
                ? "border-[#c9a96e]/60 shadow-sm shadow-[#c9a96e]/10 scale-[1.04]"
                : "border-white/6 opacity-50 hover:opacity-80 hover:border-white/15"
            }`}
          >
            <Image src={src} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Accordion ───────────────────────────── */
function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-body text-sm font-medium text-[#f0ece4]/70">
          {title}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
        >
          <ChevronDown size={14} className="text-[#c9a96e]/50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 font-body text-sm text-[#f0ece4]/40 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ────────────────────────────────── */
export default function ProductPage() {
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [loved, setLoved] = useState(false);
  const [added, setAdded] = useState(false);

  const color = product.colorVariants[colorIdx];
  const discount = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100,
  );

  function addToBag() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="w-full space-y-28">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ece4]/25">
        {[
          ["Home", "/"],
          ["Shop", "/shop"],
          [product.category, "/shop/sets"],
          [product.name, "#"],
        ].map(([label, href], i, arr) => (
          <span key={label} className="flex items-center gap-2">
            <Link
              href={href}
              className={
                i === arr.length - 1
                  ? "text-[#c9a96e]/60"
                  : "hover:text-[#f0ece4]/50 transition-colors"
              }
            >
              {label}
            </Link>
            {i < arr.length - 1 && <span className="text-[#f0ece4]/12">/</span>}
          </span>
        ))}
      </nav>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Gallery images={color.images} />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-8 lg:sticky lg:top-24"
        >
          {/* Category + badge */}
          <div className="flex items-center gap-3">
            <span className="label-tag">{product.category}</span>
            {product.badge && (
              <span className="badge-gold">{product.badge}</span>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#f0ece4]">
              {product.name}
            </h1>
            <p className="font-body text-sm text-[#f0ece4]/35 italic">
              {product.tagline}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  fill={i < Math.round(product.rating) ? "#c9a96e" : "none"}
                  stroke="#c9a96e"
                  size={13}
                  opacity={i < Math.round(product.rating) ? 1 : 0.2}
                />
              ))}
            </div>
            <span className="font-body text-sm font-medium text-[#c9a96e]">
              {product.rating}
            </span>
            <span className="font-body text-xs text-[#f0ece4]/25">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="font-display text-4xl font-bold text-[#f0ece4]">
              ${product.discountedPrice}
            </span>
            <span className="font-body text-lg text-[#f0ece4]/22 line-through">
              ${product.originalPrice}
            </span>
            <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase bg-[#c9a96e]/12 text-[#c9a96e] border border-[#c9a96e]/20 px-2.5 py-1 rounded-full">
              Save {discount}%
            </span>
          </div>

          <div className="h-px bg-white/6" />

          {/* Colour */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#f0ece4]/35 font-medium">
                Colour
              </span>
              <span className="font-body text-sm text-[#c9a96e]">
                {color.name}
              </span>
            </div>
            <div className="flex gap-3">
              {product.colorVariants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setColorIdx(i)}
                  title={v.name}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    colorIdx === i
                      ? "border-[#c9a96e] scale-110 shadow-md shadow-[#c9a96e]/20"
                      : "border-white/15 hover:border-white/35"
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#f0ece4]/35 font-medium">
                Size
              </span>
              <button className="font-body text-[11px] text-[#c9a96e]/60 underline underline-offset-2 hover:text-[#c9a96e] transition-colors">
                Size Guide
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-10 rounded-lg font-body text-sm font-medium border transition-all duration-200 ${
                    size === s
                      ? "bg-[#c9a96e] text-[#0a0a0b] border-[#c9a96e]"
                      : "bg-transparent text-[#f0ece4]/45 border-white/10 hover:border-[#c9a96e]/30 hover:text-[#f0ece4]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-white/10 rounded-full overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-11 flex items-center justify-center text-[#f0ece4]/40 hover:text-[#c9a96e] transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center font-body font-medium text-[#f0ece4]/70 text-sm">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-11 flex items-center justify-center text-[#f0ece4]/40 hover:text-[#c9a96e] transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              onClick={addToBag}
              disabled={!size}
              className={`flex-1 h-11 rounded-full font-body font-semibold text-xs tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                added
                  ? "bg-[#2a6e40] text-white"
                  : size
                    ? "bg-[#c9a96e] hover:bg-[#dfc08a] text-[#0a0a0b] hover:shadow-lg hover:shadow-[#c9a96e]/20 hover:-translate-y-[1px]"
                    : "bg-white/5 text-[#f0ece4]/20 cursor-default border border-white/8"
              }`}
            >
              <ShoppingBag size={14} />
              {added ? "Added ✓" : size ? "Add to Bag" : "Select a Size"}
            </button>

            <button
              onClick={() => setLoved(!loved)}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
                loved
                  ? "bg-[#c9a96e] border-[#c9a96e] text-[#0a0a0b]"
                  : "border-white/10 text-[#f0ece4]/30 hover:border-[#c9a96e]/30 hover:text-[#c9a96e]"
              }`}
            >
              <Heart size={14} fill={loved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Truck, label: "Free Delivery", sub: "Orders over $50" },
              { icon: RotateCcw, label: "Free Returns", sub: "30-day window" },
              { icon: Shield, label: "Secure Pay", sub: "SSL encrypted" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#111113] border border-white/5"
              >
                <Icon size={14} className="text-[#c9a96e]" />
                <span className="font-body text-[10px] font-medium text-[#f0ece4]/55 text-center leading-tight">
                  {label}
                </span>
                <span className="font-body text-[9px] text-[#f0ece4]/22 text-center">
                  {sub}
                </span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div>
            <Accordion title="Product Details">
              <p className="mb-3">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#c9a96e] mt-0.5 text-xs">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Size & Fit">
              Our model is 5&apos;8&quot; and wears size S. Fits true to size
              with a compressive, body-hugging feel. If between sizes, size up
              for a relaxed fit.
            </Accordion>
            <Accordion title="Care Instructions">
              Machine wash cold (30°C), gentle cycle. Lay flat to dry. Do not
              tumble dry, bleach, or iron. Wash inside out for longevity.
            </Accordion>
            <Accordion title="Delivery & Returns">
              Standard delivery 3–5 business days. Express 1–2 days. Free
              returns within 30 days — unworn with tags attached.
            </Accordion>
          </div>
        </motion.div>
      </div>

      {/* Recommended */}
      <div className="border-t border-white/5 pt-20">
        <ProductShelf
          title="You May Also Love"
          label="Recommended"
          products={products.slice(0, 5)}
        />
      </div>
    </div>
  );
}

function Star({
  fill,
  stroke,
  size,
  opacity,
}: {
  fill: string;
  stroke: string;
  size: number;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={1.5}
      opacity={opacity ?? 1}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
