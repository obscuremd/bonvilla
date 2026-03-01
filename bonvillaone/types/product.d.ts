interface ProductData {
  id: string;
  slug: string;
  name: string;
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
}
