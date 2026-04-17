// ══════════════════════════════════════════════════════
// app/api/site-pages/route.ts
// GET  /api/site-pages          — list all pages
// POST /api/site-pages          — create custom page
// ══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { connectDB, SitePage } from "@/models/model";

export async function GET() {
  await connectDB();
  const pages = await SitePage.find()
    .select("slug title kind published createdAt")
    .sort({ kind: 1, createdAt: 1 })
    .lean();
  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  // Prevent duplicate slugs
  const exists = await SitePage.findOne({ slug: body.slug });
  if (exists)
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  const page = await SitePage.create({
    ...body,
    kind: "custom",
    blocks: [],
    simpleBlocks: [],
    published: false,
  });
  return NextResponse.json(page, { status: 201 });
}
