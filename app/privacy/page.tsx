import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-coral/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
          {/* Left Column: Title and Metadata */}
          <div className="lg:col-span-5 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col justify-start space-y-4">
            <span className="font-mono text-xs text-coral tracking-widest uppercase font-semibold">LEGAL DOCUMENT</span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-paper tracking-tight uppercase">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-grey-dark">Last updated: June 18, 2026</p>
          </div>

          {/* Right Column: Policy Body */}
          <article className="lg:col-span-7 p-8 lg:p-16 bg-white/[0.005] space-y-6 text-grey-dark text-sm sm:text-base leading-relaxed">
            <p>
              At Fix4U, we value your privacy. This policy details how we handle the personal information collected when you visit our website, submit queries through our contact forms, book discovery calls, or chat with our demonstration AI bots.
            </p>

            <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">1. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when scheduling appointments or submitting enquiries:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity & Contact Details:</strong> Name, business name, email address, phone number, and niche.</li>
              <li><strong>Enquiry Details:</strong> Project requirements, CRM fields, and questions you ask our AI chat simulator.</li>
              <li><strong>Usage Metadata:</strong> IP address, device specs, browser types, and cookie preferences.</li>
            </ul>

            <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">2. How We Use Your Information</h2>
            <p>
              We process your information to fulfill scheduling requests and improve our services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To manage and sync appointment bookings via our calendar software (Cal.com).</li>
              <li>To answer queries submitted through website forms or direct email (processed via Resend).</li>
              <li>To record conversion events for traffic analysis (Google Analytics 4 and Microsoft Clarity).</li>
            </ul>

            <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">3. Data Sharing & Security</h2>
            <p>
              We do not sell, rent, or lease your personal information to third parties. Data is only shared with trusted sub-processors necessary to run the service (calendar managers, transactional email APIs, and secure CRM pipelines). All form data is encrypted in transit using standard secure protocols.
            </p>

            <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">4. Your Data Rights</h2>
            <p>
              Depending on your location (such as the UK or European Union GDPR zones), you have the right to request access to, correction of, or deletion of your personal records. To initiate a request, please contact us at <a href="mailto:prateek@fix4u.in" className="text-coral underline">prateek@fix4u.in</a>.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
