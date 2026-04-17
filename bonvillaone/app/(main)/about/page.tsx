import Image from "next/image";
import Link from "next/link";

async function getAboutContent() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const r = await fetch(`${base}/api/site-content/about`, {
      next: { revalidate: 120 },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function block(
  content: { blocks?: { key: string; value: string }[] } | null,
  key: string,
  fallback: string,
) {
  return content?.blocks?.find((b) => b.key === key)?.value || fallback;
}

export default async function AboutPage() {
  const content = await getAboutContent();

  const headline = block(content, "about_headline", "We Exist to Elevate.");
  const body = block(
    content,
    "about_body",
    `Bonvilla was born from a simple frustration — gymwear that looked beautiful but fell apart the moment you actually trained in it.\n\nWe set out to change that. Every piece we make starts with performance: 4-way stretch, squat-proof fabrics, seam placement that doesn't dig. Then we layer in the aesthetic — because you shouldn't have to choose.\n\nWe design for the woman who shows up. Whether that's 5am in a gym that's too cold, a yoga class at midday, or a walk that turns into a run. She deserves gear that moves with her.`,
  );
  const heroImage = block(
    content,
    "about_image",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=85",
  );
  const mission = block(
    content,
    "about_mission",
    "To make women feel unstoppable — in the gym and beyond.",
  );

  const values = [
    {
      title: "Performance First",
      body: "Every design decision starts with how it performs. Does it hold its shape? Does it move with you? Does it last?",
    },
    {
      title: "Designed for Real Women",
      body: "We design for every body type — not the sample size. Our fit is tested on a diverse team before anything reaches you.",
    },
    {
      title: "Sustainable Craft",
      body: "We use recycled fibres wherever possible and work exclusively with factories that meet our ethical production standards.",
    },
    {
      title: "Community at Heart",
      body: "Our community of over 12,000 women is the reason we exist. Every review, every tag, every message shapes what we build next.",
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero */}
      <section className="relative w-full min-h-[60vh] rounded-3xl overflow-hidden flex items-end shadow-2xl shadow-[--color-crimson]/12">
        <Image
          src={heroImage}
          alt="About Bonvilla"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-crimson]/70 via-[--color-crimson]/20 to-transparent" />
        <div className="relative z-10 p-8 md:p-16 max-w-2xl space-y-4">
          <span className="section-label text-[--color-gold]/70">
            Our Story
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[0.92]">
            {headline}
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <span className="section-label justify-center">Our Mission</span>
        <blockquote className="font-display text-3xl md:text-4xl font-bold text-[--color-crimson] leading-tight">
          &ldquo;{mission}&rdquo;
        </blockquote>
        <div className="divider-gold max-w-xs mx-auto" />
      </section>

      {/* Body copy */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="section-label">Who We Are</span>
          <div className="space-y-4">
            {body
              .split("\n\n")
              .filter(Boolean)
              .map((para, i) => (
                <p
                  key={i}
                  className="font-body text-base text-[--color-slate]/70 leading-relaxed"
                >
                  {para}
                </p>
              ))}
          </div>
          <Link href="/shop">
            <button className="btn-primary mt-4">Shop the Collection</button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { val: "12k+", label: "Women in our community" },
            { val: "98%", label: "Would recommend us" },
            { val: "2,400+", label: "Styles designed" },
            { val: "2021", label: "Founded" },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="surface-cream rounded-2xl p-6 space-y-2"
            >
              <p className="font-display text-4xl font-bold text-[--color-crimson]">
                {val}
              </p>
              <p className="font-body text-xs text-[--color-slate]/55 uppercase tracking-widest">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="section-label justify-center">
            What We Stand For
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Our Values
          </h2>
        </div>
        <div className="divider-gold" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ title, body: vBody }, i) => (
            <div key={title} className="surface-card p-6 space-y-3 card-lift">
              <div className="w-8 h-8 rounded-full bg-[--color-crimson]/8 flex items-center justify-center">
                <span className="font-display text-sm font-bold text-[--color-crimson]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="font-body font-bold text-sm text-[--color-crimson]">
                {title}
              </p>
              <p className="font-body text-sm text-[--color-slate]/60 leading-relaxed">
                {vBody}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[--color-crimson] rounded-3xl px-8 md:px-20 py-16 text-center space-y-6">
        <div className="pointer-events-none absolute top-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[--color-gold]/10 blur-[80px]" />
        <div className="relative z-10 space-y-4 max-w-lg mx-auto">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[--color-gold]/60">
            Ready to Move?
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Shop the Collection
          </h2>
          <p className="font-body text-sm text-white/60">
            Over 2,400 styles waiting for you. Free returns, always.
          </p>
          <Link href="/shop">
            <button className="btn-gold mt-4">Explore Now</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
