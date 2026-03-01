import ProductShelf from "@/components/localComponents/productShelf";
import { products } from "@/lib/data";
import Hero from "@/screens/HomeScreen/Hero";
import {
  BrandPillars,
  CategoryStrip,
  EditorialFeature,
  NewsletterCTA,
  ReviewsStrip,
} from "@/screens/HomeScreen/HomeCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-20 md:gap-28">
      <Hero />

      {/* Shop by category */}
      <CategoryStrip />

      {/* Trending shelf */}
      <ProductShelf
        title="Trending Now"
        label="What's Hot"
        products={products}
      />

      {/* Editorial split feature */}
      <EditorialFeature />

      {/* Recommended shelf */}
      <ProductShelf
        title="Made for You"
        label="Recommended"
        products={[...products].reverse()}
      />

      {/* Brand pillars */}
      <BrandPillars />

      {/* Social proof marquee */}
      <ReviewsStrip />

      {/* Newsletter */}
      <NewsletterCTA />
    </div>
  );
}
