// ══════════════════════════════════════════════
// app/api/orders/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Order, Product } from "@/models/model";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return NextResponse.json({ orders, total });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  // Generate order number
  const orderNumber = `BON-${Date.now().toString(36).toUpperCase()}`;

  const order = await Order.create({ ...body, orderNumber });

  // Increment totalOrders on each product in the order
  await Promise.all(
    body.items.map((item: { product: string; quantity: number }) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { totalOrders: item.quantity },
      }),
    ),
  );

  return NextResponse.json(order, { status: 201 });
}
