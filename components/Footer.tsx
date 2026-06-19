import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linksGroup1 = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "The Agent", href: "/ai-booking-agent" },
    { label: "Results", href: "/results" },
    { label: "About", href: "/about" },
  ];

  const linksGroup2 = [
    { label: "Book a call", href: "/book" },
    { label: "Free AI audit", href: "/#audit" },
    { label: "Contact", href: "/contact" },
  ];

  const linksGroup3 = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-ink border-t border-white/[0.05] pt-20 pb-8 px-6 font-sans relative overflow-hidden">
      {/* Subtle bottom mesh glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-coral/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-16 relative z-10">
        {/* Branding Column */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center border border-white/[0.08] bg-white/[0.02] rounded-xl overflow-hidden group-hover:border-coral/40 transition-colors duration-300">
              <span className="font-display font-black italic text-coral text-sm tracking-tighter">F4U</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-paper">
              fix<span className="text-coral">4</span>u
            </span>
          </Link>
          <p className="text-grey-dark text-xs sm:text-sm max-w-xs mt-2 leading-relaxed">
            Plug the leakage in your local service funnel with custom-trained AI receptionist agents answering 24/7.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-grey-dark hover:text-coral text-xs transition-colors duration-300 font-mono uppercase tracking-wider"
            >
              LinkedIn
            </a>
            <span className="text-white/10">|</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-grey-dark hover:text-coral text-xs transition-colors duration-300 font-mono uppercase tracking-wider"
            >
              Instagram
            </a>
            <span className="text-white/10">|</span>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-grey-dark hover:text-coral text-xs transition-colors duration-300 font-mono uppercase tracking-wider"
            >
              Twitter
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-4">
          <h4 className="text-paper font-display font-bold text-xs uppercase tracking-widest opacity-40">
            Fix4U System
          </h4>
          <ul className="flex flex-col gap-2.5">
            {linksGroup1.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-grey hover:text-coral text-xs sm:text-sm transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-4">
          <h4 className="text-paper font-display font-bold text-xs uppercase tracking-widest opacity-40">
            Get Started
          </h4>
          <ul className="flex flex-col gap-2.5">
            {linksGroup2.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-grey hover:text-coral text-xs sm:text-sm transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey hover:text-coral text-xs sm:text-sm flex items-center gap-1.5 transition-colors duration-300"
              >
                WhatsApp Chat <MessageCircle className="w-4 h-4 text-coral shrink-0" />
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col gap-4">
          <h4 className="text-paper font-display font-bold text-xs uppercase tracking-widest opacity-40">
            Company
          </h4>
          <ul className="flex flex-col gap-2.5">
            {linksGroup3.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-grey hover:text-coral text-xs sm:text-sm transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-grey-dark relative z-10">
        <div>
          &copy; {currentYear} Fix4U. All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          Designed with precision &bull; Powered by <span className="text-coral">Fix4U AI</span>
        </div>
      </div>
    </footer>
  );
}
