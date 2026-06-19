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

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <article className="max-w-3xl mx-auto border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-2xl space-y-6 text-grey-dark text-sm sm:text-base leading-relaxed">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-paper tracking-tight mb-8 border-b border-white/[0.05] pb-4 uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono">Last updated: June 18, 2026</p>
          
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
      </main>

      <Footer />
    </div>
  );
}
