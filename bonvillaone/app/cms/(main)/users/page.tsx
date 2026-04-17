/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";

interface Activity {
  type: string;
  ref?: string;
  timestamp: string;
  ip?: string;
}
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalSpend: number;
  orderCount: number;
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
}
interface UserDetail extends User {
  activity: Activity[];
}

export default function CMSUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);

  async function load() {
    const r = await fetch("/api/users");
    const d = await r.json();
    setUsers(d.users ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function expand(id: string) {
    if (expanded === id) {
      setExpanded(null);
      setDetail(null);
      return;
    }
    setExpanded(id);
    setDetail(null);
    const r = await fetch(`/api/users/${id}/activity`);
    setDetail(await r.json());
  }

  const ACTIVITY_ICON: Record<string, string> = {
    login: "🔐",
    view_product: "👁",
    add_to_cart: "🛒",
    purchase: "✅",
    wishlist: "❤️",
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-[--color-text]">
          Users
        </h2>
        <p className="font-body text-sm text-[--color-text-muted] mt-1">
          {total} registered customers
        </p>
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Total Spend</th>
                <th>Last Login</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <>
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[--color-gold]/15 flex items-center justify-center text-[--color-gold] font-display font-bold text-sm flex-shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-[--color-text] text-sm">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-[--color-text-muted]">{u.email}</td>
                    <td>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-[--color-gold]/15 text-[--color-gold]" : "bg-white/4 text-[--color-text-muted]"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="font-semibold text-[--color-text]">
                      {u.orderCount}
                    </td>
                    <td className="font-semibold text-[--color-gold]">
                      ${u.totalSpend.toFixed(2)}
                    </td>
                    <td className="text-[--color-text-muted] text-xs">
                      {u.lastLogin
                        ? new Date(u.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td>
                      <button
                        onClick={() => expand(u._id)}
                        className="flex items-center gap-1.5 font-body text-xs text-[--color-text-muted] hover:text-[--color-gold] transition-colors"
                      >
                        <Activity size={12} />
                        View
                        {expanded === u._id ? (
                          <ChevronUp size={11} />
                        ) : (
                          <ChevronDown size={11} />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Activity drawer */}
                  {expanded === u._id && (
                    <tr key={`${u._id}-act`}>
                      <td
                        colSpan={7}
                        className="bg-[--color-elevated]/50 px-6 py-4"
                      >
                        {!detail ? (
                          <p className="font-body text-xs text-[--color-text-muted] animate-pulse">
                            Loading activity…
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none">
                            <p className="label-form mb-3">
                              Recent Activity (last 20)
                            </p>
                            {detail.activity
                              .slice(-20)
                              .reverse()
                              .map((a, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 font-body text-xs text-[--color-text-sub]"
                                >
                                  <span className="text-base w-5 flex-shrink-0">
                                    {ACTIVITY_ICON[a.type] ?? "•"}
                                  </span>
                                  <span className="capitalize font-medium text-[--color-text]">
                                    {a.type.replace("_", " ")}
                                  </span>
                                  {a.ref && (
                                    <span className="text-[--color-text-muted]">
                                      {a.ref}
                                    </span>
                                  )}
                                  <span className="ml-auto text-[--color-text-muted] flex-shrink-0">
                                    {new Date(a.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            {detail.activity.length === 0 && (
                              <p className="text-[--color-text-muted]">
                                No activity recorded yet.
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-[--color-text-muted] py-10"
                  >
                    No users yet.
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
