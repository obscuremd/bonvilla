// ══════════════════════════════════════════════
// app/api/orders/[id]/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Order } from "@/models/model";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate("items.product", "name slug")
    .lean();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const { status, notes } = await req.json();
  const order = await Order.findByIdAndUpdate(
    id,
    { ...(status && { status }), ...(notes && { notes }) },
    { new: true },
  );
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
