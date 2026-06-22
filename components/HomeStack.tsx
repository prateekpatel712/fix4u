"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Check, Laptop, Search } from "lucide-react";

// Height (px) of the collapsed pinned strip — number + label + image sliver.
const HEADER = 72;
// Offset (px) below the fixed site header where the strips start stacking.
const BASE = 84;

export default function HomeStack() {
  const stackItems = [
    {
      num: "01",
      subtitle: "Primary Funnel Receptionist",
      title: "AI Booking Agent",
      desc: "Custom-trained chatbot receptionists operating on WhatsApp, Instagram DMs, and Web Chat. They reply instantly, answer treatment FAQs, filter out tyre-kickers, and book slots directly in your calendar.",
      features: [
        "Instant replies in under 30 seconds, 24/7",
        "Trained on your exact services, pricing & FAQs",
        "Qualifies leads and filters out time-wasters",
        "Books confirmed slots straight into your calendar",
      ],
      icon: <Bot className="w-10 h-10 text-ink/80" />,
      image: "/ai-booking-agent.jpg",
      link: "/ai-booking-agent",
    },
    {
      num: "02",
      subtitle: "Speed-tuned Lead Capture",
      title: "Conversion Website",
      desc: "Super-fast, custom-coded landing pages designed to capture local search and ad traffic. Optimized to run at 100/100 Lighthouse performance scores and direct leads immediately into the chat receptionist.",
      features: [
        "Custom-coded for 100/100 Lighthouse performance",
        "Loads in under a second on every device",
        "Engineered to rank for local ‘near me’ searches",
        "Channels every visitor into the chat receptionist",
      ],
      icon: <Laptop className="w-10 h-10 text-ink/80" />,
      image: "/conversion-website.jpg",
      link: "/book",
    },
    {
      num: "03",
      subtitle: "High-Intent Pipeline Fuel",
      title: "Targeted Acquisition",
      desc: "Local search SEO configurations and paid ad setups (Instagram/Facebook/Google Ads) tuned to generate qualified leads that feed directly into your WhatsApp and web chatbot funnels.",
      features: [
        "Local SEO that puts you on the map for nearby searches",
        "Paid campaigns across Instagram, Facebook & Google",
        "Tuned to attract high-intent, ready-to-book leads",
        "Feeds qualified traffic straight into your funnels",
      ],
      icon: <Search className="w-10 h-10 text-ink/80" />,
      image: "/targeted-acquisition-v3.jpg",
      link: "/book",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-paper text-ink border-y border-ink/10 w-full">
      {/* Heading band — scrolls away normally */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:border-r border-ink/10 p-8 lg:p-16 space-y-4">
          <span className="font-mono text-xs text-ink/50 tracking-widest uppercase font-semibold">
            Acquisition Pillars
          </span>
          <h2 className="font-display font-medium text-[clamp(2rem,4vw,3.5rem)] text-ink tracking-tight leading-[1.05] max-w-xl">
            Integrated funnel technology for local service businesses
          </h2>
        </div>
        <div className="hidden lg:block lg:col-span-5" />
      </div>

      {/* Sticky stacking list */}
      <div>
        {stackItems.map((item, idx) => (
          <article
            key={item.num}
            className="md:sticky bg-paper border-t border-ink/10"
            style={{ top: `${BASE + idx * HEADER}px` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch lg:min-h-[78vh]">
              {/* Number */}
              <div className="md:col-span-2 lg:col-span-1 md:border-r border-ink/10 px-6 pt-6 pb-3 md:pb-6">
                <span className="font-mono text-sm text-ink/80">
                  {item.num} <span className="text-ink/30">/</span>
                </span>
              </div>

              {/* Visual panel */}
              <div className="md:col-span-4 md:border-r border-ink/10 relative bg-ink/[0.03] min-h-[220px] flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                ) : (
                  item.icon
                )}
              </div>

              {/* Text */}
              <div className="md:col-span-6 lg:col-span-7 px-6 pt-6 pb-10 md:px-10 lg:px-14 flex flex-col">
                <h3 className="font-display font-medium text-2xl md:text-3xl text-ink tracking-tight leading-[1.1]">
                  {item.title}
                </h3>
                <p className="text-ink/70 text-lg md:text-xl leading-relaxed mt-8 max-w-none">
                  {item.desc}
                </p>

                {/* Benefit list — fills the card body and reinforces the pitch */}
                <ul className="mt-10 border-t border-ink/10">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-4 border-b border-ink/10 py-4 md:py-5"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-coral/15 shrink-0">
                        <Check className="w-4 h-4 text-coral" />
                      </span>
                      <span className="text-ink/75 text-base md:text-lg leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
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
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
