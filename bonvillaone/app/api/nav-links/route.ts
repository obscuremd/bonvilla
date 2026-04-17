// ══════════════════════════════════════════════════════
// app/api/nav-links/route.ts
// GET  /api/nav-links?placement=header
// POST /api/nav-links
// ══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { connectDB, NavLink } from "@/models/model";

export async function GET(req: NextRequest) {
  await connectDB();
  const placement = new URL(req.url).searchParams.get("placement");
  const filter: Record<string, unknown> = { isActive: true };
  if (placement) filter.placement = placement;
  const links = await NavLink.find(filter).sort({ order: 1 }).lean();
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const link = await NavLink.create(body);
  return NextResponse.json(link, { status: 201 });
}
