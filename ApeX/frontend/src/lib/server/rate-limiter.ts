import { getDb } from "./firebase-admin";
import crypto from "crypto";

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  error?: string;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000,
};

export function getTrustedClientIp(request: Request): string {
  const headers = request.headers;

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const vercelForwardedFor = headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) return vercelForwardedFor.split(",")[0].trim();

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

async function cleanupOldRateLimits(): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const oldDocs = await db.collection("rate_limit_log")
      .where("submitted_at", "<", twoHoursAgo.toISOString())
      .limit(100)
      .get();

    const batch = db.batch();
    oldDocs.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  } catch (error) {
    console.error("Rate limit cleanup error:", error);
  }
}

export async function checkRateLimit(
  request: Request,
  config: Partial<RateLimitConfig> = {}
): Promise<RateLimitResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const clientIp = getTrustedClientIp(request);
  const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex");

  const db = getDb();
  if (!db) {
    console.warn("Firestore not configured for rate limiting. Allowing requests.");
    return {
      allowed: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests,
      resetTime: new Date(Date.now() + finalConfig.windowMs),
    };
  }

  try {
    if (Math.random() < 0.1) {
      await cleanupOldRateLimits();
    }

    const windowStart = new Date(Date.now() - finalConfig.windowMs);

    const snapshot = await db.collection("rate_limit_log")
      .where("ip_hash", "==", ipHash)
      .where("endpoint", "==", "contact")
      .where("submitted_at", ">=", windowStart.toISOString())
      .get();

    const requestCount = snapshot.size;

    if (requestCount >= finalConfig.maxRequests) {
      const oldestDoc = snapshot.docs.sort((a, b) => {
        const aTime = new Date(a.data().submitted_at).getTime();
        const bTime = new Date(b.data().submitted_at).getTime();
        return aTime - bTime;
      })[0];

      const oldestTime = oldestDoc
        ? new Date(oldestDoc.data().submitted_at).getTime()
        : Date.now() - finalConfig.windowMs;

      return {
        allowed: false,
        limit: finalConfig.maxRequests,
        remaining: 0,
        resetTime: new Date(oldestTime + finalConfig.windowMs),
      };
    }

    await db.collection("rate_limit_log").add({
      ip_hash: ipHash,
      endpoint: "contact",
      submitted_at: new Date().toISOString(),
    });

    return {
      allowed: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests - requestCount - 1,
      resetTime: new Date(Date.now() + finalConfig.windowMs),
    };
  } catch (error) {
    const errMsg = String(error);
    const isFirestoreDisabled = errMsg.includes("SERVICE_DISABLED") || errMsg.includes("PERMISSION_DENIED") || errMsg.includes("firestore.googleapis.com");

    if (isFirestoreDisabled) {
      console.warn("Rate limiting unavailable (Firestore not enabled). Allowing request.");
      return {
        allowed: true,
        limit: finalConfig.maxRequests,
        remaining: finalConfig.maxRequests,
        resetTime: new Date(Date.now() + finalConfig.windowMs),
      };
    }

    console.error("Rate limiting error:", error);
    return {
      allowed: false,
      limit: finalConfig.maxRequests,
      remaining: 0,
      resetTime: new Date(Date.now() + finalConfig.windowMs),
      error: "Rate limiting error",
    };
  }
}

export async function rateLimitMiddleware(
  request: Request,
  config?: Partial<RateLimitConfig>
): Promise<{ allowed: boolean; response?: Response }> {
  const result = await checkRateLimit(request, config);

  if (!result.allowed) {
    const response = new Response(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((result.resetTime.getTime() - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.resetTime.toUTCString(),
          "Retry-After": Math.ceil((result.resetTime.getTime() - Date.now()) / 1000).toString(),
        },
      }
    );

    return { allowed: false, response };
  }

  return { allowed: true };
}
