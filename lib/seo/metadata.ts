/**
 * Next.js Metadata helpers (PRD §2.12: per-page title/meta/OG, canonical URLs).
 *
 * `buildMetadata()` is the one place pages call to get consistent titles, descriptions,
 * canonical URLs, Open Graph and Twitter cards. Frontend pages import this; it lives in lib
 * because it's pure config, not UI.
 */

import type { Metadata } from "next";
import { publicEnv } from "@/lib/env";

const SITE = publicEnv.siteUrl;

export const SITE_NAME = "Fix4U";
export const DEFAULT_TITLE = "Fix4U — AI agents that answer & book your leads 24/7";
export const DEFAULT_DESCRIPTION =
  "Fix4U builds custom AI agents that answer and book your leads 24/7 on WhatsApp, Instagram & web. Built and hosted for you. Book a free call.";
export const DEFAULT_OG_IMAGE = `${SITE}/og-default.png`;

export interface PageMetaInput {
  title?: string;
  description?: string;
  /** Path beginning with "/", e.g. "/ai-booking-agent". */
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function buildMetadata(input: PageMetaInput = {}): Metadata {
  const title = input.title ? `${input.title} · ${SITE_NAME}` : DEFAULT_TITLE;
  const description = input.description || DEFAULT_DESCRIPTION;
  const path = input.path || "/";
  const canonical = new URL(path, SITE).toString();
  const ogImage = input.ogImage || DEFAULT_OG_IMAGE;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: canonical,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
