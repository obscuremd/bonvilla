import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const BASE = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/* ── Types matching our model ── */
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

interface SitePage {
  slug: string;
  title: string;
  kind: string;
  blocks: PageBlock[];
  published: boolean;
}

async function getPage(slug: string): Promise<SitePage | null> {
  try {
    const r = await fetch(`${BASE()}/api/site-pages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  return { title: page?.title ?? "Page" };
}

/* ═══════════════════════════════════
   BLOCK RENDERERS
═══════════════════════════════════ */

/* Hero block */
function HeroBlock({ value }: { value: Record<string, unknown> }) {
  const images = (value.images as string[]) ?? [];
  const heading = (value.heading as string) ?? "";
  const subtext = (value.subtext as string) ?? "";
  const label = (value.label as string) ?? "";
  const hasImages = images.length > 0;

  /* Single image = static, 2+ = simple auto-playing carousel */
  return (
    <section className="relative w-full min-h-[52vh] flex items-end rounded-3xl overflow-hidden shadow-2xl shadow-[rgba(91,22,25,0.15)] ring-1 ring-[rgba(244,214,164,0.2)]">
      {hasImages ? (
        images.length === 1 ? (
          <Image
            src={images[0]}
            alt={heading}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          /* Multi-image carousel (CSS only, no JS) */
          <div className="absolute inset-0">
            {images.map((src, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  animation: `heroSlide ${images.length * 5}s ${i * 5}s infinite`,
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  priority={i === 0}
                />
              </div>
            ))}
            <style>{`
              @keyframes heroSlide {
                0%, ${Math.floor(100 / images.length) - 5}% { opacity: 1; }
                ${Math.floor(100 / images.length)}%, 100%  { opacity: 0; }
              }
            `}</style>
          </div>
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#5b1619] to-[#4a1113]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(91,22,25,0.75)] via-[rgba(91,22,25,0.2)] to-transparent" />

      <div className="relative z-10 p-8 md:p-14 space-y-4 max-w-2xl">
        {label && (
          <span className="section-label text-[rgba(244,214,164,0.7)]">
            {label}
          </span>
        )}
        {heading && (
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-[0.92]">
            {heading}
          </h1>
        )}
        {subtext && (
          <p className="font-body text-sm md:text-base text-white/65 leading-relaxed max-w-md">
            {subtext}
          </p>
        )}
      </div>
    </section>
  );
}

/* Heading block */
function HeadingBlock({ value }: { value: Record<string, unknown> }) {
  return (
    <h2 className="font-display text-3xl md:text-4xl font-bold text-[#5b1619]">
      {(value.text as string) ?? ""}
    </h2>
  );
}

/* Sub-label block */
function SubheadingBlock({ value }: { value: Record<string, unknown> }) {
  return <span className="section-label">{(value.text as string) ?? ""}</span>;
}

/* Body text */
function BodyBlock({ value }: { value: Record<string, unknown> }) {
  return (
    <p className="font-body text-base text-[rgba(66,83,98,0.7)] leading-relaxed max-w-2xl">
      {(value.text as string) ?? ""}
    </p>
  );
}

/* Image grid */
function ImageGridBlock({ value }: { value: Record<string, unknown> }) {
  const images = (value.images as string[]) ?? [];
  const title = (value.title as string) ?? "";
  const caption = (value.caption as string) ?? "";

  if (!images.length) return null;

  const cols =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : images.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 md:grid-cols-4";

  return (
    <div className="space-y-4">
      {(title || caption) && (
        <div className="space-y-1">
          {title && (
            <h3 className="font-display text-2xl font-bold text-[#5b1619]">
              {title}
            </h3>
          )}
          {caption && (
            <p className="font-body text-sm text-[rgba(66,83,98,0.55)]">
              {caption}
            </p>
          )}
        </div>
      )}
      <div className={`grid ${cols} gap-3 md:gap-4`}>
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-[rgba(244,214,164,0.2)]"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Feature strip */
function FeaturesBlock({ value }: { value: Record<string, unknown> }) {
  const items = (value.items as { title: string; sub: string }[]) ?? [];
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-8 py-2">
      {items.map(({ title, sub }) => (
        <div key={title}>
          <p className="font-body text-xs font-bold text-[#5b1619]">{title}</p>
          <p className="font-body text-[11px] text-[rgba(66,83,98,0.5)] mt-0.5">
            {sub}
          </p>
        </div>
      ))}
    </div>
  );
}

/* CTA button */
function CTABlock({ value }: { value: Record<string, unknown> }) {
  const label = (value.label as string) ?? "Learn More";
  const href = (value.href as string) ?? "#";
  return (
    <div>
      <Link href={href}>
        <button className="btn-primary">{label}</button>
      </Link>
    </div>
  );
}

/* Divider */
function DividerBlock() {
  return <div className="divider-gold" />;
}

/* ── Block dispatcher ── */
function RenderBlock({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "hero":
      return <HeroBlock value={block.value} />;
    case "heading":
      return <HeadingBlock value={block.value} />;
    case "subheading":
      return <SubheadingBlock value={block.value} />;
    case "body":
      return <BodyBlock value={block.value} />;
    case "image_grid":
      return <ImageGridBlock value={block.value} />;
    case "features":
      return <FeaturesBlock value={block.value} />;
    case "cta":
      return <CTABlock value={block.value} />;
    case "divider":
      return <DividerBlock />;
    default:
      return null;
  }
}

/* ═══════════════════════════════════
   PAGE
═══════════════════════════════════ */
export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page || (!page.published && process.env.NODE_ENV === "production")) {
    notFound();
  }

  const sortedBlocks = [...(page.blocks ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="w-full space-y-12 md:space-y-16">
      {/* Draft banner */}
      {!page.published && (
        <div className="bg-[rgba(244,214,164,0.3)] border border-[rgba(244,214,164,0.6)] rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-sm">🔒</span>
          <p className="font-body text-sm text-[#5b1619]">
            <strong>Preview mode</strong> — this page is unpublished. Publish it
            from the CMS to make it public.
          </p>
        </div>
      )}

      {/* Render blocks */}
      {sortedBlocks.length > 0 ? (
        sortedBlocks.map((block, i) => (
          <div key={block._id ?? i}>
            <RenderBlock block={block} />
          </div>
        ))
      ) : (
        <div className="text-center py-20 space-y-3">
          <p className="font-display text-3xl font-bold text-[rgba(91,22,25,0.2)]">
            {page.title}
          </p>
          <p className="font-body text-sm text-muted-foreground">
            No content yet — add blocks in the CMS.
          </p>
        </div>
      )}
    </div>
  );
}
