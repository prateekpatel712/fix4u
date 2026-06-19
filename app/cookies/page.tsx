import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-ink relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-coral/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="flex-grow font-sans py-28 px-6 relative z-10">
        <article className="max-w-7xl mx-auto border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-2xl space-y-6 text-grey-dark text-sm sm:text-base leading-relaxed">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-paper tracking-tight mb-8 border-b border-white/[0.05] pb-4 uppercase">
            Cookie Policy
          </h1>
          <p className="text-xs font-mono">Last updated: June 18, 2026</p>
          
          <p>
            This Cookie Policy explains how Fix4U uses cookies and similar tracking technologies to identify your device when you visit our website.
          </p>

          <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">1. What are Cookies?</h2>
          <p>
            Cookies are small text files stored on your browser or device when you visit a webpage. They help the website remember your actions, identify session states, and understand user traffic patterns.
          </p>

          <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">2. Cookies We Use</h2>
          <p>
            We use two categories of cookies on this marketing site:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Required to run core platform functions, such as remembering your calendar selection slots and managing session details for forms. These cannot be disabled.
            </li>
            <li>
              <strong>Analytics & Performance Cookies:</strong> Gather anonymous usage statistics, such as page visit frequency, heatmap interactions, and conversion clicks (Google Analytics 4 and Microsoft Clarity). These are only loaded after you give consent.
            </li>
          </ul>

          <h2 className="font-display font-bold text-lg text-paper mt-8 uppercase tracking-wide">3. Managing Your Choices</h2>
          <p>
            You can modify or reset your cookie preferences at any time by clearing your browser cache or updating the settings inside your browser dashboard. Restricting essential cookies may disrupt form inputs or booking calendars.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
