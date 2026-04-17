"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { uploadImages } from "@/lib/uploadImages";

interface Category {
  _id: string;
  name: string;
}

interface ColorVariant {
  name: string;
  hex: string;
  stock: number;
  newFiles: File[]; // staged for upload
  imageUrls: string[]; // final Firebase URLs
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string } | null;
  originalPrice: number;
  discountedPrice: number;
  badge?: string;
  isActive: boolean;
  totalOrders: number;
  colorVariants: {
    name: string;
    hex: string;
    stock: number;
    images: string[];
  }[];
}

interface FormState {
  name: string;
  categoryId: string;
  description: string;
  tagline: string;
  originalPrice: string;
  discountedPrice: string;
  badge: string;
  sizes: string;
  features: string;
  colorVariants: ColorVariant[];
}

const EMPTY_VARIANT: ColorVariant = {
  name: "",
  hex: "#1a1a1a",
  stock: 0,
  newFiles: [],
  imageUrls: [],
};
const EMPTY_FORM: FormState = {
  name: "",
  categoryId: "",
  description: "",
  tagline: "",
  originalPrice: "",
  discountedPrice: "",
  badge: "",
  sizes: "XS,S,M,L,XL",
  features: "",
  colorVariants: [{ ...EMPTY_VARIANT }],
};

export default function CMSProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function loadAll() {
    const [pr, cr] = await Promise.all([
      fetch("/api/products?limit=100"),
      fetch("/api/categories"),
    ]);
    const pd = await pr.json();
    setProducts(pd.products ?? []);
    setCategories(await cr.json());
    setLoading(false);
  }
  useEffect(() => {
    loadAll();
  }, []);

  /* ── Variant helpers ── */
  function addVariant() {
    setForm((f) => ({
      ...f,
      colorVariants: [...f.colorVariants, { ...EMPTY_VARIANT }],
    }));
  }
  function removeVariant(i: number) {
    setForm((f) => ({
      ...f,
      colorVariants: f.colorVariants.filter((_, idx) => idx !== i),
    }));
  }
  function updateVariant<K extends keyof ColorVariant>(
    i: number,
    key: K,
    val: ColorVariant[K],
  ) {
    setForm((f) => {
      const v = [...f.colorVariants];
      v[i] = { ...v[i], [key]: val };
      return { ...f, colorVariants: v };
    });
  }

  async function uploadVariantImages(idx: number, files: File[]) {
    if (!files.length) return;
    setUploading(idx);
    try {
      const r = await uploadImages(files);
      if (r.message === "error") {
        setError(`Upload failed for variant ${idx + 1}`);
        return;
      }
      setForm((f) => {
        const v = [...f.colorVariants];
        v[idx] = {
          ...v[idx],
          imageUrls: [...v[idx].imageUrls, ...r.data],
          newFiles: [],
        };
        return { ...f, colorVariants: v };
      });
    } finally {
      setUploading(null);
    }
  }

  function removeVariantImage(variantIdx: number, imgIdx: number) {
    setForm((f) => {
      const v = [...f.colorVariants];
      const urls = v[variantIdx].imageUrls.filter((_, i) => i !== imgIdx);
      v[variantIdx] = { ...v[variantIdx], imageUrls: urls };
      return { ...f, colorVariants: v };
    });
  }

  /* ── Save ── */
  async function save() {
    if (
      !form.name ||
      !form.categoryId ||
      !form.originalPrice ||
      !form.discountedPrice
    ) {
      setError("Name, category and both prices are required.");
      return;
    }
    for (let i = 0; i < form.colorVariants.length; i++) {
      if (!form.colorVariants[i].name.trim()) {
        setError(`Variant ${i + 1} needs a name.`);
        return;
      }
    }
    setSaving(true);
    setError("");
    try {
      const finalVariants = form.colorVariants.map((v) => ({
        name: v.name,
        hex: v.hex,
        stock: v.stock,
        images: v.imageUrls,
      }));
      const payload = {
        name: form.name.trim(),
        category: form.categoryId,
        description: form.description,
        tagline: form.tagline,
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        badge: form.badge || undefined,
        sizes: form.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        features: form.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        colorVariants: finalVariants,
      };
      const url = editId ? `/api/products/${editId}` : "/api/products";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed");
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      await loadAll();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    await loadAll();
  }

  async function remove(id: string) {
    if (!confirm("Archive this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await loadAll();
  }

  function startEdit(p: Product) {
    setEditId(p._id);
    setForm({
      name: p.name,
      categoryId: p.category?._id ?? "",
      description: "",
      tagline: "",
      originalPrice: String(p.originalPrice),
      discountedPrice: String(p.discountedPrice),
      badge: p.badge ?? "",
      sizes: "XS,S,M,L,XL",
      features: "",
      colorVariants: (p.colorVariants || []).map((v) => ({
        name: v.name,
        hex: v.hex,
        stock: v.stock,
        newFiles: [],
        imageUrls: v.images,
      })),
    });
    setShowForm(true);
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#5b1619]">
            Products
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {products.length} products
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(EMPTY_FORM);
          }}
          className="btn-primary"
        >
          <Plus size={13} className="mr-1" />
          New Product
        </Button>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="surface rounded-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-2 -mx-1 px-1">
            <h3 className="font-body text-sm font-semibold">
              {editId ? "Edit Product" : "Add Product"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            >
              <X size={16} />
            </Button>
          </div>

          {/* Basic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="label-form">Product Name *</Label>
              <Input
                className="input-field mt-1"
                placeholder="e.g. Sculpt Seamless Set"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="label-form">Category *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              >
                <SelectTrigger className="input-field mt-1">
                  <SelectValue placeholder="Select category…" />
                </SelectTrigger>
                <SelectContent className="surface">
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="label-form">Original Price ($) *</Label>
              <Input
                className="input-field mt-1"
                type="number"
                placeholder="89"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, originalPrice: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="label-form">Discounted Price ($) *</Label>
              <Input
                className="input-field mt-1"
                type="number"
                placeholder="62"
                value={form.discountedPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountedPrice: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="label-form">Badge</Label>
              <Select
                value={form.badge}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, badge: v === "none" ? "" : v }))
                }
              >
                <SelectTrigger className="input-field mt-1">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent className="surface">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Bestseller">Bestseller</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="label-form">Sizes (comma-separated)</Label>
              <Input
                className="input-field mt-1"
                placeholder="XS,S,M,L,XL"
                value={form.sizes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sizes: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="label-form">Tagline</Label>
              <Input
                className="input-field mt-1"
                placeholder="Short one-liner"
                value={form.tagline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tagline: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="label-form">Description</Label>
              <Textarea
                className="input-field mt-1 resize-none"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="label-form">Features (one per line)</Label>
              <Textarea
                className="input-field mt-1 resize-none"
                rows={4}
                placeholder={"Moisture-wicking seamless knit\n4-way stretch…"}
                value={form.features}
                onChange={(e) =>
                  setForm((f) => ({ ...f, features: e.target.value }))
                }
              />
            </div>
          </div>

          <Separator />

          {/* Color variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-body text-sm font-semibold text-foreground">
                Colour Variants
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="text-xs"
              >
                <Plus size={12} className="mr-1" />
                Add Variant
              </Button>
            </div>

            {form.colorVariants.map((v, idx) => (
              <div key={idx} className="surface-cream rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs font-semibold text-foreground/70">
                    Variant {idx + 1}
                  </span>
                  {form.colorVariants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-destructive hover:text-destructive"
                      onClick={() => removeVariant(idx)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="label-form text-[10px]">Name *</Label>
                    <Input
                      className="input-field mt-1 text-sm"
                      placeholder="e.g. Onyx"
                      value={v.name}
                      onChange={(e) =>
                        updateVariant(idx, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="label-form text-[10px]">Hex Colour</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <Input
                        className="input-field text-sm flex-1"
                        placeholder="#1a1a1a"
                        value={v.hex}
                        onChange={(e) =>
                          updateVariant(idx, "hex", e.target.value)
                        }
                      />
                      <input
                        type="color"
                        value={v.hex}
                        onChange={(e) =>
                          updateVariant(idx, "hex", e.target.value)
                        }
                        className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="label-form text-[10px]">Stock</Label>
                    <Input
                      className="input-field mt-1 text-sm"
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) =>
                        updateVariant(
                          idx,
                          "stock",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>

                {/* Image upload for this variant */}
                <div className="space-y-2">
                  <Label className="label-form text-[10px]">
                    Images{" "}
                    <span className="normal-case font-normal text-muted-foreground">
                      (up to 5 · first is the primary image)
                    </span>
                  </Label>

                  <div className="flex flex-wrap gap-2 items-center">
                    {v.imageUrls.map((url, i) => (
                      <div
                        key={i}
                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-border group"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <button
                          onClick={() => removeVariantImage(idx, i)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-destructive text-white items-center justify-center hidden group-hover:flex"
                        >
                          <X size={9} />
                        </button>
                        {i === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-[#5b1619]/80 text-white text-[8px] text-center py-0.5 font-body">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add more button */}
                    {v.imageUrls.length < 5 && (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          ref={(el) => {
                            fileRefs.current[idx] = el;
                          }}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files ?? []);
                            const remaining = 5 - v.imageUrls.length;
                            await uploadVariantImages(
                              idx,
                              files.slice(0, remaining),
                            );
                            e.target.value = "";
                          }}
                        />
                        <div className="w-14 h-14 rounded-lg border-2 border-dashed border-border hover:border-[#5b1619]/30 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer">
                          {uploading === idx ? (
                            <Loader2
                              size={14}
                              className="animate-spin text-muted-foreground"
                            />
                          ) : (
                            <>
                              <Plus
                                size={14}
                                className="text-muted-foreground"
                              />
                              <span className="font-body text-[8px] text-muted-foreground">
                                Add
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                    )}
                  </div>
                  {v.imageUrls.length >= 5 && (
                    <p className="font-body text-[10px] text-muted-foreground">
                      Maximum 5 images reached.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="font-body text-xs text-destructive">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <Button onClick={save} disabled={saving} className="btn-primary">
              {saving ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1" />
                  Saving…
                </>
              ) : editId ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="surface overflow-x-auto rounded-2xl">
        {loading ? (
          <div className="p-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            <span className="font-body text-sm">Loading…</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Variants</th>
                <th>Orders</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      {p.colorVariants?.[0]?.images?.[0] ? (
                        <img
                          src={p.colorVariants[0].images[0]}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-border flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Package
                            size={13}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground">
                          {p.name}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted-foreground">
                    {p.category?.name ?? "—"}
                  </td>
                  <td>
                    <span className="font-semibold text-[#5b1619]">
                      ${p.discountedPrice}
                    </span>
                    <span className="text-muted-foreground line-through ml-1.5 text-xs">
                      ${p.originalPrice}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {(p.colorVariants ?? []).slice(0, 4).map((v, i) => (
                        <div
                          key={i}
                          title={v.name}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: v.hex }}
                        />
                      ))}
                      {(p.colorVariants?.length ?? 0) > 4 && (
                        <span className="font-body text-[10px] text-muted-foreground">
                          +{(p.colorVariants?.length ?? 0) - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="font-semibold text-foreground">
                    {p.totalOrders}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(p._id, p.isActive)}
                      className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${p.isActive ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-[#5b1619] hover:border-[#5b1619]/30 transition-all"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => remove(p._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-muted-foreground py-10 font-body text-sm"
                  >
                    No products yet.
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
