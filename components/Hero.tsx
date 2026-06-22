"use client";

import AnimatedTitle from "@/components/AnimatedTitle";
import InteractiveLogo from "@/components/InteractiveLogo";
import PhoneMockup from "@/components/PhoneMockup";

export default function Hero() {
  return (
    <section className="relative w-full bg-coral overflow-hidden text-ink pt-16">

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">

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
            className="font-display font-semibold text-[clamp(44px,7vw,110px)] tracking-tight leading-[0.82] text-ink max-w-3xl animate-title-large"
          />
        </div>
        {/* Row 3 Right: Logo Monogram Console */}
        <div className="lg:col-span-7 border-b border-black/15 min-h-[350px] lg:h-[50vh] lg:min-h-[480px] max-lg:flex lg:grid lg:grid-cols-7 relative overflow-hidden items-center justify-center lg:gap-0 p-8 lg:p-0">
          <div className="hidden lg:flex lg:col-span-3 lg:border-r border-black/15 h-full items-center justify-center p-6">
            <PhoneMockup />
          </div>
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
