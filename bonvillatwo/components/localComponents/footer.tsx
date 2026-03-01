import Link from "next/link";
import { Instagram, Youtube, Twitter } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "New Arrivals", href: "/shop/new" },
    { label: "Leggings", href: "/shop/leggings" },
    { label: "Matching Sets", href: "/shop/sets" },
    { label: "Sports Bras", href: "/shop/sports-bras" },
    { label: "Sale", href: "/shop/sale" },
  ],
  Company: [
    { label: "Our Story", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Press", href: "/press" },
    { label: "Careers", href: "/careers" },
  ],
  Help: [
    { label: "Size Guide", href: "/size-guide" },
    { label: "Returns", href: "/delivery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

const socials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://x.com", label: "X" },
];

export default function Footer() {
  return (
    <footer className="w-full px-5 md:px-10 lg:px-16 pb-8">
      {/* Top gold rule */}
      <div className="divider-gold mb-14" />

      <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 pb-12 border-b border-white/5">
        {/* Brand */}
        <div className="flex-shrink-0 max-w-[220px] space-y-6">
          <div>
            <p className="font-display text-2xl font-bold text-[#f0ece4] tracking-wide">
              BONVILLA
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-4 bg-[#c9a96e]/30" />
              <span className="font-body text-[8px] tracking-[0.45em] uppercase text-[#c9a96e]/35 font-medium">
                Elevated Activewear
              </span>
            </div>
          </div>

          <p className="font-body text-[13px] text-[#f0ece4]/30 leading-relaxed">
            Premium gymwear designed to sculpt, support, and elevate your
            everyday strength.
          </p>

          <div className="flex gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full border border-white/8 flex items-center justify-center text-[#f0ece4]/25 hover:border-[#c9a96e]/30 hover:text-[#c9a96e] transition-all duration-200"
              >
                <Icon size={13} />
              </Link>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 flex-1">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="font-body text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/40 font-semibold">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-body text-[13px] text-[#f0ece4]/30 hover:text-[#f0ece4]/70 hover:text-[#c9a96e]/80 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mini subscribe */}
        <div className="flex-shrink-0 max-w-[200px] space-y-4">
          <h4 className="font-body text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/40 font-semibold">
            Get 10% Off
          </h4>
          <p className="font-body text-[13px] text-[#f0ece4]/28 leading-relaxed">
            Early access & exclusive offers delivered to your inbox.
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-[#111113] border border-white/8 rounded-full px-4 py-2.5 font-body text-xs text-[#f0ece4] placeholder:text-[#f0ece4]/18 outline-none focus:border-[#c9a96e]/25 transition-colors"
            />
            <button className="w-full bg-[#c9a96e] hover:bg-[#dfc08a] text-[#0a0a0b] font-body font-bold text-[10px] tracking-[0.15em] uppercase py-2.5 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-[#c9a96e]/15">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
        <p className="font-body text-[11px] text-[#f0ece4]/18">
          © 2025 Bonvilla. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          {["Privacy", "Terms", "Cookies"].map((item) => (
            <Link
              key={item}
              href="#"
              className="font-body text-[11px] text-[#f0ece4]/18 hover:text-[#c9a96e]/60 transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {["Visa", "MC", "PayPal", "Apple Pay"].map((p) => (
            <span
              key={p}
              className="font-body text-[8px] font-semibold text-[#f0ece4]/18 border border-white/6 rounded px-1.5 py-0.5 tracking-wide"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
