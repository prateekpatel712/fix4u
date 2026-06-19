"use client";

import Link from "next/link";
import AnimatedTitle from "@/components/AnimatedTitle";
import InteractiveLogo from "@/components/InteractiveLogo";

interface HeroProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function Hero({ isOpen, setIsOpen }: HeroProps) {
  return (
    <section className="relative w-full bg-coral overflow-hidden text-ink">

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">
        
        {/* ==================== ROW 1: HEADER NAVIGATION ==================== */}
        {/* Row 1 Left: Logo */}
        <div className="lg:col-span-5 logo-container border-b lg:border-b-0 border-black/15 lg:border-r border-black/15 h-[82px] lg:h-[6vh] lg:min-h-[60px] flex items-center px-6 md:px-10">
          <Link
            href="/"
            className="flex items-center group"
            style={{
              paddingTop: "21.333px",
              paddingBottom: "21.333px",
              paddingLeft: "26.667px",
              paddingRight: "26.667px",
              marginTop: "-21.333px",
              marginBottom: "-21.333px",
              marginLeft: "-26.667px",
              marginRight: "-26.667px",
            }}
          >
            <div
              className="flex items-center gap-[10px] select-none"
              style={{
                width: "169.156px",
                height: "52.656px",
              }}
            >
              <svg viewBox="0 0 1107 828" className="w-[48px] h-[36px] text-ink fill-current transition-transform duration-300 group-hover:scale-105">
                <polygon points="841.5,198 913.5,126 913.5,54 409.5,54 193.5,270 193.5,342 337.5,342 481.5,198" />
                <polygon points="985.5,198 841.5,198 697.5,342 337.5,342 121.5,558 121.5,630 265.5,630 409.5,486 769.5,486 985.5,270" />
                <polygon points="265.5,630 193.5,702 193.5,774 697.5,774 913.5,558 913.5,486 769.5,486 625.5,630" />
              </svg>
              <span className="font-display font-bold text-[35px] tracking-tight text-ink transition-colors duration-300 leading-none">
                fix4u
              </span>
            </div>
          </Link>
        </div>
        {/* Row 1 Right: Navigation triggers */}
        <div className="lg:col-span-7 border-b border-black/15 h-[82px] lg:h-[6vh] lg:min-h-[60px] max-lg:flex lg:grid lg:grid-cols-7 justify-between items-center gap-4 lg:gap-0 px-6 md:px-10 lg:px-0">
          <div className="hidden lg:block lg:col-span-3 lg:border-r border-black/15 h-full" />
          
          {/* Menu trigger container */}
          <div className="lg:col-span-2 lg:h-full flex items-center justify-center lg:w-full">
            <div className="menu__trigger-wrapper lg:grow lg:w-auto flex items-stretch">
              <button
                onClick={() => setIsOpen?.(!isOpen)}
                className="menu__trigger header__nav__item header__nav__item--menu button button--ghost-black lg:w-full h-[36px] lg:h-auto w-[197.7px] rounded-none font-display text-sm font-bold tracking-wider flex select-none"
              >
                <div className="menu__text-container flex-grow flex items-center justify-start pl-5 pr-4">
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

          {/* Contact trigger container */}
          <div className="lg:col-span-2 lg:h-full flex items-center justify-center lg:w-full">
            <Link
              href="/book"
              className="button__link header__nav__item header__nav__item--contact lg:grow lg:w-auto h-[36px] lg:h-auto flex items-stretch"
            >
              <div 
                className="contact__trigger button button--black w-full h-full lg:w-full lg:h-full rounded-none font-display text-sm font-bold tracking-wider flex items-stretch overflow-hidden relative select-none"
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
        </div>

        {/* ==================== ROW 2: METADATA & STATUS ==================== */}
        {/* Row 2 Left: Technical status indicator */}
        <div className="hidden lg:block lg:col-span-5 lg:border-r border-black/15 lg:h-[6vh] lg:min-h-[60px]" />
        {/* Row 2 Right: Tag readouts */}
        <div className="lg:col-span-7 border-b border-black/15 h-[98px] lg:h-[6vh] lg:min-h-[60px] max-lg:flex lg:grid lg:grid-cols-7 items-center gap-12 lg:gap-0 px-6 md:px-10 lg:px-0">
          <div className="lg:col-span-3 lg:border-r border-black/15 lg:h-full flex items-center lg:px-6 md:px-10">
            <span className="font-mono text-[10px] tracking-widest text-ink font-bold select-none">SYSTEM</span>
          </div>
          <div className="lg:col-span-2 lg:border-r border-black/15 lg:h-full flex items-center lg:px-6 md:px-10">
            <span className="font-mono text-[10px] tracking-widest text-ink/70 select-none">EST. 2026</span>
          </div>
          <div className="hidden lg:block lg:col-span-2 h-full" />
        </div>

        {/* ==================== ROW 3: MAIN HEADING & INTERACTIVE MONOGRAM ==================== */}
        {/* Row 3 Left: Heading */}
        <div className="lg:col-span-5 border-b lg:border-b-0 border-black/15 lg:border-r border-black/15 flex items-center px-6 md:px-10 py-12 min-h-[350px] lg:h-[50vh] lg:min-h-[480px]">
          <AnimatedTitle
            lines={[
              "Next-Gen",
              <>Front <span className="text-white italic font-black">Desk.</span></>
            ]}
            className="font-display font-semibold text-[clamp(68px,7vw,110px)] tracking-tight leading-[0.82] text-ink max-w-3xl animate-title-large"
          />
        </div>
        {/* Row 3 Right: Logo Monogram Console */}
        <div className="lg:col-span-7 border-b border-black/15 min-h-[350px] lg:h-[50vh] lg:min-h-[480px] max-lg:flex lg:grid lg:grid-cols-7 relative overflow-hidden items-center justify-center lg:gap-0 p-8 lg:p-0">
          <div className="hidden lg:block lg:col-span-3 lg:border-r border-black/15 h-full" />
          <div className="lg:col-span-4 h-full w-full relative flex items-center justify-center">
            {/* Center divider line inside col-span-4 to align with Contact button's left edge */}
            <div className="hidden lg:block absolute left-[50%] top-0 bottom-0 w-[1px] bg-black/15 pointer-events-none" />
            <InteractiveLogo />
          </div>
        </div>

        {/* ==================== ROW 4: SUBTITLE & DEPLOYMENT STRIP ==================== */}
        {/* Row 4 Left: Subtitle paragraph */}
        <div className="lg:col-span-5 lg:border-r border-black/15 h-[150px] lg:h-[13vh] lg:min-h-[120px] flex items-center px-6 md:px-10 py-6">
          <p className="text-ink text-[clamp(20px,1.6vw,28px)] leading-[1.25] text-balance font-sans">
            Every enquiry answered in seconds, every booking made while you sleep.
          </p>
        </div>
        {/* Row 4 Right: Active deployment indicator */}
        <div className="lg:col-span-7 h-[100px] lg:h-[13vh] lg:min-h-[120px] max-lg:flex lg:grid lg:grid-cols-7 items-center lg:gap-0 px-6 md:px-10 py-6 lg:px-0 lg:py-0">
          <div className="lg:col-span-3 lg:border-r border-black/15 lg:h-full flex items-center lg:px-6 md:px-10">
            <div className="font-mono text-[9px] text-ink/70 uppercase tracking-widest flex items-center gap-2 select-none">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse shadow-lg shadow-emerald-600/30" />
              DEPLOYMENT PIPELINE: active sync [cal.com / crm]
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-2 lg:border-r border-black/15 h-full" />
          <div className="hidden lg:block lg:col-span-2 h-full" />
        </div>

      </div>
    </section>
  );
}
