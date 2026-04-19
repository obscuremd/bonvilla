// ══════════════════════════════════════════════
// app/api/dashboard/stats/route.ts
// ══════════════════════════════════════════════
import { NextResponse } from "next/server";
import { connectDB, Order, User, Product } from "@/models/model";

export async function GET() {
  await connectDB();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    monthOrders,
    totalUsers,
    newUsersThisMonth,
    activeProducts,
    topProducts,
    recentOrders,
    ordersByStatus,
    revenueAgg,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({
      role: "customer",
      createdAt: { $gte: startOfMonth },
    }),
    // FIX: count ALL products (including inactive) but separately
    Product.countDocuments({ isActive: true }),
    Product.find({ isActive: true })
      .sort({ totalOrders: -1 })
      .limit(5)
      .select("name totalOrders rating colorVariants")
      .lean(),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("user", "name email")
      .select("orderNumber total status createdAt user guestEmail")
      .lean(),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $nin: ["cancelled", "refunded"] } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          monthly: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$total", 0],
            },
          },
        },
      },
    ]),
  ]);

  const revenue = revenueAgg[0] ?? { total: 0, monthly: 0 };

  return NextResponse.json({
    totalOrders,
    monthOrders,
    totalUsers,
    newUsersThisMonth,
    activeProducts,
    totalRevenue: revenue.total,
    monthRevenue: revenue.monthly,
    topProducts,
    recentOrders,
    ordersByStatus,
  });
}
