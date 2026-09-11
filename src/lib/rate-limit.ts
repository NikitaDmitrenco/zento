import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Sliding-window duration string accepted by @upstash/ratelimit, e.g. "15 m", "1 h".
type Duration = `${number} ${"ms" | "s" | "m" | "h" | "d"}`;

// The rate limiter is only active when an Upstash Redis REST endpoint is configured.
// Without these env vars (local dev, tests, unconfigured deploy) it is a no-op and
// requests are always allowed — the app behaves exactly as before.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, limit: number, window: Duration): Ratelimit | null {
  if (!redis) return null;
  const cacheKey = `${name}:${limit}:${window}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `zento:rl:${name}`,
      analytics: false,
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

// Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds?: number;
}

/**
 * Enforce a sliding-window limit of `limit` requests per `window` for a given
 * `identifier` (e.g. an IP or an email) under a named bucket. Returns { ok: true }
 * when allowed or when rate limiting is not configured; { ok: false, retryAfterSeconds }
 * when the limit is exceeded. Never throws — on backend errors it fails open so a
 * limiter outage cannot take the site down.
 */
export async function enforceRateLimit(
  name: string,
  identifier: string,
  limit: number,
  window: Duration
): Promise<RateLimitResult> {
  const limiter = getLimiter(name, limit, window);
  if (!limiter) return { ok: true };

  try {
    const result = await limiter.limit(identifier);
    if (result.success) return { ok: true };
    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return { ok: false, retryAfterSeconds };
  } catch {
    // Fail open: a rate-limiter outage must not block legitimate traffic.
    return { ok: true };
  }
}

// Standard 429 response with a Retry-After header.
export function tooManyRequests(retryAfterSeconds?: number): Response {
  return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      ...(retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {}),
    },
  });
}
