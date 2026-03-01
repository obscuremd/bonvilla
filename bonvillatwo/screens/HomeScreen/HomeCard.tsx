"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap, Repeat2, Leaf, Star } from "lucide-react";

/* ═══════════════════════════════════
   1. CATEGORY STRIP
═══════════════════════════════════ */
const categories = [
  {
    label: "Leggings",
    count: "48",
    href: "/shop/leggings",
    img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&auto=format&fit=crop&q=70",
  },
  {
    label: "Sports Bras",
    count: "32",
    href: "/shop/sports-bras",
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop&q=70",
  },
  {
    label: "Sets",
    count: "24",
    href: "/shop/sets",
    img: "https://images.unsplash.com/photo-1695407893256-d57e95db4eda?w=400&auto=format&fit=crop&q=70",
  },
  {
    label: "Outerwear",
    count: "18",
    href: "/shop/outerwear",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=70",
  },
  {
    label: "Tops",
    count: "41",
    href: "/shop/tops",
    img: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&auto=format&fit=crop&q=70",
  },
  {
    label: "Shorts",
    count: "29",
    href: "/shop/shorts",
    img: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&auto=format&fit=crop&q=70",
  },
];

export function CategoryStrip() {
  return (
    <section className="w-full space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <span className="label-tag">Explore</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#f0ece4]">
            Shop the Range
          </h2>
        </div>
        <Link
          href="/shop"
          className="font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ece4]/30 hover:text-[#c9a96e] transition-colors duration-200 pb-0.5 border-b border-transparent hover:border-[#c9a96e]/30 hidden sm:block"
        >
          All Categories
        </Link>
      </div>

      <div className="divider-gold" />

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link href={cat.href} className="block group">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#111113] border border-white/6">
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/90 via-[#0a0a0b]/20 to-transparent" />

                {/* Bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-body text-[11px] md:text-xs font-semibold text-[#f0ece4] leading-tight">
                    {cat.label}
                  </p>
                  <p className="font-body text-[9px] text-[#c9a96e]/60 mt-0.5">
                    {cat.count} styles
                  </p>
                </div>

                {/* Gold border flash on hover */}
                <div className="absolute inset-0 rounded-xl border border-[#c9a96e]/0 group-hover:border-[#c9a96e]/20 transition-all duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════
   2. EDITORIAL FEATURE
═══════════════════════════════════ */
export function EditorialFeature() {
  return (
    <section className="w-full grid md:grid-cols-2 gap-4 items-stretch">
      {/* Left tall image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-[480px] md:min-h-[600px] rounded-2xl overflow-hidden border border-white/6 group"
      >
        <Image
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80"
          alt="The Sculpt Edit"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-103 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/85 via-[#0a0a0b]/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 space-y-3">
          <span className="badge-gold">Summer &apos;25</span>
          <h3 className="font-display text-4xl md:text-5xl font-bold text-[#f0ece4] leading-tight">
            The Sculpt Edit
          </h3>
          <Link href="/collections/sculpt">
            <button className="mt-2 group/btn flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5 transition-all duration-200">
              Explore
              <ArrowUpRight
                size={12}
                className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Right stacked panels */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4"
      >
        {/* Text block */}
        <div className="flex-1 bg-[#111113] border border-white/6 rounded-2xl p-8 md:p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="label-tag">The Philosophy</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#f0ece4] leading-tight">
              Every rep.
              <br />
              Every moment.
            </h3>
            <p className="font-body text-sm text-[#f0ece4]/40 leading-relaxed max-w-xs">
              Designed for the woman who trains hard, rests intentionally, and
              shows up fully — whatever the day demands.
            </p>
          </div>
          {/* Decorative gold line */}
          <div className="flex items-center gap-4 pt-8">
            <div className="h-px flex-1 bg-white/6" />
            <span className="text-[#c9a96e]/40 text-sm">✦</span>
            <div className="h-px flex-1 bg-white/6" />
          </div>
        </div>

        {/* Bottom image panel */}
        <div className="relative h-[200px] rounded-2xl overflow-hidden border border-white/6 group">
          <Image
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=700&auto=format&fit=crop&q=80"
            alt="New Arrivals"
            fill
            className="object-cover object-top transition-transform duration-600 group-hover:scale-105 opacity-60 group-hover:opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/70 to-transparent" />
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <span className="label-tag text-[#c9a96e]">New In</span>
            <p className="font-display text-2xl font-bold text-[#f0ece4] mt-2">
              Fresh Drops
            </p>
          </div>
          <div className="absolute inset-0 border border-[#c9a96e]/0 rounded-2xl group-hover:border-[#c9a96e]/15 transition-all duration-300" />
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════
   3. BRAND PILLARS
═══════════════════════════════════ */
const pillars = [
  {
    icon: Zap,
    title: "Performance Fabric",
    body: "4-way stretch knit engineered to move with you, not against you.",
  },
  {
    icon: Repeat2,
    title: "Shape Retention",
    body: "Washes 200+ times without losing compression or colour.",
  },
  {
    icon: Leaf,
    title: "Sustainably Made",
    body: "Crafted from recycled fibres with ethical production.",
  },
  {
    icon: Star,
    title: "Loved by Thousands",
    body: "98% of customers say they'd buy again.",
  },
];

export function BrandPillars() {
  return (
    <section className="w-full">
      <div className="bg-[#111113] border border-white/6 rounded-2xl px-8 md:px-16 py-14 space-y-12">
        <div className="text-center space-y-3 max-w-md mx-auto">
          <span className="label-tag justify-center">Why Bonvilla</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#f0ece4]">
            Built different.
            <br />
            Worn better.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pillars.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-4 p-6 bg-[#0a0a0b]/60 rounded-xl border border-white/5 hover:border-[#c9a96e]/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/15 flex items-center justify-center">
                <Icon size={16} className="text-[#c9a96e]" />
              </div>
              <p className="font-body text-sm font-semibold text-[#f0ece4]">
                {title}
              </p>
              <p className="font-body text-xs text-[#f0ece4]/35 leading-relaxed">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════
   4. REVIEWS MARQUEE
═══════════════════════════════════ */
const reviews = [
  {
    name: "Amara O.",
    rating: 5,
    text: "The Sculpt Set is genuinely the most comfortable gymwear I've ever owned. I wear it everywhere.",
    item: "Sculpt Seamless Set",
  },
  {
    name: "Jade K.",
    rating: 5,
    text: "Squat-proof, doesn't roll down, never goes see-through. I've finally found my forever legging.",
    item: "Elevate Legging",
  },
  {
    name: "Priya M.",
    rating: 5,
    text: "I've bought 4 colours now. The quality is unreal for this price point.",
    item: "Define Sports Bra",
  },
  {
    name: "Chloe R.",
    rating: 4,
    text: "Delivery was fast, packaging was beautiful. The hoodie fits perfectly cropped.",
    item: "Flow Cropped Hoodie",
  },
  {
    name: "Sade B.",
    rating: 5,
    text: "Finally a brand that gets it. Every piece feels premium. I won't shop anywhere else.",
    item: "Power Ribbed Tank",
  },
];

export function ReviewsStrip() {
  return (
    <section className="w-full space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <span className="label-tag justify-center">Social Proof</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#f0ece4]">
          What They&apos;re Saying
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10" />

        <div className="flex gap-4 animate-marquee w-max">
          {[...reviews, ...reviews].map((r, i) => (
            <div
              key={i}
              className="w-[280px] flex-shrink-0 bg-[#111113] border border-white/6 rounded-xl p-5 space-y-3 hover:border-[#c9a96e]/15 transition-colors duration-300"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    size={10}
                    className={
                      s < r.rating
                        ? "fill-[#c9a96e] text-[#c9a96e]"
                        : "text-white/10"
                    }
                  />
                ))}
              </div>
              <p className="font-body text-sm text-[#f0ece4]/55 leading-relaxed">
                &ldquo;{r.text}&rdquo;
              </p>
              <div>
                <p className="font-body text-xs font-semibold text-[#f0ece4]">
                  {r.name}
                </p>
                <p className="font-body text-[10px] text-[#c9a96e]/40 mt-0.5">
                  {r.item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════
   5. NEWSLETTER CTA
═══════════════════════════════════ */
export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="w-full">
      <div className="relative overflow-hidden bg-[#111113] border border-white/6 rounded-2xl px-8 md:px-20 py-16 md:py-24 text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-[-40%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#c9a96e]/[0.05] blur-[100px]" />

        {/* Gold top rule */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-[#c9a96e]/30" />

        <div className="relative z-10 space-y-6 max-w-md mx-auto">
          <span className="label-tag justify-center">Join the Movement</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-[#f0ece4] leading-tight">
            10% off your
            <br />
            first order.
          </h2>
          <p className="font-body text-sm text-[#f0ece4]/35 leading-relaxed">
            Sign up for early access to new drops and exclusive offers.
          </p>

          {done ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body text-sm text-[#c9a96e] tracking-wide"
            >
              ✦ You&apos;re in — check your inbox.
            </motion.p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-[#0a0a0b]/60 border border-white/10 rounded-full px-5 py-3 font-body text-sm text-[#f0ece4] placeholder:text-[#f0ece4]/20 outline-none focus:border-[#c9a96e]/30 transition-colors"
              />
              <button
                onClick={() => email && setDone(true)}
                className="bg-[#c9a96e] hover:bg-[#dfc08a] text-[#0a0a0b] font-body font-bold text-xs tracking-[0.1em] uppercase px-7 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a96e]/20 hover:-translate-y-[1px] whitespace-nowrap"
              >
                Claim Offer
              </button>
            </div>
          )}

          <p className="font-body text-[10px] text-[#f0ece4]/18">
            No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* Bottom gold rule */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-[#c9a96e]/20" />
      </div>
    </section>
  );
}
