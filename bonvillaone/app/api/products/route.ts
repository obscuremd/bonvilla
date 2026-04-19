// app/api/products/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Product } from "@/models/model";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const sort = searchParams.get("sort") ?? "-createdAt";
  const slug = searchParams.get("slug");
  // cms=true means return all products regardless of isActive
  const cmsMode = searchParams.get("cms") === "true";

  const filter: Record<string, unknown> = cmsMode ? {} : { isActive: true };
  if (category) filter.category = category;
  if (slug) filter.slug = slug;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
