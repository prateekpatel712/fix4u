import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const blocks = [
    {
      tag: "F4U. 01",
      title: "Navigation",
      links: [
        { label: "How it works", href: "/#how-it-works" },
        { label: "The Agent", href: "/ai-booking-agent" },
        { label: "About", href: "/about" },
      ],
    },
    {
      tag: "F4U. 02",
      title: "Get Started",
      links: [
        { label: "Book a call", href: "/book" },
        { label: "Live demo", href: "/demo" },
        { label: "Contact", href: "/contact" },
        { label: "Free AI audit", href: "/#audit" },
      ],
    },
    {
      tag: "F4U. 03",
      title: "Connect",
      links: [
        { label: "WhatsApp", href: "https://wa.me/919999999999" },
        { label: "Instagram", href: "https://instagram.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "Twitter", href: "https://x.com" },
      ],
    },
  ];

  const linkClass =
    "font-display text-lg md:text-xl font-medium hover:opacity-60 transition-opacity";

  return (
    <footer className="bg-coral text-ink w-full">
      {/* Block columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-ink/20">
        {blocks.map((b, i) => (
          <div
            key={b.tag}
            className={`p-8 lg:p-12 border-ink/20 flex flex-col gap-8 max-sm:border-b ${
              i < 2 ? "sm:border-r" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold uppercase tracking-widest">{b.tag}</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
                  {b.title}
                </span>
              </div>
              <span className="w-2.5 h-2.5 bg-ink mt-1" />
            </div>
            <ul className="flex flex-col gap-3">
              {b.links.map((l) =>
                l.href.startsWith("http") ? (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {l.label}
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Giant full-bleed wordmark */}
      <div className="border-t border-ink/20 pt-8 px-3 sm:px-4 select-none">
        <svg viewBox="0 0 100 24" width="100%" className="block" role="img" aria-label="fix4u">
          <text
            x="0"
            y="19.5"
            textLength="100"
            lengthAdjust="spacingAndGlyphs"
            fill="#070709"
            style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 900, fontSize: "23px", letterSpacing: "-0.03em" }}
          >
            fix<tspan fill="#F3F1EC">4</tspan>u
          </text>
        </svg>
      </div>

      {/* Bottom bar */}
      <div className="px-8 lg:px-12 py-8 border-t border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest">
        <div>&copy; {year} Fix4U — All rights reserved</div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:opacity-60 transition-opacity">Privacy</Link>
          <Link href="/cookies" className="hover:opacity-60 transition-opacity">Cookies</Link>
          <Link href="/terms" className="hover:opacity-60 transition-opacity">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
