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
    { label: "Delivery & Returns", href: "/delivery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
};

const socials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://x.com", label: "X" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#f4d6a4]/50">
      <div className="pt-14 pb-8 px-5 md:px-14">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 pb-12 border-b border-[#425362]/8">
          {/* Brand column */}
          <div className="max-w-[240px] space-y-5 flex-shrink-0">
            <div>
              <p className="font-display text-2xl font-bold text-[#5b1619] tracking-tight">
                Bonvilla
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-5 bg-[#5b1619]/20" />
                <span className="font-body text-[9px] tracking-[0.4em] uppercase text-[#425362]/40 font-medium">
                  Elevated Activewear
                </span>
              </div>
            </div>

            <p className="font-body text-sm text-[#425362]/55 leading-relaxed">
              Premium gymwear designed to sculpt, support, and elevate your
              everyday strength.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-[#425362]/15 flex items-center justify-center text-[#425362]/45 hover:border-[#5b1619]/30 hover:text-[#5b1619] transition-all duration-200"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 flex-1">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section} className="space-y-4">
                <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#425362]/40 font-semibold">
                  {section}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="font-body text-sm text-[#425362]/60 hover:text-[#5b1619] transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mini newsletter */}
          <div className="flex-shrink-0 space-y-4 max-w-[210px]">
            <div>
              <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#425362]/40 font-semibold">
                Get 10% Off
              </h4>
              <p className="font-body text-sm text-[#425362]/55 leading-relaxed mt-2">
                Early access and exclusive offers — straight to your inbox.
              </p>
            </div>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-[#faf8f5] border border-[#425362]/12 rounded-full px-4 py-2.5 font-body text-xs text-[#425362] placeholder:text-[#425362]/30 outline-none focus:border-[#5b1619]/25 transition-colors"
              />
              <button className="w-full bg-[#5b1619] hover:bg-[#4a1113] text-white font-body font-semibold text-xs py-2.5 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-[#5b1619]/15">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p className="font-body text-xs text-[#425362]/35">
            © 2025 Bonvilla. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="font-body text-[11px] text-[#425362]/35 hover:text-[#5b1619] transition-colors duration-200"
                >
                  {item}
                </Link>
              ),
            )}
          </div>

          {/* Payment method tags */}
          <div className="flex items-center gap-1.5">
            {["Visa", "MC", "PayPal", "Apple Pay"].map((p) => (
              <span
                key={p}
                className="font-body text-[9px] font-semibold text-[#425362]/35 border border-[#425362]/12 rounded px-1.5 py-0.5 tracking-wide"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
