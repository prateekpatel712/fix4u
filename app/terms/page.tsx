import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-coral/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <article className="max-w-3xl mx-auto border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-2xl space-y-6 text-grey-dark text-sm sm:text-base leading-relaxed">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-paper tracking-tight mb-8 border-b border-white/[0.05] pb-4 uppercase">
            Terms of Service
          </h1>
          <p className="text-xs font-mono">Last updated: June 18, 2026</p>
          
          <p>
            Welcome to Fix4U. By accessing this marketing website, booking consultations, or utilizing our custom prototype software tools, you agree to comply with the terms detailed below.
          </p>

          <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">1. Acceptable Use</h2>
          <p>
            You agree to use this website only for legitimate business discovery calls and mock assistant testing. You must not submit spam form requests, trigger API flood scripts, or attempt to crawl the server endpoints without permission.
          </p>

          <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">2. Intellectual Property</h2>
          <p>
            All custom codebase frameworks, design mockups, SVG graphics, and training instructions displayed on this platform are owned by Fix4U. They are protected under global copyright and proprietary trademark policies.
          </p>

          <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">3. Limitation of Liability</h2>
          <p>
            This marketing website and our simulated chatbot demonstration widgets are provided &ldquo;as is&rdquo; without warranties of any kind. Fix4U will not be liable for any indirect, incidental, or consequential damages arising from the use of or inability to use our prototype services.
          </p>

          <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">4. Modifications</h2>
          <p>
            We reserve the right to modify these terms or retire service lines at any time. Continued navigation of our platform represents your acknowledgement of updated guidelines.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
