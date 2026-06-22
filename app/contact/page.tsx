"use client";

import { useState } from "react";
import { MessageCircle, Send, CheckCircle, Mail } from "lucide-react";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/AnimatedTitle";
import Turnstile from "@/components/Turnstile";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken: token, company: "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again or message us on WhatsApp.");
      }
    } catch {
      setError("Network error. Please try again or message us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-coral/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <HomeNav />

      <main className="flex-grow font-sans relative z-10 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
          {/* Left Column: Contact details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col gap-6 justify-center"
          >
            <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">GET IN TOUCH</span>
            <AnimatedTitle
              lines={[
                <span key="1">Let&apos;s build</span>,
                <span key="2" className="text-coral italic">together</span>
              ]}
              className="font-display font-black text-3xl sm:text-4xl text-paper leading-[1.1]"
            />
            <p className="text-grey-dark text-xs sm:text-sm leading-relaxed max-w-md">
              Have questions about pricing, security integrations, or custom training protocols? Drop us a line. We reply within one business day.
            </p>

            <div className="flex flex-col gap-4 border-t border-white/[0.05] pt-6 mt-2 text-xs font-mono">
              {/* WhatsApp Option */}
              <div className="flex flex-col gap-1">
                <span className="text-grey-dark uppercase tracking-wider">Fastest reply:</span>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-paper hover:text-coral transition-colors font-bold mt-1"
                >
                  <MessageCircle className="w-5 h-5 text-coral shrink-0" /> Chat on WhatsApp
                </a>
              </div>

              {/* Email Option */}
              <div className="flex flex-col gap-1 mt-4">
                <span className="text-grey-dark uppercase tracking-wider">Direct Email:</span>
                <a
                  href="mailto:prateek@fix4u.in"
                  className="flex items-center gap-1.5 text-paper hover:text-coral transition-colors font-bold mt-1"
                >
                  <Mail className="w-5 h-5 text-coral shrink-0" /> prateek@fix4u.in
                </a>
              </div>
            </div>

            {/* Reassurance */}
            <div className="bg-coral/5 border border-coral/10 rounded-[20px] p-5 text-xs text-grey-dark leading-relaxed backdrop-blur-md max-w-md">
              &ldquo;We reply within one business day (usually much faster—you can also ask our AI chatbot demo on the home page).&rdquo;
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-7 w-full p-8 lg:p-16 flex flex-col justify-center bg-white/[0.005]"
          >
            <div className="w-full border border-white/[0.05] rounded-[32px] bg-white/[0.01] backdrop-blur-2xl p-6 md:p-8 shadow-2xl hover:border-coral/25 transition-colors duration-500">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-paper uppercase tracking-wide">
                  Message Sent! 🎉
                </h3>
                <p className="text-grey-dark text-xs sm:text-sm leading-relaxed max-w-sm">
                  Thank you for reaching out, <span className="text-paper font-semibold">{formData.name}</span>. I have received your message and will get back to you via <span className="text-paper">{formData.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", business: "", message: "" });
                  }}
                  className="mt-6 text-xs text-grey hover:text-coral transition-colors font-mono underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-display font-bold text-lg text-paper uppercase tracking-wide">
                  Send a direct message
                </h3>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-grey uppercase tracking-wider font-mono">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Maya Lin"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/[0.01] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/50 transition-all duration-300 placeholder:text-grey-dark/50"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-grey uppercase tracking-wider font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="maya@yourbusiness.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/[0.01] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/50 transition-all duration-300 placeholder:text-grey-dark/50"
                  />
                </div>

                {/* Business Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-grey uppercase tracking-wider font-mono">
                    Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="business"
                    placeholder="Aura Medical Spa"
                    value={formData.business}
                    onChange={handleInputChange}
                    className="bg-white/[0.01] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/50 transition-all duration-300 placeholder:text-grey-dark/50"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-grey uppercase tracking-wider font-mono">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your services and what integrations you are looking for..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-white/[0.01] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/50 transition-all duration-300 placeholder:text-grey-dark/50 resize-none"
                  />
                </div>

                <Turnstile onToken={setToken} />

                {error && (
                  <p className="text-red-400 text-xs leading-relaxed -mt-1">{error}</p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-coral text-ink rounded-xl font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-lg shadow-coral/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? "Sending…" : <>Send Message <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
