"use client";

import { useState } from "react";
import { Calendar, Clock, Globe, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export default function BookingEmbed() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timezone, setTimezone] = useState("India Standard Time (GMT+5:30)");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    niche: "Med Spa",
    leak: "Slow response to DMs / website queries after-hours",
  });

  const availableDates = [
    { day: "Mon", date: "June 22", slots: ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"] },
    { day: "Tue", date: "June 23", slots: ["9:30 AM", "11:00 AM", "1:30 PM", "3:00 PM", "4:30 PM"] },
    { day: "Wed", date: "June 24", slots: ["10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"] },
    { day: "Thu", date: "June 25", slots: ["9:00 AM", "11:30 AM", "1:30 PM", "3:30 PM", "5:00 PM"] },
    { day: "Fri", date: "June 26", slots: ["10:00 AM", "1:00 PM", "2:30 PM", "4:00 PM"] },
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.business) {
      setStep(3);
    }
  };

  const activeSlots = availableDates.find((d) => d.date === selectedDate)?.slots || [];

  return (
    <div 
      className="w-full max-w-3xl mx-auto border border-white/[0.05] rounded-[32px] bg-white/[0.01] backdrop-blur-2xl shadow-2xl overflow-hidden font-sans relative z-10"
      style={{
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,255,255,0.01)"
      }}
    >
      {/* Top Banner */}
      <div className="bg-white/[0.01] px-6 py-5 border-b border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-grey-dark">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-coral" />
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

      {/* Scheduler Steps */}
      <div className="p-6 md:p-10">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Days Column */}
            <div>
              <h4 className="font-display font-bold text-xs text-paper mb-4 uppercase tracking-widest opacity-60">
                1. Select a Date
              </h4>
              <div className="flex flex-col gap-3">
                {availableDates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => handleDateSelect(d.date)}
                    className={`flex items-center justify-between px-5 py-4 border rounded-2xl transition-all duration-300 snap-center cursor-pointer ${
                      selectedDate === d.date
                        ? "bg-coral text-ink border-coral font-bold shadow-lg shadow-coral/10"
                        : "bg-ink/50 hover:bg-white/[0.02] border-white/[0.05] text-paper"
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] uppercase font-mono tracking-widest opacity-70">
                        {d.day}
                      </span>
                      <span className="text-sm font-display font-bold mt-0.5">{d.date}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80 uppercase tracking-wider">
                      {d.slots.length} open
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots Column */}
            <div className="flex flex-col">
              <h4 className="font-display font-bold text-xs text-paper mb-4 uppercase tracking-widest opacity-60">
                2. Select a Time
              </h4>
              {selectedDate ? (
                <div className="flex-grow flex flex-col justify-between gap-6">
                  <div className="grid grid-cols-2 gap-2.5">
                    {activeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-3.5 px-2 border rounded-xl font-mono text-[11px] text-center transition-all duration-300 cursor-pointer ${
                          selectedTime === slot
                            ? "bg-coral text-ink border-coral font-bold shadow-lg shadow-coral/10"
                            : "bg-ink/50 hover:border-coral/40 border-white/[0.05] text-paper"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {/* Next Step Button */}
                  <button
                    disabled={!selectedTime}
                    onClick={() => setStep(2)}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                      selectedTime
                        ? "bg-coral text-ink hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        : "bg-white/[0.01] border border-white/[0.05] text-grey-dark cursor-not-allowed"
                    }`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 border border-dashed border-white/[0.05] rounded-2xl flex flex-col items-center justify-center p-8 text-center text-grey-dark text-xs min-h-[200px]">
                  <Calendar className="w-8 h-8 text-white/5 mb-3 animate-pulse" />
                  Select a date on the left to see available slots in your timezone.
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
            <p className="text-grey-dark text-xs border-b border-white/[0.05] pb-4 mb-2">
              Timezone slot: <span className="text-coral font-bold">{selectedDate} at {selectedTime}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Maya Lin"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.05] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="maya@clinicname.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.05] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Business Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">
                  Business Name
                </label>
                <input
                  type="text"
                  name="business"
                  required
                  placeholder="Aura Medical Spa"
                  value={formData.business}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.05] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors"
                />
              </div>

              {/* Niche */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-grey uppercase tracking-widest font-mono font-bold">
                  Your Niche / Industry
                </label>
                <select
                  name="niche"
                  value={formData.niche}
                  onChange={handleInputChange}
                  className="bg-ink border border-white/[0.05] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors cursor-pointer"
                >
                  <option value="Med Spa">Med Spa / Aesthetics</option>
                  <option value="Dental Clinic">Dental / Health Clinic</option>
                  <option value="Salon / Wellness">Salon / Wellness Center</option>
                  <option value="Gym / Coaching">Gym / Personal Coaching</option>
                  <option value="Other Service">Other Local Service</option>
                </select>
              </div>
            </div>

            {/* Funnel Leak Description */}
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
                className="bg-ink border border-white/[0.05] rounded-xl px-4 py-3.5 text-xs sm:text-sm text-paper focus:outline-none focus:border-coral transition-colors resize-none"
              />
            </div>

            {/* Form CTAs */}
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 border border-white/[0.08] rounded-xl text-paper text-xs uppercase tracking-wider hover:bg-white/[0.02] transition-colors font-bold cursor-pointer"
              >
                Back to Calendar
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
            <div className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl py-5 px-6 flex flex-col gap-1 text-center font-mono">
              <span className="text-coral font-bold text-base">{selectedDate}</span>
              <span className="text-paper text-sm">{selectedTime}</span>
              <span className="text-grey-dark text-[9px] uppercase tracking-wider mt-1.5">{timezone}</span>
            </div>
            <div className="text-xs text-grey-dark leading-relaxed mt-2 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-coral shrink-0" />
              Calendar invite sent to <span className="text-paper font-semibold">{formData.email}</span>
            </div>
            <button
              onClick={() => {
                setStep(1);
                setSelectedDate("");
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
