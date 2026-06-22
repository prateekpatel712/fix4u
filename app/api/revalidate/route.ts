/**
 * POST /api/revalidate — Sanity publish webhook → ISR revalidation (PRD §2.10).
 *
 * When an editor publishes content, Sanity calls this endpoint and we revalidate the affected
 * routes so the live site updates without a redeploy. Protected by a shared secret (configure the
 * same value as SANITY_REVALIDATE_SECRET and in the Sanity webhook URL: `?secret=...`).
 *
 * Frontend pages should `export const revalidate` / use these path conventions; this route is the
 * trigger side and is safe to ship before the pages exist.
 */

import { revalidatePath } from "next/cache";
import { json, ok, readJson } from "@/lib/api";
import { optionalEnv } from "@/lib/env";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const log = createLogger("api/revalidate");

interface SanityWebhookBody {
  _type?: string;
  slug?: string | { current?: string };
}

export async function POST(req: Request): Promise<Response> {
  const secret = optionalEnv("SANITY_REVALIDATE_SECRET");
  const provided = new URL(req.url).searchParams.get("secret") || req.headers.get("x-webhook-secret");

  if (!secret || provided !== secret) {
    return json({ ok: false, error: "Invalid secret." }, 401);
  }

  const body = (await readJson<SanityWebhookBody>(req)) || {};
  const type = body._type;
  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;

  const paths = pathsForDocument(type, slug);
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch (err) {
      log.warn("revalidatePath failed", { path: p, error: String(err) });
    }
  }

  log.info("Revalidated", { type, slug, paths });
  return ok({ revalidated: paths });
}

/** Map a changed document to the routes that should be refreshed. */
function pathsForDocument(type?: string, slug?: string): string[] {
  switch (type) {
    case "caseStudy":
      return ["/", "/results", ...(slug ? [`/results/${slug}`] : [])];
    case "post":
      return ["/insights", ...(slug ? [`/insights/${slug}`] : [])];
    case "service":
      return ["/", "/ai-booking-agent"];
    case "testimonial":
    case "faq":
    case "siteSettings":
      return ["/"]; // these surface on the home page (and globally)
    default:
      // Unknown type → refresh the home page to be safe.
      return ["/"];
  }
}
