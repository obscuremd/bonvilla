"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1624513764372-a4eb7b334c62?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdvbWVuJTIwZml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D",
];

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
};

export default function Hero() {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-center overflow-hidden">
      {/* ── Large background number watermark ── */}
      <span
        className="pointer-events-none absolute right-0 top-[-5%] font-display font-black text-[22vw] leading-none text-white/[0.018] select-none z-0"
        aria-hidden
      >
        25
      </span>

      {/* ── Gold horizontal rule — top ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/25 to-transparent" />

      <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-0 items-center">
        {/* ── LEFT: Oversized editorial text ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="label-tag">
            Bonvilla Activewear — Summer 2025
          </motion.div>

          {/* Giant headline */}
          <motion.div variants={fadeUp} className="space-y-0">
            <h1 className="font-display font-black text-[clamp(56px,9vw,128px)] leading-[0.9] tracking-tight text-[#f0ece4]">
              Sculpted
            </h1>
            <h1
              className="font-display font-black text-[clamp(56px,9vw,128px)] leading-[0.9] tracking-tight text-transparent"
              style={{ WebkitTextStroke: "1px rgba(201,169,110,0.5)" }}
            >
              For You.
            </h1>
          </motion.div>

          {/* Body + CTA row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
          >
            <p className="font-body text-sm text-[#f0ece4]/45 leading-relaxed max-w-xs">
              Premium gymwear engineered for the woman who trains with intention
              and lives with ambition.
            </p>

            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/shop">
                <button className="group flex items-center gap-3 bg-[#c9a96e] hover:bg-[#dfc08a] text-[#0a0a0b] font-body font-semibold text-xs tracking-[0.15em] uppercase px-7 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a96e]/20 hover:-translate-y-[1px]">
                  Shop Now
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </Link>
              <Link
                href="/collections"
                className="font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ece4]/40 hover:text-[#c9a96e] transition-colors duration-300 border-b border-[#f0ece4]/15 hover:border-[#c9a96e]/40 pb-0.5"
              >
                View All
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            className="flex gap-10 pt-2 border-t border-white/6 pt-6"
          >
            {[
              { val: "2,400+", label: "Pieces Designed" },
              { val: "98%", label: "5-Star Rating" },
              { val: "Free", label: "Returns Always" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-[#c9a96e]">
                  {val}
                </p>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ece4]/30 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Overlapping image composition ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative hidden lg:flex items-center justify-end w-[460px] xl:w-[520px] h-[640px] flex-shrink-0"
        >
          {/* Back image */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-8 left-0 w-[200px] h-[290px] rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
          >
            <Image src={heroImages[1]} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#0a0a0b]/20" />
          </motion.div>

          {/* Center main image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-[100px] top-0 w-[240px] h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10"
            style={{
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.1)",
            }}
          >
            <Image
              src={heroImages[0]}
              alt="Bonvilla Activewear"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/50 to-transparent" />
          </motion.div>

          {/* Front accent image */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 bottom-12 w-[195px] h-[260px] rounded-2xl overflow-hidden border border-white/8 shadow-2xl z-20"
          >
            <Image src={heroImages[2]} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#0a0a0b]/20" />
          </motion.div>

          {/* Floating pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-4 left-8 z-30 flex items-center gap-3 bg-[#111113] border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
          >
            <div className="w-7 h-7 rounded-full bg-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e] text-xs">
              ✦
            </div>
            <div>
              <p className="font-body text-[11px] font-semibold text-[#f0ece4]">
                New Drop
              </p>
              <p className="font-body text-[9px] text-[#f0ece4]/35 tracking-wide mt-0.5">
                Summer &apos;25 Collection
              </p>
            </div>
          </motion.div>

          {/* Gold accent line */}
          <div className="absolute top-1/2 -left-8 w-px h-32 bg-gradient-to-b from-transparent via-[#c9a96e]/30 to-transparent" />
        </motion.div>
      </div>

      {/* ── Bottom gold rule ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
    </section>
  );
}
