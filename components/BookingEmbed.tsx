"use client";

import { useMemo, useState } from "react";
import {
  Calendar as CalIcon,
  Clock,
  Globe,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingEmbed() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const timezone = "India Standard Time (GMT+5:30)";

  const [step, setStep] = useState(1);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    niche: "Med Spa",
    leak: "Slow response to DMs / website queries after-hours",
  });

  // --- calendar grid ---
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  const isPast = (d: Date) => d.getTime() < today.getTime();
  const isSelectable = (d: Date) => !isPast(d) && !isWeekend(d);
  const sameDay = (a: Date | null, b: Date | null) =>
    !!a && !!b && a.getTime() === b.getTime();

  const atCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const prevMonth = () => {
    if (atCurrentMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  // Same slots every day: 8:30 AM → 10:30 PM, every 1h30m.
  const TIME_SLOTS = useMemo(() => {
    const slots: string[] = [];
    for (let m = 8 * 60 + 30; m <= 22 * 60 + 30; m += 90) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      slots.push(`${h12}:${min.toString().padStart(2, "0")} ${ampm}`);
    }
    return slots;
  }, []);
  const activeSlots = selectedDate ? TIME_SLOTS : [];
  const fmtDate = (d: Date) => `${DAY_SHORT[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.business) setStep(3);
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto border border-white/[0.06] rounded-3xl bg-white/[0.01] backdrop-blur-2xl shadow-2xl overflow-hidden font-sans relative z-10"
      style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,255,255,0.01)" }}
    >
      {/* Top banner */}
      <div className="bg-white/[0.015] px-6 py-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-grey-dark">
        <div className="flex items-center gap-2">
          <CalIcon className="w-4 h-4 text-coral" />
          <span className="font-semibold text-paper uppercase tracking-wider">Discovery Walkthrough</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-coral" />
          <span className="font-semibold text-paper">15 MINS &bull; GOOGLE MEET</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
          <Globe className="w-4 h-4 text-coral" />
          <span>{timezone}</span>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-xs text-paper uppercase tracking-widest opacity-60">
                  1. Select a date
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevMonth}
                    disabled={atCurrentMonth}
                    aria-label="Previous month"
                    className={`p-1.5 rounded-lg border border-white/[0.06] transition-colors ${
                      atCurrentMonth
                        ? "text-grey-dark/30 cursor-not-allowed"
                        : "text-paper hover:border-coral hover:text-coral cursor-pointer"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-paper w-[92px] text-center">
                    {MONTHS[viewMonth].slice(0, 3)} {viewYear}
                  </span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    aria-label="Next month"
                    className="p-1.5 rounded-lg border border-white/[0.06] text-paper hover:border-coral hover:text-coral transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1.5">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="text-center text-[9px] font-mono uppercase tracking-wider text-grey-dark/70">
                    {w}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((d, i) =>
                  d === null ? (
                    <div key={i} />
                  ) : (
                    <button
                      key={i}
                      type="button"
                      disabled={!isSelectable(d)}
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedTime("");
                      }}
                      className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-colors ${
                        sameDay(d, selectedDate)
                          ? "bg-coral text-ink font-bold shadow-lg shadow-coral/20"
                          : !isSelectable(d)
                          ? "text-grey-dark/25 cursor-not-allowed"
                          : "text-paper hover:bg-white/[0.06] cursor-pointer"
                      } ${
                        sameDay(d, today) && !sameDay(d, selectedDate)
                          ? "ring-1 ring-inset ring-coral/50"
                          : ""
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Time slots */}
            <div className="flex flex-col">
              <h4 className="font-display font-bold text-xs text-paper mb-4 uppercase tracking-widest opacity-60">
                2. Select a time
                {selectedDate && (
                  <span className="ml-2 text-coral normal-case tracking-normal font-mono opacity-90">
                    {fmtDate(selectedDate)}
                  </span>
                )}
              </h4>

              {selectedDate ? (
                <div className="flex-grow flex flex-col justify-between gap-6">
                  <div className="grid grid-cols-2 gap-2.5">
                    {activeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-3.5 px-2 border rounded-xl font-mono text-[11px] text-center transition-all duration-300 cursor-pointer ${
                          selectedTime === slot
                            ? "bg-coral text-ink border-coral font-bold shadow-lg shadow-coral/10"
                            : "bg-ink/50 hover:border-coral/40 border-white/[0.06] text-paper"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={!selectedTime}
                    onClick={() => setStep(2)}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                      selectedTime
                        ? "bg-coral text-ink hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        : "bg-white/[0.01] border border-white/[0.06] text-grey-dark cursor-not-allowed"
                    }`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center p-8 text-center text-grey-dark text-xs min-h-[220px]">
                  <CalIcon className="w-8 h-8 text-white/10 mb-3" />
                  Pick a date on the calendar to see open slots in your timezone.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-5">
            <h3 className="font-display font-black text-xl text-paper uppercase tracking-wide">
              Confirm your booking details
            </h3>
            <p className="text-grey-dark text-xs border-b border-white/[0.06] pb-4 mb-2">
              Your slot:{" "}
              <span className="text-coral font-bold">
                {selectedDate && fmtDate(selectedDate)} at {selectedTime}
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Maya Lin"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.06] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="maya@yourbusiness.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.06] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">Business Name</label>
                <input
                  type="text"
                  name="business"
                  required
                  placeholder="Aura Medical Spa"
                  value={formData.business}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.06] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">Your Niche / Industry</label>
                <select
                  name="niche"
                  value={formData.niche}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.06] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors cursor-pointer"
                >
                  <option value="Med Spa">Med Spa / Aesthetics</option>
                  <option value="Dental Clinic">Dental / Health Clinic</option>
                  <option value="Salon / Wellness">Salon / Wellness Center</option>
                  <option value="Gym / Coaching">Gym / Personal Coaching</option>
                  <option value="Other Service">Other Local Service</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">
                What is the #1 leak in your funnel right now?
              </label>
              <textarea
                name="leak"
                rows={3}
                placeholder="e.g., losing leads who message us after hours on Instagram"
                value={formData.leak}
                onChange={handleInputChange}
                className="bg-ink border border-white/[0.06] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors resize-none"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 border border-white/[0.08] rounded-xl text-paper text-xs uppercase tracking-wider hover:bg-white/[0.02] transition-colors font-bold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Calendar
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-coral text-ink rounded-xl text-xs uppercase tracking-wider font-bold hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                Schedule Call
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center flex flex-col items-center py-8 gap-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-2xl text-paper uppercase tracking-wide">
              Meeting Confirmed! 🎉
            </h3>
            <p className="text-grey-dark text-xs sm:text-sm leading-relaxed">
              Hey <span className="text-paper font-semibold">{formData.name}</span>, your slot for a 15-minute discovery call has been secured for:
            </p>
            <div className="w-full bg-white/[0.01] border border-white/[0.06] rounded-2xl py-5 px-6 flex flex-col gap-1 text-center font-mono">
              <span className="text-coral font-bold text-base">{selectedDate && fmtDate(selectedDate)}</span>
              <span className="text-paper text-sm">{selectedTime}</span>
              <span className="text-grey-dark text-[9px] uppercase tracking-wider mt-1.5">{timezone}</span>
            </div>
            <div className="text-xs text-grey-dark leading-relaxed mt-2 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-coral shrink-0" />
              Calendar invite sent to <span className="text-paper font-semibold">{formData.email}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setSelectedDate(null);
                setSelectedTime("");
              }}
              className="mt-6 text-[10px] text-grey hover:text-coral transition-colors font-mono uppercase tracking-widest underline cursor-pointer"
            >
              Book another call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
