// ══════════════════════════════════════════════
// app/api/orders/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Order, Product, User } from "@/models/model";
import {
  orderConfirmationCustomer,
  orderConfirmationInternal,
  sendMail,
} from "@/lib/mail";

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
  const orderNumber = `BON-${Date.now().toString(36).toUpperCase()}`;
  const order = await Order.create({ ...body, orderNumber });

  // Decrement stock + increment totalOrders per variant
  await Promise.all(
    body.items.map(
      async (item: { product: string; quantity: number; color: string }) => {
        await Product.findOneAndUpdate(
          { _id: item.product, "colorVariants.name": item.color },
          {
            $inc: {
              totalOrders: item.quantity,
              "colorVariants.$.stock": -item.quantity,
            },
          },
        );
      },
    ),
  );

  // Fetch user email
  const user = body.user
    ? await User.findById(body.user).select("name email").lean()
    : null;
  const customerEmail = user?.email ?? body.guestEmail;
  const customerName =
    user?.name ?? body.shippingAddress?.fullName ?? "Customer";

  const emailPayload = {
    name: customerName,
    orderNumber,
    items: body.items,
    subtotal: body.subtotal,
    shipping: body.shipping,
    total: body.total,
    shippingAddress: body.shippingAddress,
  };

  // Send emails in parallel (don't block response)
  if (customerEmail) {
    sendMail(
      customerEmail,
      `Order Confirmed — ${orderNumber}`,
      orderConfirmationCustomer(emailPayload),
    ).catch(console.error);
  }
  sendMail(
    process.env.COMPANY_EMAIL ?? process.env.NEXT_PUBLIC_SMTP_USERNAME!,
    `New Order: ${orderNumber}`,
    orderConfirmationInternal({
      orderNumber,
      customerName,
      customerEmail: customerEmail ?? "guest",
      total: body.total,
      items: body.items,
    }),
  ).catch(console.error);

  return NextResponse.json(order, { status: 201 });
}
