"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Shield, UserX, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface NewAdminForm {
  name: string;
  email: string;
  password: string;
  role: "admin" | "super_admin";
}

const EMPTY: NewAdminForm = {
  name: "",
  email: "",
  password: "",
  role: "admin",
};

export default function CMSAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<NewAdminForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    const r = await fetch(
      "/api/users?role=admin&role=super_admin&limit=50&cms=true",
    );
    const d = await r.json();
    setAdmins(d.users ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function createAdmin() {
    if (!form.name || !form.email || !form.password) {
      setError("All fields required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const r = await fetch("/api/auth/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Failed.");
        return;
      }
      setSuccess(`${form.name} created successfully.`);
      setForm(EMPTY);
      await load();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(id: string, current: boolean) {
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    await load();
  }

  async function changeRole(id: string, role: string) {
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    await load();
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#5b1619]">
          Admin Management
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Create and manage admin and super admin accounts. Only visible to
          super admins.
        </p>
      </div>

      {/* Create admin */}
      <div className="surface rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-[#5b1619]" />
          <h3 className="font-body text-sm font-semibold text-foreground">
            Create Admin Account
          </h3>
        </div>
        <Separator />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="label-form">Full Name *</Label>
            <Input
              className="input-field mt-1"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <Label className="label-form">Company Email *</Label>
            <Input
              className="input-field mt-1"
              type="email"
              placeholder="jane@bonvilla.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <Label className="label-form">Temporary Password *</Label>
            <Input
              className="input-field mt-1"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
          </div>
          <div>
            <Label className="label-form">Role *</Label>
            <Select
              value={form.role}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, role: v as "admin" | "super_admin" }))
              }
            >
              <SelectTrigger className="input-field mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="surface">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p className="font-body text-xs text-destructive">{error}</p>}
        {success && (
          <p className="font-body text-xs text-green-600">{success}</p>
        )}

        <div className="surface-cream rounded-xl p-3">
          <p className="font-body text-xs text-muted-foreground">
            The admin will receive a login link via email. They should change
            their password after first login. Admins cannot place product
            orders.
          </p>
        </div>

        <Button onClick={createAdmin} disabled={saving} className="btn-primary">
          {saving ? (
            <Loader2 size={13} className="animate-spin mr-1" />
          ) : (
            <Plus size={13} className="mr-1" />
          )}
          {saving ? "Creating…" : "Create Admin"}
        </Button>
      </div>

      {/* Admin list */}
      <div className="surface rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="font-body text-sm font-semibold text-foreground">
            {admins.length} admin account{admins.length !== 1 ? "s" : ""}
          </p>
        </div>
        {loading ? (
          <div className="p-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            <span className="font-body text-sm">Loading…</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[rgba(91,22,25,0.1)] flex items-center justify-center text-[#5b1619] font-display font-bold flex-shrink-0">
                        {admin.name[0].toUpperCase()}
                      </div>
                      <span className="font-body font-medium text-sm text-foreground">
                        {admin.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{admin.email}</td>
                  <td>
                    <Select
                      value={admin.role}
                      onValueChange={(v) => changeRole(admin._id, v)}
                    >
                      <SelectTrigger className="h-7 text-xs border-none bg-transparent p-0 w-auto gap-1 text-[#5b1619] font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="surface">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="text-muted-foreground text-xs">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(admin._id, admin.isActive)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${admin.isActive ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {admin.isActive ? (
                        <>
                          <Check size={10} />
                          Active
                        </>
                      ) : (
                        "Inactive"
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(admin._id, admin.isActive)}
                      className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <UserX size={13} />
                      {admin.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-muted-foreground py-10 font-body text-sm"
                  >
                    No admin accounts yet.
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
