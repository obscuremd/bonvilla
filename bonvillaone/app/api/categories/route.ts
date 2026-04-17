// ══════════════════════════════════════════════════════
// app/api/categories/route.ts  (UPDATED — adds heroImages support)
// ══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { connectDB, Category } from "@/models/model";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") !== "false";
  const slug = searchParams.get("slug");
  const filter: Record<string, unknown> = activeOnly ? { isActive: true } : {};
  if (slug) filter.slug = slug;
  const categories = await Category.find(filter).sort({ name: 1 }).lean();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  // body.heroImages = array of Firebase URLs passed from client after upload
  const category = await Category.create({ ...body, slug });
  return NextResponse.json(category, { status: 201 });
}
