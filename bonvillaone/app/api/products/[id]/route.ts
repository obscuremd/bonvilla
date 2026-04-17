// ══════════════════════════════════════════════
// app/api/products/[id]/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Product } from "@/models/model";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id)
    .populate("category", "name slug")
    .lean();
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  await Product.findByIdAndUpdate(id, { isActive: false });
  return NextResponse.json({ success: true });
}
