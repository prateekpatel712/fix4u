"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";

interface HeaderProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function Header({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }: HeaderProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : setLocalIsOpen;

  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "The Agent", href: "/ai-booking-agent" },
    { label: "About", href: "/about" },
  ];

  const isHome = pathname === "/";
  const showHeader = !isHome || isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? "bg-ink/75 backdrop-blur-xl border-white/[0.05] py-3.5 shadow-2xl" 
            : "bg-transparent border-transparent py-6"
        } ${showHeader ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative w-9 h-9 rounded-full overflow-hidden bg-ink shrink-0">
              <Image src="/logo-c.png" alt="Fix4U" fill sizes="36px" priority className="object-cover scale-[1.08]" />
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-paper group-hover:text-coral transition-colors duration-300">
              fix<span className="text-coral">4</span>u
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-grey font-sans text-xs font-semibold uppercase tracking-widest py-1 group"
              >
                <span className="relative block overflow-hidden h-[1.2em]">
                  <span className="flex items-center h-full transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    {link.label}
                  </span>
                  <span className="absolute inset-0 flex items-center transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0 text-coral font-bold">
                    {link.label}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-white/[0.05] bg-white/[0.02] rounded-xl hover:border-coral/40 hover:text-coral transition-all duration-300"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </a>
            
            <Link
              href="/book"
              className="button__link header__nav__item header__nav__item--contact"
            >
              <div 
                className="contact__trigger button button--black h-[36px] w-[197.7px] rounded-none font-display text-sm font-bold tracking-wider flex items-stretch overflow-hidden relative select-none"
                style={{
                  justifyContent: "space-between",
                  padding: 0,
                  border: "1px solid #070709",
                }}
              >
                {/* Left Text Compartment */}
                <div className="contact__text-container flex-grow h-full flex items-center justify-start pl-5 pr-4 bg-ink text-paper">
                  <div className="button__text">
                    <span className="button__text--sp button__text--sp--1">Contact</span>
                    <span className="button__text--sp button__text--sp--2">Contact</span>
                  </div>
                </div>

                {/* Right Icon Compartment */}
                <div className="contact__icon">
                  <div className="button__icon">
                    <div className="button__icon__inner button__icon__inner--1">
                      <div className="button__arrow">
                        <svg className="button-arrow" viewBox="0 0 12 12">
                          <path className="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="button__icon__inner button__icon__inner--2">
                      <div className="button__arrow">
                        <svg className="button-arrow" viewBox="0 0 12 12">
                          <path className="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/book"
              className="contact__trigger button button--black h-[36px] px-3.5 rounded-none font-display text-sm font-bold tracking-wider flex items-center"
            >
              <div className="button__text">
                <span className="button__text--sp button__text--sp--1">Contact</span>
                <span className="button__text--sp button__text--sp--2">Contact</span>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="menu__trigger button button--ghost-black h-[36px] rounded-none font-display text-sm font-bold tracking-wider flex select-none"
            >
              <div className="menu__text-container flex-grow flex items-center justify-start pl-4 pr-3">
                <div className="button__text">
                  <span className="button__text--sp button__text--sp--1">{isOpen ? "Close" : "Menu"}</span>
                  <span className="button__text--sp button__text--sp--2">{isOpen ? "Close" : "Menu"}</span>
                </div>
              </div>
              <div className="menu__icon">
                <div className="button__icon">
                  <div className="menu__icon__inner menu__icon__inner--1">
                    <div className={`menu__icon--line ${isOpen ? "rotate-45 translate-y-[3px]" : ""}`}></div>
                    <div className={`menu__icon--line ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`}></div>
                  </div>
                  <div className="menu__icon__inner menu__icon__inner--2">
                    <div className={`menu__icon--line ${isOpen ? "rotate-45 translate-y-[3px]" : ""}`}></div>
                    <div className={`menu__icon--line ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`}></div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-ink md:hidden flex flex-col justify-between p-8 pt-28 transition-transform duration-700 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Glow meshes */}
        <div className="absolute inset-0 mesh-gradient opacity-15 pointer-events-none" />

        <div className="flex flex-col gap-6 relative z-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-display font-black text-4xl tracking-tight text-grey hover:text-coral transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.05] pt-8 relative z-10">
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.02] py-4 rounded-xl text-paper hover:border-coral transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 text-coral" /> Chat on WhatsApp
          </a>
          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            className="bg-coral text-ink font-sans font-bold py-4.5 rounded-xl text-center flex items-center justify-center gap-1.5"
          >
            Book a call <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </>
  );
}
