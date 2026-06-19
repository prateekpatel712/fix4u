"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Trophy } from "lucide-react";

export default function HomeCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const cases = [
    {
      slug: "sunrise-med-spa",
      title: "Sunrise Medical Spa Lead-Gen + Booking Agent Integration",
      metric: "+38% Bookings",
      metricSub: "within 30 days",
      category: "Med Spa",
      date: "June 2026",
      tag: "P112"
    },
    {
      slug: "apex-dental-care",
      title: "Apex Dental Care After-Hours Appointment Automations",
      metric: "42 Bookings/mo",
      metricSub: "fully automated",
      category: "Dental Clinic",
      date: "May 2026",
      tag: "P100"
    },
    {
      slug: "prime-aesthetics",
      title: "Prime Aesthetics Response Speed & No-Show Reduction",
      metric: "-50% No-Shows",
      metricSub: "via SMS alerts",
      category: "Wellness Clinic",
      date: "April 2026",
      tag: "P158"
    }
  ];

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setScrollProgress(progress);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <section className="py-24 border-b border-white/[0.05] bg-ink relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-violet/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
        <div className="space-y-3">
          <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
            METRIC PROOF
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-paper tracking-tight leading-[1.05]">
            Proven proof models
          </h2>
        </div>
        
        {/* Slider Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            className="p-3.5 border border-white/[0.08] bg-white/[0.02] rounded-full text-paper hover:border-coral hover:text-coral transition-colors duration-300 backdrop-blur-md cursor-pointer"
            title="Previous Case"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3.5 border border-white/[0.08] bg-white/[0.02] rounded-full text-paper hover:border-coral hover:text-coral transition-colors duration-300 backdrop-blur-md cursor-pointer"
            title="Next Case"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full overflow-x-auto flex gap-6 px-6 md:snap-x md:snap-mandatory pb-8 relative z-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Padding offset */}
        <div className="w-[1px] shrink-0" />

        {cases.map((cs, idx) => (
          <div 
            key={idx}
            className="w-[85vw] sm:w-[50vw] md:w-[35vw] shrink-0 border border-white/[0.05] rounded-[32px] bg-white/[0.02] backdrop-blur-2xl overflow-hidden flex flex-col justify-between p-6 md:p-8 snap-start snap-always group hover:border-coral/30 transition-all duration-500 shadow-2xl min-h-[380px]"
            style={{
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255,255,255,0.01)"
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-grey-dark uppercase font-bold">
                <span>{cs.category}</span>
                <span className="border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 rounded text-paper font-semibold">{cs.tag}</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-black text-xl md:text-2xl text-paper leading-tight group-hover:text-coral transition-colors duration-300 uppercase">
                  <Link href={`/results/${cs.slug}`}>
                    {cs.title}
                  </Link>
                </h3>
              </div>
            </div>

            {/* Results metrics */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="bg-coral/5 border border-coral/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-grey-dark uppercase tracking-wider font-mono opacity-80">Pilot Result</span>
                  <div className="text-2xl font-display font-black text-coral mt-0.5">{cs.metric}</div>
                </div>
                <span className="text-[9px] text-grey-dark text-right font-sans leading-tight opacity-80">
                  {cs.metricSub}
                </span>
              </div>

              <Link
                href={`/results/${cs.slug}`}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-paper group-hover:text-coral transition-colors font-mono uppercase tracking-widest"
              >
                View breakdown <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
