"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

export default function RoiCalculator() {
  const [leads, setLeads] = useState(250);
  const [value, setValue] = useState(500);
  const [lostRate, setLostRate] = useState(30);

  // Calculations
  const leadsLost = Math.round(leads * (lostRate / 100));
  const revenueLost = leadsLost * value;
  const recoveredLeads = Math.round(leadsLost * 0.9); // 90% recovery rate
  const revenueRecovered = recoveredLeads * value;
  const annualRecovered = revenueRecovered * 12;

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto border border-white/[0.05] rounded-[32px] bg-white/[0.01] backdrop-blur-2xl shadow-2xl overflow-hidden font-sans p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative z-10"
      style={{
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,255,255,0.01)"
      }}
    >
      {/* Left Column: Sliders */}
      <div className="flex flex-col justify-center gap-8 relative z-10">
        <div>
          <h3 className="font-display font-black text-2xl text-paper mb-2 uppercase tracking-wide">
            Calculate your leakage
          </h3>
          <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
            Specify your metrics below to estimate the annual revenue loss from delayed receptionist replies.
          </p>
        </div>

        {/* Sliders container */}
        <div className="flex flex-col gap-8">
          {/* Slider 1: Leads */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-grey font-semibold uppercase tracking-wider">Monthly Enquiries</span>
              <span className="text-coral font-bold font-mono text-sm">{leads} leads</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={leads}
              onChange={(e) => setLeads(Number(e.target.value))}
              className="w-full accent-coral bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-grey-dark font-mono uppercase tracking-wider opacity-60">
              <span>50</span>
              <span>1000</span>
            </div>
          </div>

          {/* Slider 2: Average Value */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-grey font-semibold uppercase tracking-wider">Average Ticket Value</span>
              <span className="text-coral font-bold font-mono text-sm">${value}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full accent-coral bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-grey-dark font-mono uppercase tracking-wider opacity-60">
              <span>$100</span>
              <span>$2000</span>
            </div>
          </div>

          {/* Slider 3: Lost Rate */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-grey font-semibold uppercase tracking-wider">Leads Lost to Delay</span>
              <span className="text-coral font-bold font-mono text-sm">{lostRate}% lost</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={lostRate}
              onChange={(e) => setLostRate(Number(e.target.value))}
              className="w-full accent-coral bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-grey-dark font-mono uppercase tracking-wider opacity-60">
              <span>10% (industry average)</span>
              <span>80% (busy / solo business)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: ROI Results */}
      <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/[0.05] pt-8 md:pt-0 md:pl-12 gap-8 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Current Leakage */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-500/[0.02] border border-red-500/10">
            <ShieldAlert className="w-5.5 h-5.5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-grey-dark uppercase tracking-widest font-mono font-bold block">
                Current Revenue Leak
              </span>
              <div className="text-2xl font-display font-black text-red-400 mt-1">
                ${formatNumber(revenueLost)}/mo
              </div>
              <p className="text-[11px] text-grey-dark mt-1 leading-relaxed">
                Estimated loss of <span className="text-red-400 font-semibold">{leadsLost} leads</span>/month to delays.
              </p>
            </div>
          </div>

          {/* Recovered Revenue */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 shadow-lg shadow-emerald/5">
            <Sparkles className="w-5.5 h-5.5 text-emerald shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-grey-dark uppercase tracking-widest font-mono font-bold block">
                Projected Recovery
              </span>
              <div className="text-3xl font-display font-black text-emerald mt-1">
                +${formatNumber(revenueRecovered)}/mo
              </div>
              <p className="text-[11px] text-grey-dark mt-1 leading-relaxed">
                By answering in seconds, AI recovers <span className="text-emerald font-semibold">{recoveredLeads} leads</span> that would have clicked next.
              </p>
            </div>
          </div>

          {/* Annual Savings */}
          <div className="flex items-center justify-between p-4.5 rounded-2xl border border-white/[0.05] bg-ink/40">
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="w-4 h-4 text-coral" />
              <span className="text-grey font-semibold uppercase tracking-wider">Annual savings</span>
            </div>
            <span className="font-display font-black text-xl text-paper">
              ${formatNumber(annualRecovered)}/yr
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/book"
          className="relative w-full inline-flex items-center justify-center gap-1.5 bg-coral text-ink font-sans text-xs font-bold uppercase tracking-wider py-4.5 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-center"
        >
          <span className="z-10 flex items-center gap-1">
            Recover this revenue <ArrowUpRight className="w-4 h-4" />
          </span>
          <div className="absolute inset-0 bg-paper translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
        </Link>
      </div>
    </div>
  );
}
