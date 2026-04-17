import Image from "next/image";
import { notFound } from "next/navigation";
import ProductShelf from "@/components/localComponents/productShelf";

/* ── Server-side data fetching ───────────────── */
async function getCategory(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const r = await fetch(`${base}/api/categories?slug=${slug}`, {
      next: { revalidate: 300 },
    });
    if (!r.ok) return null;
    const cats = await r.json();
    return Array.isArray(cats)
      ? (cats.find((c: { slug: string }) => c.slug === slug) ?? null)
      : null;
  } catch {
    return null;
  }
}

async function getCategoryProducts(categoryId: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const r = await fetch(
      `${base}/api/products?category=${categoryId}&limit=24`,
      { next: { revalidate: 60 } },
    );
    if (!r.ok) return [];
    const d = await r.json();
    return d.products ?? [];
  } catch {
    return [];
  }
}

async function getPageContent(page: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const r = await fetch(`${base}/api/site-content/${page}`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function getBlock(
  content: { blocks?: { key: string; value: string }[] } | null,
  key: string,
  fallback = "",
) {
  return (
    content?.blocks?.find((b: { key: string }) => b.key === key)?.value ??
    fallback
  );
}

/* ── Fallback images per category ────────────── */
const HERO_FALLBACKS: Record<string, string> = {
  leggings:
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&auto=format&fit=crop&q=80",
  "sports-bras":
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1200&auto=format&fit=crop&q=80",
  sets: "https://images.unsplash.com/photo-1695407893256-d57e95db4eda?w=1200&auto=format&fit=crop&q=80",
  outerwear:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80",
  tops: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=1200&auto=format&fit=crop&q=80",
  shorts:
    "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=1200&auto=format&fit=crop&q=80",
  default:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80",
};

/* ── Page ────────────────────────────────────── */
export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [category, pageContent] = await Promise.all([
    getCategory(params.slug),
    getPageContent(`category_${params.slug}`),
  ]);

  if (!category) notFound();

  const products = await getCategoryProducts(category._id);

  // Content blocks — CMS values, with sensible fallbacks
  const heroImage = getBlock(
    pageContent,
    "hero_image",
    category.imageUrl ?? HERO_FALLBACKS[params.slug] ?? HERO_FALLBACKS.default,
  );
  const heroHeading = getBlock(pageContent, "hero_heading", category.name);
  const heroSub = getBlock(
    pageContent,
    "hero_sub",
    category.description ??
      `Explore our ${category.name} collection — designed to sculpt, support and elevate.`,
  );
  const bodyTitle = getBlock(
    pageContent,
    "body_title",
    `The ${category.name} Edit`,
  );
  const bodyText = getBlock(
    pageContent,
    "body_text",
    `Each piece in our ${category.name} range is crafted from premium 4-way stretch fabric, engineered for performance and designed to look effortlessly refined.`,
  );

  return (
    <div className="space-y-20 md:space-y-28">
      {/* ── Hero ───────────────────────────────── */}
      <section className="relative w-full min-h-[55vh] flex items-end rounded-3xl overflow-hidden shadow-2xl shadow-[--color-crimson]/15">
        <Image
          src={heroImage}
          alt={heroHeading}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-crimson]/75 via-[--color-crimson]/20 to-transparent" />

        <div className="relative z-10 p-8 md:p-14 space-y-4 max-w-2xl">
          <span className="section-label text-[--color-gold]/70">
            {category.name}
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[0.95]">
            {heroHeading}
          </h1>
          <p className="font-body text-sm md:text-base text-white/65 leading-relaxed max-w-md">
            {heroSub}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px w-6 bg-[--color-gold]/50" />
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-[--color-gold]/60">
              {products.length} styles
            </span>
          </div>
        </div>
      </section>

      {/* ── Body editorial ─────────────────────── */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <span className="section-label">The Collection</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            {bodyTitle}
          </h2>
          <p className="font-body text-base text-[--color-slate]/65 leading-relaxed">
            {bodyText}
          </p>
          <div className="flex gap-6 pt-2">
            {[
              ["4-way Stretch", "Moves with you"],
              ["Shape Retention", "Wash after wash"],
              ["Squat-Proof", "Engineered to perform"],
            ].map(([title, sub]) => (
              <div key={title}>
                <p className="font-body text-xs font-bold text-[--color-crimson]">
                  {title}
                </p>
                <p className="font-body text-[11px] text-[--color-slate]/50 mt-0.5">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden ring-1 ring-[--color-gold]/20">
          <Image
            src={heroImage}
            alt={heroHeading}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[--color-crimson]/30 to-transparent" />
        </div>
      </section>

      {/* ── Products grid ──────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <span className="section-label">{category.name}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Shop the Collection
            </h2>
          </div>
          <p className="font-body text-sm text-[--color-slate]/40">
            {products.length} products
          </p>
        </div>
        <div className="divider-gold" />

        {products.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p className="font-display text-2xl text-[--color-crimson]/40">
              No products yet
            </p>
            <p className="font-body text-sm text-[--color-slate]/50">
              Check back soon — new drops are on their way.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {/* Import ProductCard inline to avoid circular deps */}
            {products.map((p: ProductData) => (
              <ProductGridCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Inline lightweight grid card ───────────── */
function ProductGridCard({ product }: { product: ProductData }) {
  "use client";
  // This is a server component page, so we lazy-import a simple card
  // In your project, import your full ProductCard here instead.
  const p = product as ProductData;
  const img = p.colorVariants?.[0]?.images?.[0] ?? "";
  const discount = p.originalPrice
    ? Math.round(
        ((p.originalPrice - p.discountedPrice) / p.originalPrice) * 100,
      )
    : 0;

  return (
    <a href={`/product/${p.slug}`} className="block group card-lift">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[--color-cream]">
        {img && (
          <Image
            src={img}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {p.badge && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 badge-gold text-[9px] ${p.badge === "Bestseller" ? "bg-[--color-crimson] text-white border-[--color-crimson]" : ""}`}
          >
            {p.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2.5 right-2.5 z-10 font-body text-[9px] font-bold bg-white text-[--color-crimson] rounded-full px-2 py-0.5 shadow-sm">
            -{discount}%
          </span>
        )}
      </div>
      <div className="pt-2.5 space-y-1">
        <p className="font-body text-[9px] uppercase tracking-widest text-[--color-slate]/40">
          {p.category?.name}
        </p>
        <p className="font-body text-sm font-semibold text-[--color-slate] group-hover:text-[--color-crimson] transition-colors line-clamp-1">
          {p.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-body font-bold text-[--color-crimson]">
            ${p.discountedPrice}
          </span>
          {p.originalPrice > p.discountedPrice && (
            <span className="font-body text-xs text-[--color-slate]/35 line-through">
              ${p.originalPrice}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  badge?: string;
  originalPrice: number;
  discountedPrice: number;
  colorVariants?: { images: string[] }[];
  category?: { name: string };
}
