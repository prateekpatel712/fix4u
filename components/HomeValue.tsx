"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Minus, Zap, Clock, ShieldCheck } from "lucide-react";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function HomeValue() {
  const [open, setOpen] = useState<number>(0);

  const items = [
    {
      title: "Speed-to-lead",
      desc: "Every enquiry on WhatsApp, Instagram, and web chat gets an instant reply — in under 10 seconds — so you never lose a lead to whoever answers first.",
      link: "/ai-booking-agent",
      icon: <Zap className="w-10 h-10 text-ink/70" />,
    },
    {
      title: "Always on",
      desc: "Your AI receptionist books appointments through the night, on weekends, and over holidays — capturing revenue while your front desk is closed.",
      link: "/ai-booking-agent",
      icon: <Clock className="w-10 h-10 text-ink/70" />,
    },
    {
      title: "Fully managed",
      desc: "We build, train, host, and monitor the entire system. You receive booked appointments; we handle the infrastructure, tuning, and uptime.",
      link: "/about",
      icon: <ShieldCheck className="w-10 h-10 text-ink/70" />,
    },
  ];

  return (
    <section className="bg-paper text-ink border-y border-ink/10 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
        {/* Left: heading */}
        <div className="lg:col-span-5 lg:border-r border-ink/10 p-8 lg:p-16 flex flex-col justify-center gap-5">
          <span className="font-mono text-xs text-ink/50 tracking-widest uppercase font-semibold">
            The Value
          </span>
          <AnimatedTitle
            as="h2"
            scroll
            variant="wipe"
            wipeColor="bg-ink"
            lines={["Built to capture,", "qualify, and book", "every appointment"]}
            className="font-display font-medium text-[clamp(1.6rem,3.4vw,3.25rem)] text-ink tracking-tight leading-[1.05]"
          />
        </div>

        {/* Right: accordion */}
        <div className="lg:col-span-7 flex flex-col">
          {items.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={item.title} className="border-t border-ink/10">
                <button
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-6 px-8 lg:px-16 py-8 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-ink/60 group-hover:text-ink transition-colors">
                    {isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[560px]" : "max-h-0"
                  }`}
                >
                  <div className="px-8 lg:px-16 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col gap-8">
                      <p className="text-ink/65 text-base leading-relaxed">{item.desc}</p>
                      <Link
                        href={item.link}
                        className="learn__trigger flex items-stretch w-fit border border-ink/25 overflow-hidden select-none"
                      >
                        <span className="flex-1 flex items-center px-6 py-4 text-sm font-bold tracking-wide">
                          <span className="button__text">
                            <span className="button__text--sp button__text--sp--1">Learn more</span>
                            <span className="button__text--sp button__text--sp--2">Learn more</span>
                          </span>
                        </span>
                        <span className="learn__icon flex items-center justify-center px-5 border-l border-ink/25">
                          <span className="button__icon">
                            <span className="button__icon__inner button__icon__inner--1">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                            <span className="button__icon__inner button__icon__inner--2">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </span>
                        </span>
                      </Link>
                    </div>
                    <div className="aspect-[16/11] bg-ink/[0.04] border border-ink/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
