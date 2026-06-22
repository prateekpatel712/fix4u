import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import ScrollProvider from "@/components/ScrollProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fix4U — custom AI WhatsApp & Instagram booking agents",
    template: "%s | Fix4U",
  },
  description: "Fix4U builds custom AI agents that answer and book your leads 24/7 on WhatsApp, Instagram & web. Built and hosted for you. Book a free call.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fix4u.in"),
  openGraph: {
    title: "Fix4U — custom AI WhatsApp & Instagram booking agents",
    description: "Next-Gen Front Desk. Custom AI agents that qualify and book appointments 24/7.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fix4U — custom AI WhatsApp & Instagram booking agents",
    description: "Next-Gen Front Desk. Custom AI agents that qualify and book appointments 24/7.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070709",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper selection:bg-coral selection:text-ink">
        <ScrollProvider>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
