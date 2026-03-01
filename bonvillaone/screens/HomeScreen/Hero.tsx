"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function Hero() {
  return (
    <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-full w-[55%] bg-[#5b1619]/[0.025] rounded-l-[100px]" />
        <div className="absolute right-[12%] top-[10%] w-[380px] h-[380px] rounded-full bg-[#f4d6a4]/25 blur-[100px]" />
        <div className="absolute left-[-5%] bottom-[10%] w-[300px] h-[300px] rounded-full bg-[#5b1619]/[0.04] blur-[80px]" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
        {/* ── LEFT: Text ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-7 max-w-lg order-2 md:order-1"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#5b1619]/30" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-[#5b1619]/60 font-semibold">
              Elevated Activewear
            </span>
          </div>

          {/* Headline — Cormorant display serif */}
          <div className="space-y-1">
            <h1 className="font-display text-[58px] lg:text-[76px] font-bold text-[#5b1619] leading-[0.95]">
              Move With
            </h1>
            <h1 className="font-display text-[58px] lg:text-[76px] font-bold text-[#5b1619] leading-[0.95] flex items-end gap-3">
              Intention.
              <span className="text-[#f4d6a4] text-3xl lg:text-4xl mb-3 leading-none">
                ✦
              </span>
            </h1>
          </div>

          {/* Gold rule */}
          <div className="flex items-center gap-2">
            <div className="h-px w-10 bg-[#f4d6a4]" />
            <div className="h-px w-3 bg-[#f4d6a4]/40" />
          </div>

          {/* Body copy */}
          <p className="font-body text-[15px] lg:text-base text-[#425362]/70 leading-relaxed max-w-[340px]">
            Premium gymwear designed to sculpt, support, and elevate your
            everyday strength — crafted for women who move with purpose.
          </p>

          {/* Stats */}
          <div className="flex gap-7 py-1">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-[#5b1619]">
                  {value}
                </p>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#425362]/45 mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-full px-8 gap-2.5 bg-[#5b1619] text-white hover:bg-[#4a1113] hover:shadow-xl hover:shadow-[#5b1619]/25 hover:-translate-y-[2px] transition-all duration-300 font-body font-semibold text-sm"
              >
                Shop Now
                <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                  <ArrowRight size={11} />
                </span>
              </Button>
            </Link>
            <Link href="/collections">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-[#5b1619]/20 text-[#5b1619] hover:border-[#5b1619] hover:bg-[#5b1619]/5 transition-all duration-300 font-body font-semibold text-sm"
              >
                View Collections
              </Button>
            </Link>
          </div>

          {/* Social proof pill */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white bg-[#f4d6a4]/50 overflow-hidden"
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
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className="fill-[#f4d6a4] text-[#f4d6a4]"
                />
              ))}
            </div>
            <span className="font-body text-[11px] text-[#425362]/55">
              Trusted by 12,000+ women
            </span>
          </div>
        </motion.div>

        {/* ── RIGHT: Dual scrolling image strips ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="relative flex gap-3 lg:gap-4 h-[560px] md:h-[640px] order-1 md:order-2"
        >
          {/* Main tall strip */}
          <div className="relative flex-[3] rounded-[28px] overflow-hidden shadow-2xl shadow-[#5b1619]/15 ring-1 ring-[#f4d6a4]/20">
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

          {/* Secondary slim strip — counter-scrolls */}
          <div className="relative flex-[2] rounded-[28px] overflow-hidden shadow-xl shadow-[#5b1619]/10 ring-1 ring-[#f4d6a4]/15 mt-12 mb-[-24px]">
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

          {/* Floating new arrivals badge */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.65,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -left-4 lg:-left-6 bottom-20 z-20 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-[#5b1619]/12 border border-[#f4d6a4]/50 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-[#5b1619]/8 flex items-center justify-center text-sm shrink-0">
              ✦
            </div>
            <div>
              <p className="font-body text-xs font-bold text-[#5b1619] leading-tight">
                New Arrivals
              </p>
              <p className="font-body text-[10px] text-[#425362]/55 tracking-wide mt-0.5">
                Summer &apos;25 Collection
              </p>
            </div>
          </motion.div>

          {/* Floating discount badge */}
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
            <Badge className="bg-[#5b1619] text-[#f4d6a4] font-body font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg shadow-[#5b1619]/30">
              Up to 30% OFF
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
