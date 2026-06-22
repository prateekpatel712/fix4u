/**
 * Tiny structured logger. Keeps API routes readable and gives a single place to plug in a
 * real log sink (Logflare, Axiom, etc.) later. Never logs secrets or full PII payloads.
 */

type Level = "info" | "warn" | "error";

function emit(level: Level, scope: string, message: string, meta?: Record<string, unknown>) {
  const line = { ts: new Date().toISOString(), level, scope, message, ...meta };
  const serialized = JSON.stringify(line);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.log(serialized);
}

export function createLogger(scope: string) {
  return {
    info: (message: string, meta?: Record<string, unknown>) => emit("info", scope, message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => emit("warn", scope, message, meta),
    error: (message: string, meta?: Record<string, unknown>) => emit("error", scope, message, meta),
  };
}
