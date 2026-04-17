/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  guestEmail?: string;
  items: { name: string; quantity: number; size: string; color: string }[];
  shippingAddress: { fullName: string; city: string; country: string };
}

const STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  refunded: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

export default function CMSOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load(status = "") {
    setLoading(true);
    const q = status ? `?status=${status}` : "";
    const r = await fetch(`/api/orders${q}`);
    const d = await r.json();
    setOrders(d.orders ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }

  useEffect(() => {
    load(filter);
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load(filter);
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-[--color-text]">
            Orders
          </h2>
          <p className="font-body text-sm text-[--color-text-muted] mt-1">
            {total} total orders
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("")}
            className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-all ${filter === "" ? "bg-[--color-gold]/15 text-[--color-gold] border-[--color-gold]/30" : "border-[--color-border] text-[--color-text-muted] hover:border-[--color-border-md]"}`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-all ${filter === s ? `${STATUS_COLORS[s]} border-current` : "border-[--color-border] text-[--color-text-muted] hover:border-[--color-border-md]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="surface overflow-x-auto">
        {loading ? (
          <p className="font-body text-sm text-[--color-text-muted] p-5 animate-pulse">
            Loading…
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <>
                  <tr
                    key={o._id}
                    className="cursor-pointer"
                    onClick={() =>
                      setExpanded(expanded === o._id ? null : o._id)
                    }
                  >
                    <td className="font-mono text-xs font-semibold text-[--color-text]">
                      {o.orderNumber}
                    </td>
                    <td>
                      <p className="text-sm text-[--color-text]">
                        {o.user?.name ?? "Guest"}
                      </p>
                      <p className="text-[10px] text-[--color-text-muted]">
                        {o.user?.email ?? o.guestEmail}
                      </p>
                    </td>
                    <td className="text-[--color-text-muted]">
                      {o.shippingAddress.city}, {o.shippingAddress.country}
                    </td>
                    <td className="font-semibold text-[--color-gold]">
                      ${o.total}
                    </td>
                    <td className="text-[--color-text-muted] text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] ?? ""}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="input-dark text-xs py-1 px-2 w-32"
                        value={o.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(o._id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {/* Expanded items */}
                  {expanded === o._id && (
                    <tr key={`${o._id}-exp`}>
                      <td
                        colSpan={7}
                        className="bg-[--color-elevated]/60 px-6 py-4"
                      >
                        <p className="label-form mb-3">Items</p>
                        <div className="space-y-2">
                          {o.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 font-body text-sm text-[--color-text-sub]"
                            >
                              <span className="font-medium text-[--color-text]">
                                {item.name}
                              </span>
                              <span className="text-[--color-text-muted]">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-[--color-text-muted]">
                                Size: {item.size}
                              </span>
                              <span className="text-[--color-text-muted]">
                                Colour: {item.color}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-[--color-text-muted] py-10"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
