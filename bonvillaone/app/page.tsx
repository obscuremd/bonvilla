// app/page.tsx
import ProductShelf from "@/components/localComponents/productShelf";
import Hero from "@/screens/HomeScreen/Hero";
import {
  BrandPillars,
  CategoryStrip,
  EditorialFeature,
  NewsletterCTA,
  ReviewsStrip,
} from "@/screens/HomeScreen/HomeCard";

const BASE = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function getProducts(sort = "-createdAt", limit = 12) {
  try {
    const r = await fetch(
      `${BASE()}/api/products?limit=${limit}&sort=${sort}`,
      {
        next: { revalidate: 300 },
      },
    );
    if (!r.ok) return [];
    return (await r.json()).products ?? [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const r = await fetch(`${BASE()}/api/categories`, {
      next: { revalidate: 600 },
    });
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return [];
  }
}

// ← FIXED: now calls /api/site-pages/home (not /api/site-content/home)
async function getHomePage() {
  try {
    const r = await fetch(`${BASE()}/api/site-pages/home`, {
      next: { revalidate: 60 }, // short cache so CMS edits appear quickly
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// Extract a value from simpleBlocks by key
function sb(
  page: { simpleBlocks?: { key: string; value: string }[] } | null,
  key: string,
  fallback = "",
): string {
  return page?.simpleBlocks?.find((b) => b.key === key)?.value ?? fallback;
}

export default async function Home() {
  const [trending, recommended, categories, homePage] = await Promise.all([
    getProducts("-totalOrders", 10),
    getProducts("-createdAt", 10),
    getCategories(),
    getHomePage(),
  ]);

  return (
    <div className="min-h-screen flex flex-col gap-20 md:gap-28">
      {/* Hero — reads hero_headline, hero_subline, hero_cta from simpleBlocks */}
      <Hero
        headline={sb(homePage, "hero_headline")}
        subline={sb(homePage, "hero_subline")}
        ctaLabel={sb(homePage, "hero_cta")}
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

      {/* BrandPillars — reads pillar_N_title / pillar_N_body from simpleBlocks */}
      <BrandPillars
        pillar1Title={sb(homePage, "pillar_1_title")}
        pillar1Body={sb(homePage, "pillar_1_body")}
        pillar2Title={sb(homePage, "pillar_2_title")}
        pillar2Body={sb(homePage, "pillar_2_body")}
        pillar3Title={sb(homePage, "pillar_3_title")}
        pillar3Body={sb(homePage, "pillar_3_body")}
        pillar4Title={sb(homePage, "pillar_4_title")}
        pillar4Body={sb(homePage, "pillar_4_body")}
      />

      <ReviewsStrip />

      {/* NewsletterCTA — reads newsletter_headline / newsletter_body */}
      <NewsletterCTA
        headline={sb(homePage, "newsletter_headline")}
        body={sb(homePage, "newsletter_body")}
      />
    </div>
  );
}
