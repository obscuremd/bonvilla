/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Globe,
  Layout,
  Menu,
  AlignLeft,
  Image as ImageIcon,
  Type,
  Minus,
  Link as LinkIcon,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Columns,
  X,
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
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { uploadImages } from "@/lib/uploadImages";

/* ── Types ── */
type BlockType =
  | "hero"
  | "heading"
  | "subheading"
  | "body"
  | "image_grid"
  | "features"
  | "cta"
  | "divider";
interface PageBlock {
  _id?: string;
  type: BlockType;
  order: number;
  value: Record<string, unknown>;
}
interface SimpleBlock {
  key: string;
  label: string;
  type: "text" | "richtext" | "image";
  value: string;
}
interface SitePage {
  _id?: string;
  slug: string;
  title: string;
  kind: "builtin" | "custom";
  simpleBlocks: SimpleBlock[];
  blocks: PageBlock[];
  published: boolean;
}
interface NavLink {
  _id: string;
  label: string;
  href: string;
  placement: string;
  order: number;
}

const BLOCK_META: Record<
  BlockType,
  { label: string; icon: React.FC<{ size?: number }> }
> = {
  hero: { label: "Hero Banner", icon: ImageIcon },
  heading: { label: "Heading", icon: Type },
  subheading: { label: "Sub-label", icon: AlignLeft },
  body: { label: "Body Text", icon: AlignLeft },
  image_grid: { label: "Image Grid", icon: Columns },
  features: { label: "Feature Strip", icon: Layout },
  cta: { label: "CTA Button", icon: LinkIcon },
  divider: { label: "Divider", icon: Minus },
};
const DEFAULT_VALUES: Record<BlockType, Record<string, unknown>> = {
  hero: { heading: "", subtext: "", images: [], label: "" },
  heading: { text: "" },
  subheading: { text: "" },
  body: { text: "" },
  image_grid: { title: "", caption: "", images: [] },
  features: {
    items: [
      { title: "", sub: "" },
      { title: "", sub: "" },
      { title: "", sub: "" },
    ],
  },
  cta: { label: "Shop Now", href: "/shop" },
  divider: {},
};

/* ── Block editor (same as before, condensed) ── */
function BlockEditor({
  block,
  onChange,
  onUpload,
}: {
  block: PageBlock;
  onChange: (v: Record<string, unknown>) => void;
  onUpload: (files: File[]) => Promise<string[]>;
}) {
  const [uploading, setUploading] = useState(false);
  const v = block.value;

  async function handleImages(
    e: React.ChangeEvent<HTMLInputElement>,
    field = "images",
  ) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await onUpload(files);
      onChange({ ...v, [field]: [...((v[field] as string[]) ?? []), ...urls] });
    } finally {
      setUploading(false);
    }
  }
  function removeImage(field: string, idx: number) {
    const imgs = [...((v[field] as string[]) ?? [])];
    imgs.splice(idx, 1);
    onChange({ ...v, [field]: imgs });
  }
  const imgPreview = (field: string) => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {((v[field] as string[]) ?? []).map((url, i) => (
          <div
            key={i}
            className="relative w-14 h-14 rounded-lg overflow-hidden border border-border"
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(field, i)}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center"
            >
              <X size={9} />
            </button>
          </div>
        ))}
      </div>
      <label className="cursor-pointer flex items-center gap-2">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImages(e, field)}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          className="text-xs"
        >
          {uploading ? (
            <>
              <Loader2 size={12} className="animate-spin mr-1" />
              Uploading…
            </>
          ) : (
            <>
              <ImageIcon size={12} className="mr-1" />
              Add Images
            </>
          )}
        </Button>
      </label>
    </div>
  );

  if (block.type === "hero")
    return (
      <div className="space-y-3">
        <div>
          <Label className="label-form">Heading</Label>
          <Input
            className="input-field mt-1"
            value={(v.heading as string) ?? ""}
            onChange={(e) => onChange({ ...v, heading: e.target.value })}
          />
        </div>
        <div>
          <Label className="label-form">Subtext</Label>
          <Textarea
            className="input-field mt-1 resize-none"
            rows={3}
            value={(v.subtext as string) ?? ""}
            onChange={(e) => onChange({ ...v, subtext: e.target.value })}
          />
        </div>
        <div>
          <Label className="label-form">Eyebrow label</Label>
          <Input
            className="input-field mt-1"
            value={(v.label as string) ?? ""}
            onChange={(e) => onChange({ ...v, label: e.target.value })}
          />
        </div>
        <div>
          <Label className="label-form">
            Images{" "}
            <span className="font-normal normal-case text-muted-foreground">
              (1 = static · 2+ = carousel)
            </span>
          </Label>
          {imgPreview("images")}
        </div>
      </div>
    );
  if (block.type === "heading")
    return (
      <div>
        <Label className="label-form">Heading</Label>
        <Input
          className="input-field mt-1"
          value={(v.text as string) ?? ""}
          onChange={(e) => onChange({ ...v, text: e.target.value })}
        />
      </div>
    );
  if (block.type === "subheading")
    return (
      <div>
        <Label className="label-form">Sub-label</Label>
        <Input
          className="input-field mt-1"
          value={(v.text as string) ?? ""}
          onChange={(e) => onChange({ ...v, text: e.target.value })}
        />
      </div>
    );
  if (block.type === "body")
    return (
      <div>
        <Label className="label-form">Body Text</Label>
        <Textarea
          className="input-field mt-1 resize-none"
          rows={5}
          value={(v.text as string) ?? ""}
          onChange={(e) => onChange({ ...v, text: e.target.value })}
        />
      </div>
    );
  if (block.type === "image_grid")
    return (
      <div className="space-y-3">
        <div>
          <Label className="label-form">Title</Label>
          <Input
            className="input-field mt-1"
            value={(v.title as string) ?? ""}
            onChange={(e) => onChange({ ...v, title: e.target.value })}
          />
        </div>
        <div>
          <Label className="label-form">Caption</Label>
          <Input
            className="input-field mt-1"
            value={(v.caption as string) ?? ""}
            onChange={(e) => onChange({ ...v, caption: e.target.value })}
          />
        </div>
        <div>
          <Label className="label-form">Images</Label>
          {imgPreview("images")}
        </div>
      </div>
    );
  if (block.type === "features") {
    const items = (v.items as { title: string; sub: string }[]) ?? [
      { title: "", sub: "" },
    ];
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/30 border border-border"
          >
            <div>
              <Label className="label-form text-[10px]">Title {i + 1}</Label>
              <Input
                className="input-field mt-1 text-xs"
                value={item.title}
                onChange={(e) => {
                  const n = [...items];
                  n[i] = { ...n[i], title: e.target.value };
                  onChange({ ...v, items: n });
                }}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="label-form text-[10px]">Subtitle</Label>
                <Input
                  className="input-field mt-1 text-xs"
                  value={item.sub}
                  onChange={(e) => {
                    const n = [...items];
                    n[i] = { ...n[i], sub: e.target.value };
                    onChange({ ...v, items: n });
                  }}
                />
              </div>
              {items.length > 1 && (
                <button
                  onClick={() =>
                    onChange({ ...v, items: items.filter((_, ii) => ii !== i) })
                  }
                  className="mt-5 text-destructive"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({ ...v, items: [...items, { title: "", sub: "" }] })
          }
        >
          <Plus size={12} className="mr-1" />
          Add Feature
        </Button>
      </div>
    );
  }
  if (block.type === "cta")
    return (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="label-form">Label</Label>
          <Input
            className="input-field mt-1"
            value={(v.label as string) ?? ""}
            onChange={(e) => onChange({ ...v, label: e.target.value })}
          />
        </div>
        <div>
          <Label className="label-form">href</Label>
          <Input
            className="input-field mt-1"
            value={(v.href as string) ?? ""}
            onChange={(e) => onChange({ ...v, href: e.target.value })}
          />
        </div>
      </div>
    );
  return (
    <p className="font-body text-xs text-muted-foreground italic">
      Divider — no settings needed.
    </p>
  );
}

/* ── Simple blocks (built-in) ── */
function SimpleBlockForm({
  blocks,
  onChange,
  onImageUpload,
}: {
  blocks: SimpleBlock[];
  onChange: (u: SimpleBlock[]) => void;
  onImageUpload: (f: File[]) => Promise<string[]>;
}) {
  const [uploading, setUploading] = useState<string | null>(null);
  async function handleImg(
    key: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(key);
    try {
      const urls = await onImageUpload(files);
      onChange(
        blocks.map((b) =>
          b.key === key ? { ...b, value: urls[0] ?? b.value } : b,
        ),
      );
    } finally {
      setUploading(null);
    }
  }
  return (
    <div className="space-y-4">
      {blocks.map((b) => (
        <div key={b.key}>
          <Label className="label-form">{b.label}</Label>
          {b.type === "richtext" ? (
            <Textarea
              className="input-field mt-1 resize-none"
              rows={4}
              value={b.value}
              onChange={(e) =>
                onChange(
                  blocks.map((x) =>
                    x.key === b.key ? { ...x, value: e.target.value } : x,
                  ),
                )
              }
            />
          ) : b.type === "image" ? (
            <div className="mt-1 space-y-2">
              {b.value && (
                <img
                  src={b.value}
                  alt=""
                  className="h-20 rounded-lg border border-border object-cover"
                />
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImg(b.key, e)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading === b.key}
                >
                  {uploading === b.key ? (
                    <Loader2 size={12} className="animate-spin mr-1" />
                  ) : (
                    <ImageIcon size={12} className="mr-1" />
                  )}
                  {b.value ? "Replace" : "Upload"}
                </Button>
                {b.value && (
                  <Input
                    className="input-field text-xs flex-1"
                    value={b.value}
                    onChange={(e) =>
                      onChange(
                        blocks.map((x) =>
                          x.key === b.key ? { ...x, value: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="or paste URL"
                  />
                )}
              </label>
            </div>
          ) : (
            <Input
              className="input-field mt-1"
              value={b.value}
              onChange={(e) =>
                onChange(
                  blocks.map((x) =>
                    x.key === b.key ? { ...x, value: e.target.value } : x,
                  ),
                )
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Nav link manager ── */
function NavLinkManager({
  placement,
  label,
}: {
  placement: string;
  label: string;
}) {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [saving, setSaving] = useState(false);
  async function load() {
    const r = await fetch(`/api/nav-links?placement=${placement}`);
    const d = await r.json();
    setLinks(Array.isArray(d) ? d : []);
  }
  useEffect(() => {
    load();
  }, [placement]);
  async function add() {
    if (!newLabel || !newHref) return;
    setSaving(true);
    await fetch("/api/nav-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newLabel,
        href: newHref,
        placement,
        order: links.length,
        isActive: true,
      }),
    });
    setNewLabel("");
    setNewHref("");
    await load();
    setSaving(false);
  }
  async function remove(id: string) {
    await fetch(`/api/nav-links/${id}`, { method: "DELETE" });
    await load();
  }
  return (
    <div className="space-y-4">
      <p className="label-form">{label}</p>
      <div className="space-y-2">
        {links.map((l) => (
          <div
            key={l._id}
            className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/20"
          >
            <GripVertical
              size={13}
              className="text-muted-foreground/40 cursor-grab"
            />
            <span className="font-body text-sm flex-1">{l.label}</span>
            <span className="font-body text-xs text-muted-foreground">
              {l.href}
            </span>
            <button
              onClick={() => remove(l._id)}
              className="text-muted-foreground/50 hover:text-destructive"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {links.length === 0 && (
          <p className="font-body text-xs text-muted-foreground italic">
            No links yet.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          className="input-field text-sm"
          placeholder="Label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <Input
          className="input-field text-sm"
          placeholder="/href"
          value={newHref}
          onChange={(e) => setNewHref(e.target.value)}
        />
        <Button
          onClick={add}
          disabled={saving || !newLabel || !newHref}
          size="sm"
          className="btn-primary shrink-0"
        >
          {saving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Plus size={12} />
          )}
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PAGE EDITOR — fetches fresh on mount,
   has SAVE + PUBLISH as separate actions
═══════════════════════════════════════ */
function PageEditorPanel({ pageSlug }: { pageSlug: string }) {
  const [page, setPage] = useState<SitePage | null>(null);
  const [simpleBlocks, setSimpleBlocks] = useState<SimpleBlock[]>([]);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/site-pages/${pageSlug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SitePage | null) => {
        if (!data) return;
        setPage(data);
        setSimpleBlocks(data.simpleBlocks ?? []);
        setBlocks([...(data.blocks ?? [])].sort((a, b) => a.order - b.order));
        setCollapsed(new Set());
      })
      .finally(() => setLoading(false));
  }, [pageSlug]);

  async function handleUpload(files: File[]): Promise<string[]> {
    const r = await uploadImages(files);
    return r.message === "success" ? r.data : [];
  }

  function addBlock(type: BlockType) {
    setBlocks((prev) => [
      ...prev,
      { type, order: prev.length, value: { ...DEFAULT_VALUES[type] } },
    ]);
  }
  function updateBlock(idx: number, value: Record<string, unknown>) {
    setBlocks((prev) => prev.map((b, i) => (i === idx ? { ...b, value } : b)));
  }
  function moveBlock(idx: number, dir: -1 | 1) {
    const b = [...blocks];
    const s = idx + dir;
    if (s < 0 || s >= b.length) return;
    [b[idx], b[s]] = [b[s], b[idx]];
    setBlocks(b.map((x, i) => ({ ...x, order: i })));
  }
  function removeBlock(idx: number) {
    setBlocks((prev) =>
      prev.filter((_, i) => i !== idx).map((x, i) => ({ ...x, order: i })),
    );
  }
  function toggleCollapse(idx: number) {
    setCollapsed((prev) => {
      const s = new Set(prev);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      return s;
    });
  }

  /* Save without publishing */
  async function saveAll() {
    if (!page) return;
    setSaving(true);
    await fetch(`/api/site-pages/${page.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        simpleBlocks,
        blocks: blocks.map((b, i) => ({ ...b, order: i })),
      }),
    });
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  }

  /* Toggle published state */
  async function togglePublish() {
    if (!page) return;
    setPublishing(true);
    const nextPublished = !page.published;
    await fetch(`/api/site-pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: nextPublished }),
    });
    setPage((p) => (p ? { ...p, published: nextPublished } : null));
    setPublishing(false);
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={18} className="animate-spin text-[#5b1619]/40" />
      </div>
    );
  if (!page)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-body text-sm text-muted-foreground">
          Page not found.
        </p>
      </div>
    );

  /* Header/Footer: special views */
  if (page.slug === "header")
    return (
      <div className="space-y-8 p-6">
        <div>
          <h3 className="font-display text-xl font-bold">Header Navigation</h3>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Manage static navigation links. Categories are pulled automatically.
          </p>
        </div>
        <Separator />
        <NavLinkManager placement="header" label="Navigation Links" />
      </div>
    );
  if (page.slug === "footer")
    return (
      <div className="space-y-8 p-6 overflow-y-auto">
        <div>
          <h3 className="font-display text-xl font-bold">Footer</h3>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Manage footer columns and brand tagline.
          </p>
        </div>
        <Separator />
        {simpleBlocks.length > 0 && (
          <div className="surface rounded-xl p-4 space-y-4">
            <p className="font-body text-sm font-semibold">Brand Tagline</p>
            <SimpleBlockForm
              blocks={simpleBlocks}
              onChange={setSimpleBlocks}
              onImageUpload={handleUpload}
            />
          </div>
        )}
        <Separator />
        <NavLinkManager placement="footer_shop" label="Shop Column" />
        <NavLinkManager placement="footer_company" label="Company Column" />
        <NavLinkManager placement="footer_help" label="Help Column" />
        <Button onClick={saveAll} disabled={saving} className="btn-primary">
          {saving ? (
            <Loader2 size={13} className="animate-spin mr-1" />
          ) : (
            <Save size={13} className="mr-1" />
          )}
          {savedAt ? "Saved ✓" : "Save Changes"}
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Sticky header with SAVE + PUBLISH ── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-foreground truncate">
            {page.title}
          </h3>
          <p className="font-body text-[11px] text-muted-foreground">
            {page.kind === "builtin" ? "Built-in" : `/p/${page.slug}`}
            {savedAt && (
              <span className="ml-2 text-green-600">· Saved {savedAt}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Preview link (custom pages only) */}
          {page.kind === "custom" && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/p/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={12} className="mr-1" />
                Preview
              </a>
            </Button>
          )}

          {/* SAVE (draft) */}
          <Button
            onClick={saveAll}
            disabled={saving}
            size="sm"
            variant="outline"
            className="btn-outline text-xs px-3 py-1.5 h-auto"
          >
            {saving ? (
              <Loader2 size={12} className="animate-spin mr-1" />
            ) : (
              <Save size={12} className="mr-1" />
            )}
            Save Draft
          </Button>

          {/* PUBLISH / UNPUBLISH — prominent, clearly labelled */}
          <Button
            onClick={togglePublish}
            disabled={publishing}
            size="sm"
            className={`text-xs px-3 py-1.5 h-auto font-semibold gap-1.5 ${
              page.published
                ? "btn-outline border-amber-400/50 text-amber-700 hover:bg-amber-50"
                : "btn-primary"
            }`}
          >
            {publishing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : page.published ? (
              <EyeOff size={12} />
            ) : (
              <Eye size={12} />
            )}
            {publishing ? "…" : page.published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Published status banner */}
      {page.kind === "custom" && (
        <div
          className={`px-6 py-2 text-xs font-body font-semibold flex items-center gap-2 ${page.published ? "bg-green-50 text-green-700 border-b border-green-100" : "bg-amber-50 text-amber-700 border-b border-amber-100"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${page.published ? "bg-green-500" : "bg-amber-400"}`}
          />
          {page.published
            ? `Live at /p/${page.slug}`
            : "Draft — not visible to the public"}
        </div>
      )}

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Simple content (home fields etc.) */}
        {simpleBlocks.length > 0 && (
          <div className="surface rounded-2xl p-5 space-y-5">
            <p className="font-body text-sm font-semibold">Page Content</p>
            <SimpleBlockForm
              blocks={simpleBlocks}
              onChange={setSimpleBlocks}
              onImageUpload={handleUpload}
            />
          </div>
        )}

        {/* Rich blocks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm font-semibold">
              {page.kind === "custom" ? "Page Sections" : "Additional Sections"}
            </p>
            <span className="font-body text-xs text-muted-foreground">
              {blocks.length} block{blocks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {blocks.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <p className="font-body text-sm text-muted-foreground">
                No sections yet — add one below.
              </p>
            </div>
          )}

          {blocks.map((block, idx) => {
            const meta = BLOCK_META[block.type];
            const Icon = meta.icon;
            const isCollapsed = collapsed.has(idx);
            return (
              <div
                key={`${block._id ?? idx}-${block.type}`}
                className="surface rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/20 border-b border-border">
                  <GripVertical
                    size={14}
                    className="text-muted-foreground/40 cursor-grab shrink-0"
                  />
                  <span className="text-[#5b1619] shrink-0">
                    <Icon size={14} />
                  </span>
                  <span className="font-body text-sm font-medium flex-1">
                    {meta.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveBlock(idx, -1)}
                      disabled={idx === 0}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground/50 hover:text-foreground disabled:opacity-20"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      onClick={() => moveBlock(idx, 1)}
                      disabled={idx === blocks.length - 1}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground/50 hover:text-foreground disabled:opacity-20"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      onClick={() => toggleCollapse(idx)}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground/50 hover:text-foreground"
                    >
                      {isCollapsed ? (
                        <ChevronDown size={13} />
                      ) : (
                        <ChevronUp size={13} />
                      )}
                    </button>
                    <button
                      onClick={() => removeBlock(idx)}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground/50 hover:text-destructive"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {!isCollapsed && (
                  <div className="p-4">
                    <BlockEditor
                      block={block}
                      onChange={(v) => updateBlock(idx, v)}
                      onUpload={handleUpload}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap gap-2 pt-1">
            {(Object.keys(BLOCK_META) as BlockType[]).map((type) => {
              const Icon = BLOCK_META[type].icon;
              return (
                <Button
                  key={type}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(type)}
                  className="text-xs gap-1.5 border-dashed hover:border-[#5b1619]/40 hover:text-[#5b1619]"
                >
                  <Icon size={11} />
                  {BLOCK_META[type].label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── New page dialog ── */
function NewPageDialog({ onCreated }: { onCreated: (p: SitePage) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  function deriveSlug(t: string) {
    return t
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  async function create() {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    const r = await fetch("/api/site-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        kind: "custom",
        blocks: [],
        simpleBlocks: [],
        published: false,
      }),
    });
    if (!r.ok) {
      const d = await r.json();
      setError(d.error ?? "Failed.");
      setSaving(false);
      return;
    }
    const page = await r.json();
    onCreated(page);
    setOpen(false);
    setTitle("");
    setSlug("");
    setSaving(false);
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="btn-primary w-full gap-1.5">
          <Plus size={13} />
          New Page
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="surface">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl text-[#5b1619]">
            Create New Page
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-muted-foreground">
            Accessible at <code className="text-[#5b1619]">/p/[slug]</code>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="label-form">Page Title</Label>
            <Input
              className="input-field mt-1"
              placeholder="e.g. Meet the Team"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(deriveSlug(e.target.value));
              }}
            />
          </div>
          <div>
            <Label className="label-form">Slug</Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body text-xs text-muted-foreground">
                /p/
              </span>
              <Input
                className="input-field flex-1"
                value={slug}
                onChange={(e) => setSlug(deriveSlug(e.target.value))}
              />
            </div>
          </div>
          {error && (
            <p className="font-body text-xs text-destructive">{error}</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="btn-outline text-sm">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={create}
            disabled={saving}
            className="btn-primary text-sm"
          >
            {saving ? (
              <Loader2 size={12} className="animate-spin mr-1" />
            ) : null}
            Create Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════ */
export default function CMSContent() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  async function loadPages() {
    const r = await fetch("/api/site-pages");
    const data: SitePage[] = await r.json();
    setPages(Array.isArray(data) ? data : []);
    if (!activeSlug && data.length > 0) setActiveSlug(data[0].slug);
    setLoading(false);
  }
  useEffect(() => {
    loadPages();
  }, []);

  /* Keep sidebar badges in sync after publish toggle */
  function refreshPageInList(slug: string, published: boolean) {
    setPages((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, published } : p)),
    );
  }

  async function deletePage(page: SitePage) {
    await fetch(`/api/site-pages/${page.slug}`, { method: "DELETE" });
    setActiveSlug(null);
    await loadPages();
  }

  const builtins = pages.filter((p) => p.kind === "builtin");
  const customs = pages.filter((p) => p.kind === "custom");

  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-semibold">
          Built-in Pages
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-0.5">
          {builtins.map((page) => (
            <button
              key={page.slug}
              onClick={() => setActiveSlug(page.slug)}
              className={`cms-nav-item w-full text-left ${activeSlug === page.slug ? "active" : ""}`}
            >
              {page.slug === "home" && <Layout size={14} />}
              {page.slug === "header" && <Menu size={14} />}
              {page.slug === "footer" && <AlignLeft size={14} />}
              <span className="flex-1">{page.title}</span>
            </button>
          ))}
          {customs.length > 0 && (
            <>
              <Separator className="my-3" />
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-semibold px-2 pb-1">
                Custom Pages
              </p>
              {customs.map((page) => (
                <div key={page.slug} className="group relative">
                  <button
                    onClick={() => setActiveSlug(page.slug)}
                    className={`cms-nav-item w-full text-left pr-8 ${activeSlug === page.slug ? "active" : ""}`}
                  >
                    <Globe size={14} />
                    <span className="flex-1 truncate">{page.title}</span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold tracking-wide h-4 px-1.5 ${page.published ? "border-green-300 text-green-700 bg-green-50" : "border-amber-300 text-amber-700 bg-amber-50"}`}
                    >
                      {page.published ? "Live" : "Draft"}
                    </Badge>
                  </button>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive">
                          <Trash2 size={11} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="surface">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display text-lg text-[#5b1619]">
                            Delete &quot;{page.title}&quot;?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="btn-outline text-sm">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deletePage(page)}
                            className="btn-danger"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-border">
        <NewPageDialog
          onCreated={(p) => {
            setPages((prev) => [...prev, p]);
            setActiveSlug(p.slug);
          }}
        />
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-[#5b1619]/40" />
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-6 md:-m-8 overflow-hidden">
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-border bg-muted/20">
        <SidebarInner />
      </aside>
      <div className="md:hidden absolute top-2 left-2 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={15} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-56 surface">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle className="font-body text-sm">Pages</SheetTitle>
            </SheetHeader>
            <SidebarInner />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeSlug ? (
          <PageEditorPanel key={activeSlug} pageSlug={activeSlug} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="font-body text-sm text-muted-foreground">
              Select a page to edit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
