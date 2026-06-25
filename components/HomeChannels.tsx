import { MessageCircle, Camera, Globe } from "lucide-react";

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp Chatbot",
    desc: "Replies to every WhatsApp enquiry in seconds and books the slot — even after hours, while you sleep.",
  },
  {
    icon: Camera,
    title: "Instagram Chatbot",
    desc: "Answers Instagram DMs and story replies instantly, turning your followers into booked appointments.",
  },
  {
    icon: Globe,
    title: "Website Chatbot",
    desc: "Greets visitors on your site, answers their questions, and captures the lead before they bounce.",
  },
];

/** "Every channel" service section — the same AI agent deployed on WhatsApp, Instagram, and web chat. */
export default function HomeChannels() {
  return (
    <section className="border-b border-white/10 bg-ink relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full relative z-10">
        <div className="lg:col-span-5 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col justify-center gap-4">
          <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">
            Every channel
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-paper tracking-tight leading-[1.05] uppercase">
            One AI agent, wherever your leads are
          </h2>
          <p className="text-grey-dark text-sm leading-relaxed max-w-md">
            One brain, deployed across the channels your customers already use — instant replies, smart qualifying,
            and bookings, 24/7.
          </p>
        </div>

        <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col gap-4 bg-white/[0.005]">
          {channels.map((c) => (
            <div
              key={c.title}
              className="flex items-start gap-4 border border-white/[0.06] rounded-2xl p-5 bg-white/[0.01] hover:border-coral/30 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center shrink-0">
                <c.icon className="w-5 h-5 text-coral" />
              </span>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-paper">{c.title}</h3>
                <p className="text-grey-dark text-xs sm:text-sm leading-relaxed mt-1">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
