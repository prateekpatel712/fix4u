import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomeCta() {
  return (
    <section className="bg-ink text-paper border-b border-white/10 relative w-full overflow-hidden">
      {/* Coral render accent (right side) */}
      <div className="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none" aria-hidden>
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-coral/25 blur-[130px] rounded-full" />
        <div className="absolute right-24 top-1/2 -translate-y-1/2 w-72 h-72 bg-coral/70 rotate-45 skew-y-12 blur-2xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 py-24 lg:py-40 flex flex-col gap-10">
        <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight max-w-4xl">
          Turn every enquiry into a booked appointment
        </h2>
        <Link
          href="/book"
          className="group inline-flex items-stretch w-fit border border-white/30 hover:border-white overflow-hidden transition-colors"
        >
          <span className="px-7 py-4 text-sm font-bold tracking-wide">Contact</span>
          <span className="flex items-center px-5 border-l border-white/30 group-hover:bg-coral group-hover:border-coral group-hover:text-ink transition-colors">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  );
}
