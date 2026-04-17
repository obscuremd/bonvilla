"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
} from "lucide-react";

interface DashStats {
  totalOrders: number;
  monthOrders: number;
  totalUsers: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  monthRevenue: number;
  topProducts: {
    _id: string;
    name: string;
    totalOrders: number;
    rating: number;
  }[];
  recentOrders: {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user?: { name: string; email: string };
    guestEmail?: string;
  }[];
  ordersByStatus: { _id: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
  refunded: "text-orange-400 bg-orange-400/10",
};

export default function CMSDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-body text-sm text-[--color-text-muted] animate-pulse">
          Loading dashboard…
        </p>
      </div>
    );
  if (!stats)
    return (
      <p className="font-body text-sm text-red-400">Failed to load stats.</p>
    );

  const cards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      sub: `$${stats.monthRevenue.toLocaleString()} this month`,
      icon: DollarSign,
      gold: true,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      sub: `+${stats.monthOrders} this month`,
      icon: ShoppingCart,
    },
    {
      label: "Customers",
      value: stats.totalUsers,
      sub: `+${stats.newUsersThisMonth} new this month`,
      icon: Users,
    },
    {
      label: "Active Products",
      value: "—",
      sub: "Manage in Products →",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-[--color-text]">
          Overview
        </h2>
        <p className="font-body text-sm text-[--color-text-muted] mt-1">
          Live performance summary
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, gold }) => (
          <div
            key={label}
            className={`stat-card ${gold ? "border-[--color-gold]/20 glow-gold" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-[--color-text-muted]">
                {label}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${gold ? "bg-[--color-gold]/15" : "bg-white/4"}`}
              >
                <Icon
                  size={13}
                  className={
                    gold ? "text-[--color-gold]" : "text-[--color-text-muted]"
                  }
                />
              </div>
            </div>
            <p
              className={`font-display text-3xl font-bold ${gold ? "text-[--color-gold]" : "text-[--color-text]"}`}
            >
              {value}
            </p>
            <p className="font-body text-[11px] text-[--color-text-muted]">
              {sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Top Products ── */}
        <div className="surface p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-[--color-gold]" />
            <h3 className="font-body text-sm font-semibold text-[--color-text]">
              Top Products
            </h3>
          </div>
          <div className="space-y-3">
            {stats.topProducts.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-[--color-gold]/30 w-6 text-right flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-[--color-text] truncate">
                    {p.name}
                  </p>
                  <p className="font-body text-[10px] text-[--color-text-muted]">
                    {p.totalOrders} orders · ★ {p.rating}
                  </p>
                </div>
                <div className="h-1.5 w-20 bg-white/5 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full bg-[--color-gold] rounded-full"
                    style={{
                      width: `${Math.min(100, (p.totalOrders / (stats.topProducts[0]?.totalOrders || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="font-body text-sm text-[--color-text-muted]">
                No orders yet.
              </p>
            )}
          </div>
        </div>

        {/* ── Recent Orders ── */}
        <div className="surface p-5 space-y-4">
          <h3 className="font-body text-sm font-semibold text-[--color-text]">
            Recent Orders
          </h3>
          <div className="space-y-2">
            {stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between py-2 border-b border-[--color-border] last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-body text-xs font-medium text-[--color-text]">
                    {order.orderNumber}
                  </p>
                  <p className="font-body text-[10px] text-[--color-text-muted] truncate">
                    {order.user?.name ?? order.guestEmail ?? "Guest"}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`font-body text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-body text-sm font-semibold text-[--color-text]">
                    ${order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Orders by status ── */}
      <div className="surface p-5 space-y-4">
        <h3 className="font-body text-sm font-semibold text-[--color-text]">
          Orders by Status
        </h3>
        <div className="flex flex-wrap gap-3">
          {stats.ordersByStatus.map(({ _id, count }) => (
            <div
              key={_id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${STATUS_COLORS[_id] ?? "bg-white/4 text-[--color-text-muted]"}`}
            >
              <span className="font-body text-xs font-semibold capitalize">
                {_id}
              </span>
              <span className="font-display text-sm font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
