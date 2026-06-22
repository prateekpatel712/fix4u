/**
 * Small helpers shared by the /api route handlers: consistent JSON responses and a
 * rate-limit guard. Keeps each route focused on its own logic.
 */

import { clientIp, rateLimit } from "@/lib/rate-limit";

export function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

export function ok(data: Record<string, unknown> = {}): Response {
  return json({ ok: true, ...data }, 200);
}

export function badRequest(message: string, extra?: Record<string, unknown>): Response {
  return json({ ok: false, error: message, ...extra }, 400);
}

export function tooMany(retryAfterSeconds: number): Response {
  return json(
    { ok: false, error: "Too many requests. Please slow down." },
    429,
    { "retry-after": String(retryAfterSeconds) },
  );
}

export function serverError(message = "Something went wrong."): Response {
  return json({ ok: false, error: message }, 500);
}

/**
 * Apply a per-IP rate limit for a route. Returns a 429 Response when exceeded, otherwise null.
 * Usage: `const limited = enforceRateLimit(req, "contact"); if (limited) return limited;`
 */
export function enforceRateLimit(
  req: Request,
  route: string,
  limit = 5,
  windowMs = 60_000,
): Response | null {
  const result = rateLimit(`${route}:${clientIp(req)}`, limit, windowMs);
  return result.ok ? null : tooMany(result.retryAfterSeconds);
}

/** Parse a JSON body safely; returns null on malformed input. */
export async function readJson<T = unknown>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
