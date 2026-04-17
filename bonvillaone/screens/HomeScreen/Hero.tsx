"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1689007657910-544b2dea3bb0?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1624513764372-a4eb7b334c62?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1759572986822-db7e5b173ded?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=60",
];

const stats = [
  { value: "2k+", label: "Styles" },
  { value: "98%", label: "5-Star Reviews" },
  { value: "Free", label: "Returns" },
];

interface HeroProps {
  headline?: string;
  subline?: string;
  ctaLabel?: string;
}

export default function Hero({
  headline = "Move With Intention.",
  subline = "Premium gymwear designed to sculpt, support, and elevate your everyday strength — crafted for women who move with purpose.",
  ctaLabel = "Shop Now",
}: HeroProps) {
  /* Split headline at last word for the gold ✦ trick */
  const words = headline.split(" ");
  const last = words.pop();
  const first = words.join(" ");

  return (
    <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute right-0 top-0 h-full w-[55%] bg-[rgba(91,22,25,0.025)] rounded-l-[100px]" />
        <div className="absolute right-[12%] top-[10%] w-[380px] h-[380px] rounded-full bg-[rgba(244,214,164,0.25)] blur-[100px]" />
        <div className="absolute left-[-5%] bottom-[10%] w-[300px] h-[300px] rounded-full bg-[rgba(91,22,25,0.04)] blur-[80px]" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
        {/* ── LEFT ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-7 max-w-lg order-2 md:order-1"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[rgba(91,22,25,0.3)]" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-[rgba(91,22,25,0.6)] font-semibold">
              Elevated Activewear
            </span>
          </div>

          {/* Headline from CMS */}
          <div className="space-y-1">
            {first && (
              <h1 className="font-display text-[clamp(44px,7vw,76px)] font-bold text-[#5b1619] leading-[0.95]">
                {first}
              </h1>
            )}
            <h1 className="font-display text-[clamp(44px,7vw,76px)] font-bold text-[#5b1619] leading-[0.95] flex items-end gap-3">
              {last}
              <span className="text-[#f4d6a4] text-3xl lg:text-4xl mb-3 leading-none">
                ✦
              </span>
            </h1>
          </div>

          {/* Gold rule */}
          <div className="flex items-center gap-2">
            <div className="h-px w-10 bg-[#f4d6a4]" />
            <div className="h-px w-3 bg-[rgba(244,214,164,0.4)]" />
          </div>

          {/* Body — from CMS */}
          <p className="font-body text-[15px] lg:text-base text-[rgba(66,83,98,0.7)] leading-relaxed max-w-[340px]">
            {subline}
          </p>

          {/* Stats */}
          <div className="flex gap-7 py-1">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-[#5b1619]">
                  {value}
                </p>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[rgba(66,83,98,0.45)] mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/shop">
              <button className="btn-primary gap-2.5 text-sm">
                {ctaLabel}
                <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                  <ArrowRight size={11} />
                </span>
              </button>
            </Link>
            <Link href="/collections">
              <button className="btn-outline text-sm">View Collections</button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white bg-[rgba(244,214,164,0.5)] overflow-hidden"
                >
                  <Image
                    src={`https://i.pravatar.cc/40?img=${i + 10}`}
                    width={28}
                    height={28}
                    alt=""
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className="fill-[#f4d6a4] text-[#f4d6a4]"
                />
              ))}
            </div>
            <span className="font-body text-[11px] text-[rgba(66,83,98,0.55)]">
              Trusted by 12,000+ women
            </span>
          </div>
        </motion.div>

        {/* ── RIGHT: dual scrolling strips ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="relative flex gap-3 lg:gap-4 h-[560px] md:h-[640px] order-1 md:order-2"
        >
          <div className="relative flex-[3] rounded-[28px] overflow-hidden shadow-2xl shadow-[rgba(91,22,25,0.15)] ring-1 ring-[rgba(244,214,164,0.2)]">
            <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-background to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-background to-transparent z-10" />
            <motion.div
              animate={{ y: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex flex-col"
            >
              {[...images, ...images].map((src, i) => (
                <div key={i} className="relative h-[340px] flex-shrink-0">
                  <Image
                    src={src}
                    alt="Bonvilla Activewear"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative flex-[2] rounded-[28px] overflow-hidden shadow-xl shadow-[rgba(91,22,25,0.1)] ring-1 ring-[rgba(244,214,164,0.15)] mt-12 mb-[-24px]">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10" />
            <motion.div
              animate={{ y: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
              className="flex flex-col"
            >
              {[...images, ...images].map((src, i) => (
                <div key={i} className="relative h-[290px] flex-shrink-0">
                  <Image
                    src={src}
                    alt="Bonvilla Activewear"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.65,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -left-4 lg:-left-6 bottom-20 z-20 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-[rgba(91,22,25,0.12)] border border-[rgba(244,214,164,0.5)] flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-[rgba(91,22,25,0.08)] flex items-center justify-center text-sm shrink-0">
              ✦
            </div>
            <div>
              <p className="font-body text-xs font-bold text-[#5b1619] leading-tight">
                New Arrivals
              </p>
              <p className="font-body text-[10px] text-[rgba(66,83,98,0.55)] tracking-wide mt-0.5">
                Summer &apos;25 Collection
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.8,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -right-3 top-16 z-20"
          >
            <Badge className="bg-[#5b1619] text-[#f4d6a4] font-body font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg shadow-[rgba(91,22,25,0.3)]">
              Up to 30% OFF
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
