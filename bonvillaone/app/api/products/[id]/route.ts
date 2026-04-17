// ══════════════════════════════════════════════
// app/api/products/[id]/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Product } from "@/models/model";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const product = await Product.findById(params.id)
    .populate("category", "name slug")
    .lean();
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  await Product.findByIdAndUpdate(params.id, { isActive: false });
  return NextResponse.json({ success: true });
}
