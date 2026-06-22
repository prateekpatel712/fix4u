/**
 * schema.org JSON-LD generators (PRD §2.12: Organization, Service, FAQ, Article).
 *
 * Each returns a plain object you embed in a page via:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
 * (Embedding is a frontend concern; these builders are the reusable data layer.)
 */

import { publicEnv } from "@/lib/env";
import type { CaseStudy, Faq, Post, Service, SiteSettings } from "@/lib/sanity/queries";

const SITE = publicEnv.siteUrl;

export function organizationSchema(settings?: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.title || "Fix4U",
    url: SITE,
    description:
      settings?.description ||
      "Fix4U builds custom AI agents that answer and book your leads 24/7 on WhatsApp, Instagram & web.",
    logo: `${SITE}/logo.png`,
    sameAs: (settings?.socials || []).map((s) => s.url),
    ...(settings?.contactEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            email: settings.contactEmail,
            contactType: "sales",
          },
        }
      : {}),
  };
}

export function websiteSchema(settings?: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.title || "Fix4U",
    url: SITE,
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary || service.outcome,
    url: `${SITE}/ai-booking-agent`,
    provider: { "@type": "Organization", name: "Fix4U", url: SITE },
    ...(service.priceNote ? { offers: { "@type": "Offer", description: service.priceNote } } : {}),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE}/insights/${post.slug}`,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "Fix4U" },
    publisher: { "@type": "Organization", name: "Fix4U", logo: { "@type": "ImageObject", url: `${SITE}/logo.png` } },
  };
}

/** Case studies render well as Article with a review/result angle. */
export function caseStudySchema(cs: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${cs.client} — case study`,
    description: cs.problem,
    url: `${SITE}/results/${cs.slug}`,
    datePublished: cs.publishedAt,
    author: { "@type": "Organization", name: "Fix4U" },
  };
}
