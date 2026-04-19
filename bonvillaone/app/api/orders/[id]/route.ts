// ══════════════════════════════════════════════
// app/api/orders/[id]/route.ts
// ══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { connectDB, Order, User } from "@/models/model";
import { sendMail, orderStatusEmail } from "@/lib/mail";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const order = await Order.findByIdAndUpdate(id, body, {
    new: true,
  }).populate("user", "name email");
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Send status update email if status changed
  if (
    body.status &&
    ["confirmed", "shipped", "delivered", "cancelled", "refunded"].includes(
      body.status,
    )
  ) {
    const recipientEmail = order.user?.email ?? order.guestEmail;
    const recipientName = order.user?.name ?? "Customer";
    if (recipientEmail) {
      const labels: Record<string, string> = {
        confirmed: "Order Confirmed",
        shipped: "Your Order Is On Its Way",
        delivered: "Order Delivered",
        cancelled: "Order Cancelled",
        refunded: "Refund Processed",
      };
      await sendMail(
        recipientEmail,
        labels[body.status] ?? `Order Update: ${body.status}`,
        orderStatusEmail({
          name: recipientName,
          orderNumber: order.orderNumber,
          status: body.status,
          message: body.notes,
        }),
      );
    }
  }

  return NextResponse.json(order);
}
