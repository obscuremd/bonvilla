"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Repeat2, Leaf, Star } from "lucide-react";
import { useState } from "react";

/* ── shared type ── */
interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&auto=format&fit=crop&q=70",
];

/* ══════════════════════════════
   CATEGORY STRIP
══════════════════════════════ */
export function CategoryStrip({ categories = [] }: { categories: Category[] }) {
  const display = categories.slice(0, 6);
  return (
    <section className="w-full space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <span className="section-label">Browse by Category</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#5b1619]">
            Shop the Range
          </h2>
        </div>
        <Link href="/shop">
          <button className="btn-ghost hidden sm:flex text-sm">
            All Categories →
          </button>
        </Link>
      </div>
      <div className="divider-gold" />
      {display.length === 0 ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {FALLBACK_IMAGES.map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-[#faf8f5] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {display.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/category/${cat.slug}`} className="block group">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#faf8f5] shadow-sm ring-1 ring-[rgba(244,214,164,0.2)]">
                  <Image
                    src={
                      cat.imageUrl ??
                      FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
                    }
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(91,22,25,0.7)] via-[rgba(91,22,25,0.1)] to-transparent transition-opacity duration-300 group-hover:from-[rgba(91,22,25,0.8)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3">
                    <p className="font-body text-[11px] md:text-xs font-bold text-white leading-tight">
                      {cat.name}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════
   BRAND PILLARS
   Now accepts optional CMS props.
   Falls back to hardcoded defaults if props are empty strings.
══════════════════════════════ */
interface BrandPillarsProps {
  pillar1Title?: string;
  pillar1Body?: string;
  pillar2Title?: string;
  pillar2Body?: string;
  pillar3Title?: string;
  pillar3Body?: string;
  pillar4Title?: string;
  pillar4Body?: string;
}

const PILLAR_ICONS = [Zap, Repeat2, Leaf, Star];
const PILLAR_DEFAULTS = [
  {
    title: "Performance Fabric",
    body: "4-way stretch knit engineered to move with your body, not against it.",
  },
  {
    title: "Shape Retention",
    body: "Washes 200+ times without losing compression or colour intensity.",
  },
  {
    title: "Sustainably Made",
    body: "Crafted from recycled fibres with a commitment to ethical production.",
  },
  {
    title: "Loved by Thousands",
    body: "98% of customers say they'd buy again — and bring a friend.",
  },
];

export function BrandPillars({
  pillar1Title,
  pillar1Body,
  pillar2Title,
  pillar2Body,
  pillar3Title,
  pillar3Body,
  pillar4Title,
  pillar4Body,
}: BrandPillarsProps = {}) {
  // Merge CMS values over defaults (only override if non-empty)
  const pillars = [
    {
      title: pillar1Title || PILLAR_DEFAULTS[0].title,
      body: pillar1Body || PILLAR_DEFAULTS[0].body,
    },
    {
      title: pillar2Title || PILLAR_DEFAULTS[1].title,
      body: pillar2Body || PILLAR_DEFAULTS[1].body,
    },
    {
      title: pillar3Title || PILLAR_DEFAULTS[2].title,
      body: pillar3Body || PILLAR_DEFAULTS[2].body,
    },
    {
      title: pillar4Title || PILLAR_DEFAULTS[3].title,
      body: pillar4Body || PILLAR_DEFAULTS[3].body,
    },
  ];

  return (
    <section className="w-full">
      <div className="bg-[#faf8f5] rounded-3xl px-8 md:px-16 py-12 md:py-16 space-y-10">
        <div className="text-center space-y-3 max-w-lg mx-auto">
          <span className="section-label justify-center">Why Bonvilla</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#5b1619]">
            Built different.
            <br className="hidden md:block" /> Worn better.
          </h2>
          <p className="font-body text-sm text-[rgba(66,83,98,0.65)] leading-relaxed">
            Every stitch, fibre, and silhouette is decided with one question in
            mind — does it make her feel unstoppable?
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {pillars.map(({ title, body }, i) => {
            const Icon = PILLAR_ICONS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center gap-3 p-5 bg-white rounded-2xl border border-[rgba(244,214,164,0.3)] shadow-sm card-lift"
              >
                <div className="w-10 h-10 rounded-full bg-[rgba(91,22,25,0.08)] flex items-center justify-center">
                  <Icon size={18} className="text-[#5b1619]" />
                </div>
                <p className="font-body text-sm font-bold text-[#5b1619]">
                  {title}
                </p>
                <p className="font-body text-[12px] text-[rgba(66,83,98,0.6)] leading-relaxed">
                  {body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   EDITORIAL FEATURE
══════════════════════════════ */
export function EditorialFeature() {
  return (
    <section className="w-full grid md:grid-cols-2 gap-6 md:gap-10 items-stretch">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-[420px] md:min-h-[540px] rounded-3xl overflow-hidden shadow-xl shadow-[rgba(91,22,25,0.12)] ring-1 ring-[rgba(244,214,164,0.2)]"
      >
        <Image
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80"
          alt="The Summer Edit"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(91,22,25,0.6)] via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="badge-gold mb-2 inline-block">Summer &apos;25</span>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            The Sculpt
            <br />
            Edit
          </h3>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6"
      >
        <div className="flex-1 bg-[#5b1619] rounded-3xl p-8 md:p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[rgba(244,214,164,0.6)]">
              The Collection
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
              Every rep.
              <br />
              Every moment.
            </h3>
            <p className="font-body text-sm text-[rgba(255,255,255,0.65)] leading-relaxed max-w-xs">
              Designed for the woman who trains hard, rests intentionally, and
              shows up fully.
            </p>
          </div>
          <Link href="/shop" className="inline-flex mt-6">
            <button className="btn-gold gap-2 text-sm group">
              Explore Collection
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </Link>
        </div>
        <div className="relative h-[200px] md:h-[220px] rounded-3xl overflow-hidden shadow-lg ring-1 ring-[rgba(244,214,164,0.15)] group">
          <Image
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=700&auto=format&fit=crop&q=80"
            alt="New Arrivals"
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(91,22,25,0.4)] to-transparent" />
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <p className="font-body text-[10px] font-semibold tracking-[0.3em] uppercase text-[#f4d6a4]">
              New In
            </p>
            <p className="font-display text-xl font-bold text-white mt-1">
              Fresh Drops
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════
   REVIEWS STRIP
══════════════════════════════ */
const reviews = [
  {
    name: "Amara O.",
    rating: 5,
    text: "The Sculpt Set is genuinely the most comfortable gymwear I've ever owned.",
    item: "Sculpt Seamless Set",
  },
  {
    name: "Jade K.",
    rating: 5,
    text: "Squat-proof, doesn't roll down, doesn't go see-through. Found my forever legging.",
    item: "Elevate Legging",
  },
  {
    name: "Priya M.",
    rating: 5,
    text: "I've bought 4 colours now. The quality is ridiculous for the price point.",
    item: "Define Sports Bra",
  },
  {
    name: "Chloe R.",
    rating: 4,
    text: "Fast delivery, beautiful packaging. The hoodie fits perfectly cropped.",
    item: "Flow Cropped Hoodie",
  },
  {
    name: "Sade B.",
    rating: 5,
    text: "Finally a brand that gets it. Every piece feels premium.",
    item: "Power Ribbed Tank",
  },
];

export function ReviewsStrip() {
  return (
    <section className="w-full space-y-6 overflow-hidden">
      <div className="text-center space-y-2">
        <span className="section-label justify-center">
          Real Women, Real Results
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#5b1619]">
          What They&apos;re Saying
        </h2>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-4 animate-marquee w-max">
          {[...reviews, ...reviews].map((r, i) => (
            <div
              key={i}
              className="w-[280px] flex-shrink-0 surface-cream rounded-2xl p-5 space-y-3"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    size={11}
                    className={
                      s < r.rating
                        ? "fill-[#f4d6a4] text-[#f4d6a4]"
                        : "text-[rgba(66,83,98,0.2)]"
                    }
                  />
                ))}
              </div>
              <p className="font-body text-sm text-[rgba(66,83,98,0.8)] leading-relaxed">
                &ldquo;{r.text}&rdquo;
              </p>
              <div>
                <p className="font-body text-xs font-bold text-[#5b1619]">
                  {r.name}
                </p>
                <p className="font-body text-[10px] text-[rgba(66,83,98,0.45)]">
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

/* ══════════════════════════════
   NEWSLETTER CTA
   Now accepts optional CMS props with defaults.
══════════════════════════════ */
interface NewsletterCTAProps {
  headline?: string;
  body?: string;
}

export function NewsletterCTA({
  headline = "10% off your first order.",
  body = "Sign up and be the first to hear about new drops, exclusive offers, and training inspo.",
}: NewsletterCTAProps = {}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="w-full">
      <div className="relative overflow-hidden bg-[#5b1619] rounded-3xl px-8 md:px-20 py-14 md:py-20 text-center">
        <div className="pointer-events-none absolute top-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[rgba(244,214,164,0.1)] blur-[80px]" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[rgba(244,214,164,0.08)] blur-[70px]" />
        <div className="relative z-10 space-y-6 max-w-lg mx-auto">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[rgba(244,214,164,0.6)] font-semibold">
            Join the Movement
          </span>

          {/* ← CMS-driven headline */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight">
            {headline}
          </h2>

          {/* ← CMS-driven body */}
          <p className="font-body text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">
            {body}
          </p>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-[rgba(244,214,164,0.2)] text-[#f4d6a4] font-body font-semibold text-sm px-6 py-3 rounded-full border border-[rgba(244,214,164,0.3)]"
            >
              ✦ You&apos;re in — check your inbox!
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-full px-5 py-3 font-body text-sm text-white placeholder:text-[rgba(255,255,255,0.35)] outline-none focus:border-[rgba(244,214,164,0.5)] transition-colors"
              />
              <button
                onClick={() => email && setDone(true)}
                className="btn-gold whitespace-nowrap"
              >
                Claim 10% Off
              </button>
            </div>
          )}
          <p className="font-body text-[10px] text-[rgba(255,255,255,0.3)]">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
