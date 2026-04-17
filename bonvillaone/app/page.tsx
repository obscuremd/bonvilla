import { Suspense } from "react";
import ProductShelf from "@/components/localComponents/productShelf";
import Hero from "@/screens/HomeScreen/Hero";
import {
  BrandPillars,
  CategoryStrip,
  EditorialFeature,
  NewsletterCTA,
  ReviewsStrip,
} from "@/screens/HomeScreen/HomeCard";

/* ── Server-side data fetching ─────────────────── */
async function getProducts(sort = "-createdAt", limit = 12) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const r = await fetch(`${base}/api/products?limit=${limit}&sort=${sort}`, {
      next: { revalidate: 300 },
    });
    if (!r.ok) return [];
    const d = await r.json();
    return d.products ?? [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const r = await fetch(`${base}/api/categories`, {
      next: { revalidate: 600 },
    });
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return [];
  }
}

async function getSiteContent(page: string) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const r = await fetch(`${base}/api/site-content/${page}`, {
      next: { revalidate: 300 },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const [trending, recommended, categories, homeContent] = await Promise.all([
    getProducts("-totalOrders", 10),
    getProducts("-createdAt", 10),
    getCategories(),
    getSiteContent("home"),
  ]);

  // Extract CMS content blocks into a key→value map
  const blocks: Record<string, string> = {};
  (homeContent?.blocks ?? []).forEach((b: { key: string; value: string }) => {
    blocks[b.key] = b.value;
  });

  return (
    <div className="min-h-screen flex flex-col gap-20 md:gap-28">
      <Hero
        headline={blocks.hero_headline}
        subline={blocks.hero_subline}
        ctaLabel={blocks.hero_cta}
      />
      <CategoryStrip categories={categories} />
      <ProductShelf
        title="Trending Now"
        label="What's Hot"
        products={trending}
      />
      <EditorialFeature />
      <ProductShelf
        title="Made for You"
        label="Recommended"
        products={recommended}
      />
      <BrandPillars />
      <ReviewsStrip />
      <NewsletterCTA />
    </div>
  );
}
