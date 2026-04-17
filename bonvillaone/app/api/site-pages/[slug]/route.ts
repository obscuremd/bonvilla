// ══════════════════════════════════════════════════════
// app/api/site-pages/[slug]/route.ts
// GET   /api/site-pages/[slug]  — get full page data
// PUT   /api/site-pages/[slug]  — replace all blocks (save)
// PATCH /api/site-pages/[slug]  — update metadata (title, published)
// DELETE /api/site-pages/[slug] — delete custom page
// ══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { connectDB, SitePage } from "@/models/model";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } },
) {
  await connectDB();
  const page = await SitePage.findOne({ slug: params.slug }).lean();
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  await connectDB();
  const body = await req.json();
  // body may contain: blocks, simpleBlocks, title, published
  const page = await SitePage.findOneAndUpdate(
    { slug: params.slug },
    { $set: body },
    { new: true, upsert: true },
  );
  return NextResponse.json(page);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  await connectDB();
  const body = await req.json();
  const page = await SitePage.findOneAndUpdate(
    { slug: params.slug },
    { $set: body },
    { new: true },
  );
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { slug: string } },
) {
  await connectDB();
  const page = await SitePage.findOne({ slug: params.slug });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (page.kind === "builtin")
    return NextResponse.json(
      { error: "Cannot delete built-in page" },
      { status: 403 },
    );
  await page.deleteOne();
  return NextResponse.json({ success: true });
}
