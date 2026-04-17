// ══════════════════════════════════════════════════════
// app/api/categories/[id]/route.ts  (UPDATED — heroImages)
// ══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { connectDB, Category } from "@/models/model";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const cat = await Category.findById(id).lean();
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await connectDB();
  const body = await req.json();
  const cat = await Category.findByIdAndUpdate(id, body, { new: true });
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  await Category.findByIdAndUpdate(id, { isActive: false });
  return NextResponse.json({ success: true });
}
