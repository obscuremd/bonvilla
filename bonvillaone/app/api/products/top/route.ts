// ══════════════════════════════════════════════
// app/api/products/top/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Product } from "@/models/model";

// GET /api/products/top?limit=5
export async function GET(req: NextRequest) {
  await connectDB();
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 5);
  const products = await Product.find({ isActive: true })
    .sort({ totalOrders: -1 })
    .limit(limit)
    .populate("category", "name")
    .lean();
  return NextResponse.json(products);
}
