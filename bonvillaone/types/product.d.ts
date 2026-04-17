interface ProductData {
  _id: string;
  slug: string;
  name: string;
  description: string;
  tagline: string;
  features: string[];
  sizes: string[];
  category: string;
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  reviewCount: number;
  colorVariants: ColorVariant[];
  badge?: string; // e.g. "New" | "Bestseller"
}

interface ColorVariant {
  name: string;
  hex: string;
  images: string[]; // 1 or 2 images
  stock: number;
}
