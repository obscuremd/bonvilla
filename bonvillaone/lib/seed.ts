// ══════════════════════════════════════════════════════
// SEED BUILT-IN PAGES (run once — e.g. in a seed script)
// Ensures Home, Header, Footer built-in pages exist in DB.
// ══════════════════════════════════════════════════════
import { connectDB, SitePage, NavLink } from "@/models/model";

export async function seedBuiltinPages() {
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
      simpleBlocks: [], // header links come from NavLink collection
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

  for (const page of builtins) {
    await SitePage.findOneAndUpdate(
      { slug: page.slug },
      { $setOnInsert: page },
      { upsert: true },
    );
  }

  // Seed default header nav links
  const defaultHeaderLinks = [
    {
      label: "Bestsellers",
      href: "/bestsellers",
      placement: "header",
      order: 1,
    },
    { label: "About", href: "/about", placement: "header", order: 2 },
  ];
  for (const link of defaultHeaderLinks) {
    await NavLink.findOneAndUpdate(
      { href: link.href, placement: link.placement },
      { $setOnInsert: link },
      { upsert: true },
    );
  }

  console.log("Built-in pages seeded.");
}

export {};
