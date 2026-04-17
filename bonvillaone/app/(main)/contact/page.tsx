"use client";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

async function getContactContent() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const r = await fetch(`${base}/api/site-content/contact`, {
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

export default async function ContactPage() {
  const content = await getContactContent();

  const email = block(content, "contact_email", "hello@bonvilla.com");
  const phone = block(content, "contact_phone", "+44 20 0000 0000");
  const address = block(
    content,
    "contact_address",
    "Bonvilla Ltd\n12 Elmwood Studios\nLondon, EC1A 1BB\nUnited Kingdom",
  );
  const hours = block(
    content,
    "contact_hours",
    "Monday – Friday: 9am – 6pm GMT",
  );

  const details = [
    { icon: Mail, label: "Email Us", value: email, href: `mailto:${email}` },
    {
      icon: Phone,
      label: "Call Us",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
    },
    { icon: MapPin, label: "Our Address", value: address, href: null },
    { icon: Clock, label: "Opening Hours", value: hours, href: null },
  ];

  return (
    <div className="space-y-20 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="text-center space-y-4 pt-8">
        <span className="section-label justify-center">Get in Touch</span>
        <h1 className="font-display text-5xl md:text-7xl font-bold">
          Contact Us
        </h1>
        <p className="font-body text-base text-[--color-slate]/55 max-w-md mx-auto leading-relaxed">
          Questions, sizing advice, or just want to say hello? We&apos;d love to
          hear from you.
        </p>
      </div>

      <div className="divider-gold" />

      {/* Contact cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {details.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="surface-cream rounded-2xl p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-[--color-crimson]/8 flex items-center justify-center">
              <Icon size={15} className="text-[--color-crimson]" />
            </div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-[--color-slate]/45 font-semibold">
              {label}
            </p>
            {href ? (
              <a
                href={href}
                className="font-body text-sm text-[--color-slate]/75 hover:text-[--color-crimson] transition-colors whitespace-pre-line block"
              >
                {value}
              </a>
            ) : (
              <p className="font-body text-sm text-[--color-slate]/65 whitespace-pre-line">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <span className="section-label">Send a Message</span>
          <h2 className="font-display text-3xl font-bold">
            We reply within
            <br />
            24 hours.
          </h2>
          <p className="font-body text-sm text-[--color-slate]/55 leading-relaxed">
            Fill out the form and a member of our team will be in touch shortly.
            For order enquiries, please have your order number ready.
          </p>
        </div>

        {/* Client-side form */}
        <ContactForm />
      </div>

      {/* FAQ teaser */}
      <div className="surface-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold">
            Looking for quick answers?
          </h3>
          <p className="font-body text-sm text-[--color-slate]/55">
            Check our FAQ page for sizing, delivery, and returns info.
          </p>
        </div>
        <a href="/faq" className="btn-outline shrink-0">
          Browse FAQ →
        </a>
      </div>
    </div>
  );
}

/* Client component for the form */
function ContactForm() {
  "use client";
  // Static form — wire to your email provider / API route as needed
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Message sent! We'll be in touch shortly.");
      }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-form">First Name</label>
          <input className="input-field" placeholder="Jane" required />
        </div>
        <div>
          <label className="label-form">Last Name</label>
          <input className="input-field" placeholder="Smith" required />
        </div>
      </div>
      <div>
        <label className="label-form">Email</label>
        <input
          className="input-field"
          type="email"
          placeholder="jane@email.com"
          required
        />
      </div>
      <div>
        <label className="label-form">Order Number (optional)</label>
        <input className="input-field" placeholder="BON-XXXXX" />
      </div>
      <div>
        <label className="label-form">Message</label>
        <textarea
          className="input-field resize-none"
          rows={5}
          placeholder="How can we help?"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Send Message
      </button>
      <p className="font-body text-[10px] text-[--color-slate]/35 text-center">
        We&apos;ll never share your data with third parties.
      </p>
    </form>
  );
}
