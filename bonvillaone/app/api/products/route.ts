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

  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;

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

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const product = await Product.create({ ...body, slug });
  return NextResponse.json(product, { status: 201 });
}
