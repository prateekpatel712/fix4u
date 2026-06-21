"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowRight, MessageCircle } from "lucide-react";

export default function HomeNav() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // Whether the section behind each side is dark (→ that side needs light text).
  const [logoOnDark, setLogoOnDark] = useState(false);
  const [menuOnDark, setMenuOnDark] = useState(false);

  // Read the real background colour behind the bar (left + right) and adapt.
  useEffect(() => {
    let raf = 0;

    const isDarkAt = (x: number): boolean | null => {
      const header = headerRef.current;
      if (!header) return null;
      const y = header.offsetHeight / 2;
      for (const el of document.elementsFromPoint(x, y)) {
        if (header.contains(el)) continue; // ignore the bar itself
        const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
        if (!m) continue;
        const a = m[3] !== undefined ? +m[3] : 1;
        if (a < 0.5) continue; // see-through layer — keep looking
        const lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
        return lum < 0.5;
      }
      return null;
    };

    const update = () => {
      raf = 0;
      const left = isDarkAt(28);
      const right = isDarkAt(window.innerWidth - 28);
      if (left !== null) setLogoOnDark(left);
      if (right !== null) setMenuOnDark(right);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update); // initial (async — avoids setState-in-effect)
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const navLinks = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "The Agent", href: "/ai-booking-agent" },
    { label: "Results", href: "/results" },
    { label: "About", href: "/about" },
  ];

  // Overlay is dark, so force light there.
  const logoLight = logoOnDark || isOpen;
  const menuLight = menuOnDark || isOpen;
  const logoText = logoLight ? "text-paper" : "text-ink";
  const logoLine = logoLight ? "border-paper/25" : "border-ink/20";
  const menuText = menuLight ? "text-paper" : "text-ink";
  const menuLine = menuLight ? "border-paper/25" : "border-ink/20";

  const menuGlyph = isOpen ? (
    <X className="w-[18px] h-[18px]" />
  ) : (
    <span className="flex flex-col justify-center gap-[4px] w-[18px]">
      <span className="block h-[2px] w-full bg-current" />
      <span className="block h-[2px] w-full bg-current" />
    </span>
  );

  return (
    <>
      {/* Fixed transparent nav — colour adapts to the section behind each side */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 w-full bg-transparent backdrop-blur-md border-b transition-colors duration-300 ${logoLine}`}
      >
        <div className="flex items-stretch h-16 sm:h-[72px]">
          {/* Logo (monogram in an outlined box + wordmark) */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 sm:gap-3 px-4 md:px-8 border-r ${logoLine} ${logoText} shrink-0 group select-none transition-colors duration-300`}
          >
            <span className={`flex items-center justify-center border ${logoLine} p-1.5 sm:p-2`}>
              <svg viewBox="0 0 1107 828" className="w-5 h-4 sm:w-6 sm:h-[18px] fill-current">
                <polygon points="841.5,198 913.5,126 913.5,54 409.5,54 193.5,270 193.5,342 337.5,342 481.5,198" />
                <polygon points="985.5,198 841.5,198 697.5,342 337.5,342 121.5,558 121.5,630 265.5,630 409.5,486 769.5,486 985.5,270" />
                <polygon points="265.5,630 193.5,702 193.5,774 697.5,774 913.5,558 913.5,486 769.5,486 625.5,630" />
              </svg>
            </span>
            <span className="font-display font-bold text-lg sm:text-2xl tracking-tight leading-none hidden min-[380px]:inline">
              fix4u
            </span>
          </Link>

          {/* Middle grid divider */}
          <div className={`flex-1 lg:border-r ${logoLine}`} />

          {/* Menu + Contact boxes */}
          <div className="flex items-stretch gap-2 sm:gap-3 p-2 sm:p-2.5 shrink-0">
            {/* Menu — outlined box (adaptive) */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className={`nav__trigger group flex items-stretch border ${menuLine} ${menuText} font-display font-bold text-sm sm:text-base tracking-wider select-none transition-colors duration-300`}
            >
              <span className="flex items-center px-3 sm:px-5">
                <span className="button__text">
                  <span className="button__text--sp button__text--sp--1">{isOpen ? "Close" : "Menu"}</span>
                  <span className="button__text--sp button__text--sp--2">{isOpen ? "Close" : "Menu"}</span>
                </span>
              </span>
              <span className={`flex items-center justify-center px-3 sm:px-4 border-l ${menuLine}`}>
                <span className="button__icon">
                  <span className="button__icon__inner button__icon__inner--1">{menuGlyph}</span>
                  <span className="button__icon__inner button__icon__inner--2">{menuGlyph}</span>
                </span>
              </span>
            </button>

            {/* Contact — solid box (always readable) */}
            <Link
              href="/book"
              className="nav__trigger group flex items-stretch bg-ink text-paper font-display font-bold text-sm sm:text-base tracking-wider select-none"
            >
              <span className="flex items-center px-3 sm:px-5">
                <span className="button__text">
                  <span className="button__text--sp button__text--sp--1">Contact</span>
                  <span className="button__text--sp button__text--sp--2">Contact</span>
                </span>
              </span>
              <span className="flex items-center justify-center px-3 sm:px-4 border-l border-paper/25 group-hover:bg-coral group-hover:text-ink group-hover:border-coral transition-colors">
                <span className="button__icon">
                  <span className="button__icon__inner button__icon__inner--1">
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </span>
                  <span className="button__icon__inner button__icon__inner--2">
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </span>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay (all screen sizes) */}
      <div
        className={`fixed inset-0 z-40 bg-ink flex flex-col justify-between p-8 pt-28 transition-transform duration-700 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="absolute inset-0 mesh-gradient opacity-15 pointer-events-none" />

        <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-w-7xl mx-auto w-full">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-grey hover:text-coral transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 border-t border-white/[0.05] pt-8 relative z-10 max-w-7xl mx-auto w-full">
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.02] py-4 rounded-xl text-paper hover:border-coral transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 text-coral" /> Chat on WhatsApp
          </a>
          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-coral text-ink font-sans font-bold py-4 rounded-xl text-center flex items-center justify-center"
          >
            Book a call
          </Link>
        </div>
      </div>
    </>
  );
}
