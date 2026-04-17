import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/localComponents/productCard";

const BASE = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function getCategory(slug: string) {
  try {
    const r = await fetch(`${BASE()}/api/categories?slug=${slug}`, {
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
    const r = await fetch(
      `${BASE()}/api/products?category=${categoryId}&limit=24`,
      { next: { revalidate: 60 } },
    );
    if (!r.ok) return [];
    return (await r.json()).products ?? [];
  } catch {
    return [];
  }
}

async function getPageContent(slug: string) {
  try {
    const r = await fetch(`${BASE()}/api/site-pages/category_${slug}`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function getBlock(
  content: { simpleBlocks?: { key: string; value: string }[] } | null,
  key: string,
  fallback = "",
) {
  return content?.simpleBlocks?.find((b) => b.key === key)?.value ?? fallback;
}

const HERO_FALLBACKS: Record<string, string> = {
  leggings:
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&auto=format&fit=crop&q=80",
  "sports-bras":
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1200&auto=format&fit=crop&q=80",
  default:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80",
};

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [category, pageContent] = await Promise.all([
    getCategory(slug),
    getPageContent(slug),
  ]);
  if (!category) notFound();

  const products = await getCategoryProducts(category._id);

  /* ── Content from CMS, with graceful fallbacks ── */
  const heroImages: string[] =
    (category.heroImages ?? []).length > 0
      ? category.heroImages
      : [HERO_FALLBACKS[slug] ?? HERO_FALLBACKS.default];

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
  const features = [
    {
      title: getBlock(pageContent, "feature_1_title", "4-way Stretch"),
      sub: getBlock(pageContent, "feature_1_sub", "Moves with you"),
    },
    {
      title: getBlock(pageContent, "feature_2_title", "Shape Retention"),
      sub: getBlock(pageContent, "feature_2_sub", "Wash after wash"),
    },
    {
      title: getBlock(pageContent, "feature_3_title", "Squat-Proof"),
      sub: getBlock(pageContent, "feature_3_sub", "Engineered to perform"),
    },
  ];

  const isCarousel = heroImages.length > 1;

  return (
    <div className="space-y-20 md:space-y-28">
      {/* ── Hero — static or carousel ── */}
      <section className="relative w-full min-h-[55vh] flex items-end rounded-3xl overflow-hidden shadow-2xl shadow-[rgba(91,22,25,0.15)]">
        {isCarousel ? (
          /* CSS-only carousel */
          <div className="absolute inset-0">
            {heroImages.map((src, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  animation: `categorySlide ${heroImages.length * 5}s ${i * 5}s infinite`,
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  priority={i === 0}
                />
              </div>
            ))}
            <style>{`
              @keyframes categorySlide {
                0%, ${Math.floor(100 / heroImages.length) - 5}% { opacity: 1; }
                ${Math.floor(100 / heroImages.length)}%, 100%  { opacity: 0; }
              }
            `}</style>
            {/* Slide dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroImages.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full bg-white/60 ${i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5"}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <Image
            src={heroImages[0]}
            alt={heroHeading}
            fill
            className="object-cover object-center"
            priority
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(91,22,25,0.75)] via-[rgba(91,22,25,0.2)] to-transparent" />

        <div className="relative z-10 p-8 md:p-14 space-y-4 max-w-2xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-[rgba(244,214,164,0.6)]">
            <Link href="/" className="hover:text-[#f4d6a4] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/shop"
              className="hover:text-[#f4d6a4] transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            <span className="text-[#f4d6a4]">{category.name}</span>
          </nav>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[0.92]">
            {heroHeading}
          </h1>
          <p className="font-body text-sm md:text-base text-white/65 leading-relaxed max-w-md">
            {heroSub}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <div className="h-px w-6 bg-[rgba(244,214,164,0.5)]" />
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-[rgba(244,214,164,0.6)]">
              {products.length} styles
            </span>
          </div>
        </div>
      </section>

      {/* ── Body editorial ── */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <span className="section-label">The Collection</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            {bodyTitle}
          </h2>
          <p className="font-body text-base text-[rgba(66,83,98,0.65)] leading-relaxed">
            {bodyText}
          </p>
          <div className="flex gap-6 pt-2">
            {features.map(({ title, sub }) => (
              <div key={title}>
                <p className="font-body text-xs font-bold text-[#5b1619]">
                  {title}
                </p>
                <p className="font-body text-[11px] text-[rgba(66,83,98,0.5)] mt-0.5">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden ring-1 ring-[rgba(244,214,164,0.2)]">
          <Image
            src={heroImages[0]}
            alt={heroHeading}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(91,22,25,0.3)] to-transparent" />
        </div>
      </section>

      {/* ── Products grid ── */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <span className="section-label">{category.name}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Shop the Collection
            </h2>
          </div>
          <p className="font-body text-sm text-[rgba(66,83,98,0.4)]">
            {products.length} products
          </p>
        </div>
        <div className="divider-gold" />

        {products.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p className="font-display text-2xl text-[rgba(91,22,25,0.3)]">
              No products yet
            </p>
            <p className="font-body text-sm text-[rgba(66,83,98,0.5)]">
              Check back soon — new drops on their way.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {products.map((p: Record<string, unknown>) => (
              <ProductCard
                key={p._id as string}
                product={
                  p as unknown as Parameters<typeof ProductCard>[0]["product"]
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
