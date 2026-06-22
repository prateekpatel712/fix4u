/**
 * GROQ queries + typed fetchers for the Fix4U content model (Tech Spec §4).
 *
 * These power the (frontend) pages and, importantly here, the SEO routes (sitemap), the chatbot's
 * FAQ grounding, and any server logic that needs CMS content. All fetchers fall back to safe
 * empty values so the backend works before any content is authored.
 */

import { sanityFetch } from "@/lib/sanity/client";

/* --------------------------------- Types --------------------------------- */

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: { asset?: { url?: string } };
}

export interface SiteSettings {
  title?: string;
  tagline?: string;
  description?: string;
  whatsappNumber?: string;
  contactEmail?: string;
  socials?: { platform: string; url: string }[];
  defaultSeo?: Seo;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  outcome?: string;
  features?: string[];
  deliverables?: string[];
  priceNote?: string;
  isPrimary?: boolean;
  seo?: Seo;
}

export interface CaseStudy {
  _id: string;
  client: string;
  niche?: string;
  slug: string;
  problem?: string;
  solution?: string;
  metrics?: { label: string; value: string }[];
  quote?: string;
  author?: string;
  publishedAt?: string;
  seo?: Seo;
}

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  business?: string;
  rating?: number;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  seo?: Seo;
}

/* -------------------------------- Queries -------------------------------- */

const SEO_PROJECTION = `seo{ title, description, ogImage{ asset->{ url } } }`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  title, tagline, description, whatsappNumber, contactEmail,
  socials[]{ platform, url },
  defaultSeo{ title, description, ogImage{ asset->{ url } } }
}`;

export const servicesQuery = `*[_type == "service"] | order(isPrimary desc, title asc){
  _id, title, "slug": slug.current, summary, outcome, features, deliverables, priceNote, isPrimary, ${SEO_PROJECTION}
}`;

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(publishedAt desc){
  _id, client, niche, "slug": slug.current, problem, solution,
  metrics[]{ label, value }, quote, author, publishedAt, ${SEO_PROJECTION}
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc){
  _id, quote, name, business, rating
}`;

export const faqsQuery = `*[_type == "faq"] | order(category asc){
  _id, question, answer, category
}`;

export const postsQuery = `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, publishedAt, ${SEO_PROJECTION}
}`;

/* -------------------------------- Fetchers ------------------------------- */

export const getSiteSettings = () =>
  sanityFetch<SiteSettings | null>(siteSettingsQuery, {}, null);

export const getServices = () => sanityFetch<Service[]>(servicesQuery, {}, []);

export const getCaseStudies = () => sanityFetch<CaseStudy[]>(caseStudiesQuery, {}, []);

export const getTestimonials = () => sanityFetch<Testimonial[]>(testimonialsQuery, {}, []);

export const getFaqs = () => sanityFetch<Faq[]>(faqsQuery, {}, []);

export const getPosts = () => sanityFetch<Post[]>(postsQuery, {}, []);

/** Slug lists for sitemap generation. */
export const getCaseStudySlugs = () =>
  sanityFetch<{ slug: string; publishedAt?: string }[]>(
    `*[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current, publishedAt }`,
    {},
    [],
  );

export const getPostSlugs = () =>
  sanityFetch<{ slug: string; publishedAt?: string }[]>(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt)]{ "slug": slug.current, publishedAt }`,
    {},
    [],
  );
