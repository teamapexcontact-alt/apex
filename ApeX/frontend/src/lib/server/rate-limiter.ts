import { supabaseAdmin } from "./supabase-server";
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
  maxRequests: 5, // 5 requests per window
  windowMs: 60 * 60 * 1000, // 1 hour window
};

/**
 * Extract client IP address from request headers
 */
export function getTrustedClientIp(request: Request): string {
  const headers = request.headers;

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const vercelForwardedFor = headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return "unknown";
}

/**
 * Clean up old rate limit records
 */
async function cleanupOldRateLimits(): Promise<void> {
  if (!supabaseAdmin) return;
  
  try {
    const { error } = await supabaseAdmin
      .from("rate_limit_log")
      .delete()
      .lt("submitted_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()); // 2 hours ago
    
    if (error) {
      console.error("Rate limit cleanup failed:", error);
    }
  } catch (error) {
    console.error("Rate limit cleanup error:", error);
  }
}

/**
 * Check if a request should be rate limited
 */
export async function checkRateLimit(
  request: Request,
  config: Partial<RateLimitConfig> = {}
): Promise<RateLimitResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const clientIp = getTrustedClientIp(request);
  const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex");

  if (!supabaseAdmin) {
    console.warn("Supabase not configured for rate limiting. Allowing requests to proceed without rate limiting.");
    return {
      allowed: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests,
      resetTime: new Date(Date.now() + finalConfig.windowMs),
    };
  }

  try {
    // Periodically clean up old records (10% chance to avoid excessive cleanup calls)
    if (Math.random() < 0.1) {
      await cleanupOldRateLimits();
    }

    const now = new Date();
    const windowStart = new Date(Date.now() - finalConfig.windowMs);

    // Count existing submissions for this IP hash in the active window
    const { count, error: countError } = await supabaseAdmin
      .from("rate_limit_log")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("endpoint", "contact")
      .gte("submitted_at", windowStart.toISOString());

    if (countError) {
      console.error("Rate limit check query failed:", countError);
      return {
        allowed: false,
        limit: finalConfig.maxRequests,
        remaining: 0,
        resetTime: new Date(Date.now() + finalConfig.windowMs),
        error: "Rate limit check failed",
      };
    }

    const requestCount = count ?? 0;

    // Check if limit exceeded
    if (requestCount >= finalConfig.maxRequests) {
      // Fetch the oldest submission in the current window to determine when it expires
      const { data: oldestRecord } = await supabaseAdmin
        .from("rate_limit_log")
        .select("submitted_at")
        .eq("ip_hash", ipHash)
        .eq("endpoint", "contact")
        .gte("submitted_at", windowStart.toISOString())
        .order("submitted_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      const oldestTime = oldestRecord?.submitted_at
        ? new Date(oldestRecord.submitted_at).getTime()
        : Date.now() - finalConfig.windowMs;

      return {
        allowed: false,
        limit: finalConfig.maxRequests,
        remaining: 0,
        resetTime: new Date(oldestTime + finalConfig.windowMs),
      };
    }

    // Insert log entry for the current request
    const { error: insertError } = await supabaseAdmin
      .from("rate_limit_log")
      .insert([
        {
          ip_hash: ipHash,
          endpoint: "contact",
          submitted_at: now.toISOString(),
        },
      ]);

    if (insertError) {
      console.error("Failed to record rate limit entry:", insertError);
    }

    return {
      allowed: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests - requestCount - 1,
      resetTime: new Date(now.getTime() + finalConfig.windowMs),
    };
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Fail closed on unexpected rate limiting failures
    return {
      allowed: false,
      limit: finalConfig.maxRequests,
      remaining: 0,
      resetTime: new Date(Date.now() + finalConfig.windowMs),
      error: "Rate limiting error",
    };
  }
}

/**
 * Middleware function to check rate limits and return error response if exceeded
 */
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
