"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Star,
} from "lucide-react";
import ProductShelf from "@/components/localComponents/productShelf";
import { AuthDialog } from "@/components/localComponents/AuthDialog";
import { addToCart } from "../../cart/page";

/* ── Gallery ───────────────────────────────────── */
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
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#faf8f5] ring-1 ring-[rgba(244,214,164,0.2)]">
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
            {images[main] && (
              <Image
                src={images[main]}
                alt="Product"
                fill
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>

        {[
          {
            label: "‹",
            fn: () => go((main - 1 + images.length) % images.length),
            pos: "left-3",
          },
          {
            label: "›",
            fn: () => go((main + 1) % images.length),
            pos: "right-3",
          },
        ].map(({ label, fn, pos }) => (
          <button
            key={label}
            onClick={fn}
            className={`absolute ${pos} top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(244,214,164,0.4)] text-[rgba(66,83,98,0.6)] hover:text-[#5b1619] hover:border-[rgba(91,22,25,0.25)] transition-all flex items-center justify-center text-lg shadow-sm`}
          >
            {label}
          </button>
        ))}

        <div className="absolute bottom-4 right-4 font-body text-[10px] text-[rgba(66,83,98,0.4)] tracking-widest">
          {String(main + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`relative flex-shrink-0 w-[68px] h-[88px] rounded-xl overflow-hidden border-2 transition-all duration-250 ${
              main === i
                ? "border-[rgba(91,22,25,0.5)] scale-[1.04] shadow-sm"
                : "border-[rgba(244,214,164,0.3)] opacity-55 hover:opacity-90 hover:border-[rgba(244,214,164,0.6)]"
            }`}
          >
            {src && <Image src={src} alt="" fill className="object-cover" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Accordion ─────────────────────────────────── */
function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[rgba(244,214,164,0.3)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-body text-sm font-medium text-[rgba(66,83,98,0.8)]">
          {title}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
        >
          <ChevronDown size={14} className="text-[rgba(91,22,25,0.4)]" />
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
            <div className="pb-5 font-body text-sm text-[rgba(66,83,98,0.6)] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Product Page ──────────────────────────────── */
export default function ProductPage() {
  const params = useParams<{ slug: string }>();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [loved, setLoved] = useState(false);
  const [added, setAdded] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setIsLoggedIn(!!d?.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/products?slug=${params.slug}&limit=1`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.products?.[0] ?? null;
        setProduct(p);
        if (p) {
          const catId =
            typeof p.category === "object" ? p.category?._id : p.category;
          fetch(`/api/products?category=${catId}&limit=6`)
            .then((r) => r.json())
            .then((d2) =>
              setRelated(
                (d2.products ?? []).filter((x: ProductData) => x._id !== p._id),
              ),
            );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params?.slug]);

  if (loading)
    return (
      <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
        <div className="aspect-[3/4] rounded-2xl bg-[#faf8f5] animate-pulse" />
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-6 rounded-lg bg-[#faf8f5] animate-pulse"
              style={{ width: `${70 - i * 10}%` }}
            />
          ))}
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-32 space-y-4">
        <p className="font-display text-3xl text-[rgba(91,22,25,0.4)]">
          Product not found
        </p>
        <Link href="/shop" className="btn-primary inline-flex">
          Back to Shop
        </Link>
      </div>
    );

  const color = product.colorVariants[colorIdx] ?? {
    name: "",
    hex: "#000",
    images: [],
    stock: 0,
  };
  const discount = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100,
  );

  function handleAddToBag() {
    if (!size) return;

    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }

    addToCart({
      productId: product!._id,
      slug: product!.slug,
      name: product!.name,
      category:
        typeof product!.category === "object"
          ? (product!.category?.name ?? "")
          : "",
      color: color.name,
      colorHex: color.hex,
      size,
      imageUrl: color.images?.[0] ?? "",
      unitPrice: product!.discountedPrice,
      quantity: qty,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="w-full space-y-24">
      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Gallery images={color.images?.length ? color.images : [""]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-7 lg:sticky lg:top-24"
        >
          {/* Category + badge */}
          <div className="flex items-center gap-3">
            <span className="section-label">
              {typeof product.category === "object"
                ? product.category?.name
                : ""}
            </span>
            {product.badge && (
              <span className="badge-gold">{product.badge}</span>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#5b1619]">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="font-body text-sm text-[rgba(66,83,98,0.5)] italic">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(product.rating)
                      ? "fill-[#f4d6a4] text-[#f4d6a4]"
                      : "text-[rgba(66,83,98,0.15)]"
                  }
                />
              ))}
            </div>
            <span className="font-body text-sm font-semibold text-[#5b1619]">
              {product.rating}
            </span>
            <span className="font-body text-xs text-[rgba(66,83,98,0.35)]">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="font-display text-4xl font-bold text-[#5b1619]">
              ${product.discountedPrice}
            </span>
            <span className="font-body text-lg text-[rgba(66,83,98,0.3)] line-through">
              ${product.originalPrice}
            </span>
            <span className="badge-gold">Save {discount}%</span>
          </div>

          <div className="divider-subtle" />

          {/* Colour */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="label-form">Colour</span>
              <span className="font-body text-sm text-[#5b1619] font-medium">
                {color.name}
              </span>
            </div>
            <div className="flex gap-3">
              {product.colorVariants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setColorIdx(i);
                    setSize(null);
                  }}
                  title={v.name}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    colorIdx === i
                      ? "border-[#5b1619] scale-110 shadow-md shadow-[rgba(91,22,25,0.2)]"
                      : "border-transparent ring-1 ring-[rgba(244,214,164,0.5)] hover:ring-[rgba(244,214,164,1)]"
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="label-form">Size</span>
              <button className="font-body text-[11px] text-[rgba(91,22,25,0.5)] underline underline-offset-2 hover:text-[#5b1619] transition-colors">
                Size Guide
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-10 rounded-lg font-body text-sm font-medium border-2 transition-all duration-200 ${
                    size === s
                      ? "bg-[#5b1619] text-white border-[#5b1619]"
                      : "bg-transparent text-[rgba(66,83,98,0.6)] border-[rgba(244,214,164,0.5)] hover:border-[rgba(91,22,25,0.4)] hover:text-[#5b1619]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock warning */}
          {color.stock > 0 && color.stock <= 5 && (
            <p className="font-body text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              Only {color.stock} left in this colour!
            </p>
          )}

          {/* Qty + CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[rgba(244,214,164,0.5)] rounded-full overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-11 flex items-center justify-center text-[rgba(66,83,98,0.5)] hover:text-[#5b1619] transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center font-body font-medium text-[rgba(66,83,98,0.8)] text-sm">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-11 flex items-center justify-center text-[rgba(66,83,98,0.5)] hover:text-[#5b1619] transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              onClick={handleAddToBag}
              disabled={!size}
              className={`flex-1 h-11 rounded-full font-body font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                added
                  ? "bg-green-600 text-white"
                  : size
                    ? "btn-primary h-11"
                    : "bg-[#faf8f5] text-[rgba(66,83,98,0.3)] border border-[rgba(244,214,164,0.3)] cursor-default"
              }`}
            >
              <ShoppingBag size={14} />
              {added ? "Added to Bag ✓" : size ? "Add to Bag" : "Select a Size"}
            </button>

            <button
              onClick={() => setLoved(!loved)}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                loved
                  ? "bg-[#5b1619] border-[#5b1619] text-white"
                  : "border-[rgba(244,214,164,0.5)] text-[rgba(66,83,98,0.4)] hover:border-[rgba(91,22,25,0.4)] hover:text-[#5b1619]"
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
                className="flex flex-col items-center gap-1.5 p-3 surface-cream rounded-xl"
              >
                <Icon size={14} className="text-[#5b1619]" />
                <span className="font-body text-[10px] font-semibold text-[rgba(66,83,98,0.6)] text-center leading-tight">
                  {label}
                </span>
                <span className="font-body text-[9px] text-[rgba(66,83,98,0.35)] text-center">
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
                {product.features?.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#f4d6a4] mt-0.5 text-xs">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Size & Fit">
              Our model is 5&apos;8&quot; and wears size S. Fits true to size
              with a compressive feel. If between sizes, size up for a relaxed
              fit.
            </Accordion>
            <Accordion title="Care Instructions">
              Machine wash cold (30°C), gentle cycle. Lay flat to dry. Do not
              tumble dry, bleach, or iron.
            </Accordion>
            <Accordion title="Delivery & Returns">
              Standard delivery 3–5 business days. Free returns within 30 days —
              unworn with tags attached.
            </Accordion>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-[rgba(244,214,164,0.3)] pt-20">
          <ProductShelf
            title="You May Also Love"
            label="Recommended"
            products={related}
          />
        </div>
      )}

      {/* Auth dialog */}
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultMode="login"
        onSuccess={(u) => {
          setIsLoggedIn(true);
          setAuthOpen(false);
        }}
      />
    </div>
  );
}
