// app/api/seed/route.ts
// Run once by visiting POST /api/seed (protect with SEED_SECRET in production)

import { NextRequest, NextResponse } from "next/server";
import { connectDB, SitePage, NavLink } from "@/models/model";

export async function POST(req: NextRequest) {
  // Simple secret guard — add SEED_SECRET to your .env.local
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const builtins = [
    {
      slug: "home",
      title: "Home",
      kind: "builtin",
      simpleBlocks: [
        {
          key: "hero_headline",
          label: "Hero Headline",
          type: "text",
          value: "Move With Intention.",
        },
        {
          key: "hero_subline",
          label: "Hero Subline",
          type: "richtext",
          value:
            "Premium gymwear designed to sculpt, support, and elevate your everyday strength.",
        },
        {
          key: "hero_cta",
          label: "CTA Button Label",
          type: "text",
          value: "Shop Now",
        },
        {
          key: "pillar_1_title",
          label: "Pillar 1 Title",
          type: "text",
          value: "Performance Fabric",
        },
        {
          key: "pillar_1_body",
          label: "Pillar 1 Body",
          type: "richtext",
          value:
            "4-way stretch knit engineered to move with your body, not against it.",
        },
        {
          key: "pillar_2_title",
          label: "Pillar 2 Title",
          type: "text",
          value: "Shape Retention",
        },
        {
          key: "pillar_2_body",
          label: "Pillar 2 Body",
          type: "richtext",
          value:
            "Washes 200+ times without losing compression or colour intensity.",
        },
        {
          key: "pillar_3_title",
          label: "Pillar 3 Title",
          type: "text",
          value: "Sustainably Made",
        },
        {
          key: "pillar_3_body",
          label: "Pillar 3 Body",
          type: "richtext",
          value:
            "Crafted from recycled fibres with a commitment to ethical production.",
        },
        {
          key: "pillar_4_title",
          label: "Pillar 4 Title",
          type: "text",
          value: "Loved by Thousands",
        },
        {
          key: "pillar_4_body",
          label: "Pillar 4 Body",
          type: "richtext",
          value: "98% of customers say they'd buy again — and bring a friend.",
        },
        {
          key: "newsletter_headline",
          label: "Newsletter Headline",
          type: "text",
          value: "10% off your first order.",
        },
        {
          key: "newsletter_body",
          label: "Newsletter Body",
          type: "richtext",
          value: "Sign up and be the first to hear about new drops.",
        },
      ],
      blocks: [],
      published: true,
    },
    {
      slug: "header",
      title: "Header",
      kind: "builtin",
      simpleBlocks: [],
      blocks: [],
      published: true,
    },
    {
      slug: "footer",
      title: "Footer",
      kind: "builtin",
      simpleBlocks: [
        {
          key: "footer_tagline",
          label: "Brand Tagline",
          type: "text",
          value: "Premium gymwear designed to sculpt, support, and elevate.",
        },
      ],
      blocks: [],
      published: true,
    },
  ];

  const results: string[] = [];

  for (const page of builtins) {
    const existing = await SitePage.findOne({ slug: page.slug });
    if (existing) {
      results.push(`Skipped "${page.slug}" (already exists)`);
    } else {
      await SitePage.create(page);
      results.push(`Created "${page.slug}"`);
    }
  }

  // Default header nav links
  const headerLinks = [
    {
      label: "Bestsellers",
      href: "/bestsellers",
      placement: "header",
      order: 1,
      isActive: true,
    },
    {
      label: "About",
      href: "/about",
      placement: "header",
      order: 2,
      isActive: true,
    },
  ];
  for (const link of headerLinks) {
    const exists = await NavLink.findOne({
      href: link.href,
      placement: link.placement,
    });
    if (!exists) {
      await NavLink.create(link);
      results.push(`Created nav link: ${link.label}`);
    } else {
      results.push(`Skipped nav link: ${link.label} (exists)`);
    }
  }

  return NextResponse.json({ success: true, results });
}
