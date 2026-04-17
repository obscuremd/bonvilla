"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { uploadImages } from "@/lib/uploadImages";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  heroImages: string[];
  // CMS editorial content stored per-category in site-pages collection
  isActive: boolean;
  createdAt: string;
}

interface CategoryContent {
  hero_heading: string;
  hero_sub: string;
  body_title: string;
  body_text: string;
  feature_1_title: string;
  feature_1_sub: string;
  feature_2_title: string;
  feature_2_sub: string;
  feature_3_title: string;
  feature_3_sub: string;
}

const EMPTY_CONTENT: CategoryContent = {
  hero_heading: "",
  hero_sub: "",
  body_title: "",
  body_text: "",
  feature_1_title: "4-way Stretch",
  feature_1_sub: "Moves with you",
  feature_2_title: "Shape Retention",
  feature_2_sub: "Wash after wash",
  feature_3_title: "Squat-Proof",
  feature_3_sub: "Engineered to perform",
};

interface FormState {
  name: string;
  description: string;
  thumbnailFiles: File[];
  thumbnailUrl: string;
  heroImageFiles: File[];
  heroImageUrls: string[];
}
const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  thumbnailFiles: [],
  thumbnailUrl: "",
  heroImageFiles: [],
  heroImageUrls: [],
};

export default function CMSCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Content editor panel
  const [contentOpen, setContentOpen] = useState(false);
  const [contentCat, setContentCat] = useState<Category | null>(null);
  const [content, setContent] = useState<CategoryContent>(EMPTY_CONTENT);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);

  async function load() {
    const r = await fetch("/api/categories?active=false");
    setCategories(await r.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  /* ── Upload helpers ── */
  async function uploadAndSet(
    files: File[],
    field: "thumbnailUrl" | "heroImageUrls",
  ) {
    if (!files.length) return;
    setUploading(true);
    try {
      const r = await uploadImages(files);
      if (r.message === "error") {
        setError("Image upload failed.");
        return;
      }
      if (field === "thumbnailUrl") {
        setForm((f) => ({
          ...f,
          thumbnailUrl: r.data[0] ?? "",
          thumbnailFiles: [],
        }));
      } else {
        setForm((f) => ({
          ...f,
          heroImageUrls: [...f.heroImageUrls, ...r.data],
          heroImageFiles: [],
        }));
      }
    } finally {
      setUploading(false);
    }
  }

  function removeHeroImage(idx: number) {
    setForm((f) => ({
      ...f,
      heroImageUrls: f.heroImageUrls.filter((_, i) => i !== idx),
    }));
  }

  /* ── CRUD ── */
  async function save() {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editId ? `/api/categories/${editId}` : "/api/categories";
      const method = editId ? "PATCH" : "POST";
      const body = {
        name: form.name,
        description: form.description,
        imageUrl: form.thumbnailUrl || undefined,
        heroImages: form.heroImageUrls,
      };
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setForm(EMPTY_FORM);
      setEditId(null);
      await load();
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Archive this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    await load();
  }

  function startEdit(cat: Category) {
    setEditId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      thumbnailFiles: [],
      thumbnailUrl: cat.imageUrl ?? "",
      heroImageFiles: [],
      heroImageUrls: cat.heroImages ?? [],
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  /* ── Content editing ── */
  async function openContent(cat: Category) {
    setContentCat(cat);
    // Load from site-pages API
    const r = await fetch(`/api/site-pages/category_${cat.slug}`);
    if (r.ok) {
      const d = await r.json();
      const map: Record<string, string> = {};
      (d.simpleBlocks ?? []).forEach((b: { key: string; value: string }) => {
        map[b.key] = b.value;
      });
      setContent({ ...EMPTY_CONTENT, ...map } as CategoryContent);
    } else {
      setContent(EMPTY_CONTENT);
    }
    setContentOpen(true);
  }

  async function saveContent() {
    if (!contentCat) return;
    setContentSaving(true);
    const simpleBlocks = Object.entries(content).map(([key, value]) => ({
      key,
      value,
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      type: key.includes("text") || key.includes("sub") ? "richtext" : "text",
    }));
    await fetch(`/api/site-pages/category_${contentCat.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Category: ${contentCat.name}`,
        slug: `category_${contentCat.slug}`,
        kind: "custom",
        simpleBlocks,
        blocks: [],
        published: true,
      }),
    });
    setContentSaving(false);
    setContentSaved(true);
    setTimeout(() => setContentSaved(false), 2500);
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#5b1619]">
            Categories
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {categories.length} total
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="surface p-6 space-y-5 rounded-2xl">
        <h3 className="font-body text-sm font-semibold text-foreground">
          {editId ? "Edit Category" : "Add Category"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="label-form">Name *</Label>
            <Input
              className="input-field mt-1"
              placeholder="e.g. Knee Sleeve"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <Label className="label-form">Description</Label>
            <Input
              className="input-field mt-1"
              placeholder="Optional short description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <Label className="label-form">
            Thumbnail Image (for category strip)
          </Label>
          <div className="mt-2 flex items-start gap-4">
            {form.thumbnailUrl && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border">
                <img
                  src={form.thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setForm((f) => ({ ...f, thumbnailUrl: "" }))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center"
                >
                  <X size={9} />
                </button>
              </div>
            )}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = Array.from(e.target.files ?? []);
                  if (f.length) await uploadAndSet(f, "thumbnailUrl");
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                asChild
              >
                <span>
                  {uploading ? (
                    <Loader2 size={12} className="animate-spin mr-1" />
                  ) : (
                    <ImageIcon size={12} className="mr-1" />
                  )}
                  {form.thumbnailUrl ? "Replace" : "Upload Thumbnail"}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Hero images */}
        <div>
          <Label className="label-form">
            Hero Images{" "}
            <span className="normal-case font-normal text-muted-foreground">
              (1 = static, 2+ = carousel)
            </span>
          </Label>
          <div className="mt-2 flex flex-wrap gap-3 items-start">
            {form.heroImageUrls.map((url, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-xl overflow-hidden border border-border"
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeHeroImage(i)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center"
                >
                  <X size={9} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 font-body">
                  {i === 0 ? "Hero" : i === 1 ? "Slide 2" : `Slide ${i + 1}`}
                </div>
              </div>
            ))}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const f = Array.from(e.target.files ?? []);
                  if (f.length) await uploadAndSet(f, "heroImageUrls");
                }}
              />
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#5b1619]/30 transition-colors">
                {uploading ? (
                  <Loader2
                    size={16}
                    className="animate-spin text-muted-foreground"
                  />
                ) : (
                  <>
                    <Plus size={16} className="text-muted-foreground" />
                    <span className="font-body text-[9px] text-muted-foreground">
                      Add Image
                    </span>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {error && <p className="font-body text-xs text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button onClick={save} disabled={saving} className="btn-primary">
            {saving ? (
              <Loader2 size={13} className="animate-spin mr-1" />
            ) : (
              <Plus size={13} className="mr-1" />
            )}
            {saving ? "Saving…" : editId ? "Update" : "Add Category"}
          </Button>
          {editId && (
            <Button
              variant="outline"
              onClick={cancelEdit}
              className="btn-outline"
            >
              <X size={13} className="mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* ── List ── */}
      <div className="surface overflow-hidden rounded-2xl">
        {loading ? (
          <div className="p-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            <span className="font-body text-sm">Loading…</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Hero Images</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon
                            size={12}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground">
                          {cat.name}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {cat.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {(cat.heroImages ?? []).slice(0, 3).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="w-7 h-7 rounded object-cover border border-border"
                        />
                      ))}
                      {(cat.heroImages?.length ?? 0) > 0 && (
                        <Badge
                          variant="outline"
                          className="text-[9px] font-semibold"
                        >
                          {(cat.heroImages?.length ?? 0) === 1
                            ? "Static"
                            : `${cat.heroImages?.length} slides`}
                        </Badge>
                      )}
                      {!cat.heroImages?.length && (
                        <span className="font-body text-xs text-muted-foreground">
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-muted-foreground max-w-[160px] truncate">
                    {cat.description || "—"}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(cat._id, cat.isActive)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${cat.isActive ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {cat.isActive ? (
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openContent(cat)}
                        title="Edit page content"
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-[#5b1619] hover:border-[#5b1619]/30 transition-all"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => startEdit(cat)}
                        title="Edit category"
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-[#5b1619] hover:border-[#5b1619]/30 transition-all"
                      >
                        <ImageIcon size={12} />
                      </button>
                      <button
                        onClick={() => remove(cat._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-muted-foreground py-10 font-body text-sm"
                  >
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Category content editor sheet ── */}
      <Sheet open={contentOpen} onOpenChange={setContentOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[520px] surface overflow-y-auto"
        >
          <SheetHeader className="border-b border-border pb-4 mb-6">
            <SheetTitle className="font-display text-xl text-[#5b1619]">
              {contentCat?.name} — Page Content
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* Hero section */}
            <div className="space-y-4">
              <p className="label-form">Hero Section</p>
              <div>
                <Label className="label-form">Heading</Label>
                <Input
                  className="input-field mt-1"
                  value={content.hero_heading}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, hero_heading: e.target.value }))
                  }
                  placeholder={contentCat?.name}
                />
              </div>
              <div>
                <Label className="label-form">Subtext</Label>
                <Textarea
                  className="input-field mt-1 resize-none"
                  rows={3}
                  value={content.hero_sub}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, hero_sub: e.target.value }))
                  }
                  placeholder={`Explore our ${contentCat?.name} collection…`}
                />
              </div>
            </div>

            <Separator />

            {/* Body editorial */}
            <div className="space-y-4">
              <p className="label-form">Body Editorial Section</p>
              <div>
                <Label className="label-form">Section Title</Label>
                <Input
                  className="input-field mt-1"
                  value={content.body_title}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, body_title: e.target.value }))
                  }
                  placeholder={`The ${contentCat?.name} Edit`}
                />
              </div>
              <div>
                <Label className="label-form">Body Text</Label>
                <Textarea
                  className="input-field mt-1 resize-none"
                  rows={4}
                  value={content.body_text}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, body_text: e.target.value }))
                  }
                  placeholder="Each piece is crafted from premium 4-way stretch fabric…"
                />
              </div>
            </div>

            <Separator />

            {/* Feature strips */}
            <div className="space-y-4">
              <p className="label-form">Feature Strip (3 items)</p>
              {([1, 2, 3] as const).map((n) => (
                <div
                  key={n}
                  className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border bg-muted/20"
                >
                  <div>
                    <Label className="label-form text-[10px]">
                      Feature {n} Title
                    </Label>
                    <Input
                      className="input-field mt-1 text-xs"
                      value={
                        (content as unknown as Record<string, string>)[
                          `feature_${n}_title`
                        ]
                      }
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          [`feature_${n}_title`]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="label-form text-[10px]">
                      Feature {n} Subtitle
                    </Label>
                    <Input
                      className="input-field mt-1 text-xs"
                      value={
                        (content as unknown as Record<string, string>)[
                          `feature_${n}_sub`
                        ]
                      }
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          [`feature_${n}_sub`]: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={saveContent}
              disabled={contentSaving}
              className="btn-primary w-full mt-2"
            >
              {contentSaving ? (
                <Loader2 size={13} className="animate-spin mr-1" />
              ) : null}
              {contentSaved ? "Saved ✓" : "Save Content"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
