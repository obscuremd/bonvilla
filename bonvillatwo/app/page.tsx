import ProductShelf from "@/components/localComponents/productShelf";
import { products } from "@/lib/data";
import Hero from "@/screens/HomeScreen/Hero";
import {
  CategoryStrip,
  EditorialFeature,
  BrandPillars,
  ReviewsStrip,
  NewsletterCTA,
} from "@/screens/HomeScreen/HomeCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-0">
      <Hero />
      <CategoryStrip />
      <ProductShelf
        title="Trending Now"
        label="What's Hot"
        products={products}
      />
      <EditorialFeature />
      <ProductShelf
        title="Made for You"
        label="Recommended"
        products={[...products].reverse()}
      />
      <BrandPillars />
      <ReviewsStrip />
      <NewsletterCTA />
    </div>
  );
}
