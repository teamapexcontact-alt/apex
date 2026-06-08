import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-server";
import { sendContactNotificationEmails } from "@/lib/server/resend";
import { getTrustedClientIp, rateLimitMiddleware } from "@/lib/server/rate-limiter";
import { captchaMiddleware, extractCaptchaToken } from "@/lib/server/captcha";
import { contactFormSchema } from "@/lib/validation/contact";
import type { ContactFormPayload } from "@/types";
import { formatClientName } from "@/lib/name-utils";

function isSafeLocalhost(urlStr?: string | null): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    return (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

function verifyOrigin(request: Request): boolean {
  const referer = request.headers.get("referer");
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apex-studio-mu.vercel.app";
  const isDev = process.env.NODE_ENV === "development";

  // Check localhost in development or testing
  if (isDev) {
    if (isSafeLocalhost(origin) || isSafeLocalhost(referer)) {
      return true;
    }
  }

  // Parse and check origin
  if (origin) {
    try {
      const originUrl = new URL(origin);
      // 1. Check if origin matches process.env.NEXT_PUBLIC_SITE_URL
      const siteParsedUrl = new URL(siteUrl);
      if (originUrl.hostname === siteParsedUrl.hostname) {
        return true;
      }
      
      // 2. Check if origin matches the Host header
      if (host) {
        const hostWithoutPort = host.split(":")[0];
        if (originUrl.hostname === hostWithoutPort) {
          return true;
        }
      }
    } catch {
      return false;
    }
  }

  // Parse and check referer (fallback if origin not present)
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const siteParsedUrl = new URL(siteUrl);
      if (refererUrl.hostname === siteParsedUrl.hostname) {
        return true;
      }
      
      if (host) {
        const hostWithoutPort = host.split(":")[0];
        if (refererUrl.hostname === hostWithoutPort) {
          return true;
        }
      }
    } catch {
      return false;
    }
  }

  return false;
}

export async function POST(request: Request) {
  // Apply database-backed rate limiting (reliable in serverless environments)
  const rateLimitResult = await rateLimitMiddleware(request, {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  // Validate request size (prevent large payload attacks)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10000) {
    return NextResponse.json(
      { error: "Request payload too large." },
      { status: 413 }
    );
  }

  // Validate Content-Type
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid content type. Expected application/json." },
      { status: 415 }
    );
  }

  // Validate referrer / origin (prevent CSRF and origin-spoofing bypasses)
  if (!verifyOrigin(request)) {
    const referer = request.headers.get("referer");
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    console.warn(`[API Contact] Blocked request from unauthorized origin: origin=${origin}, referer=${referer}, host=${host}`);
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  const body = await request.json();

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Invalid form submission." },
      { status: 400 }
    );
  }

  const payload = parsed.data as ContactFormPayload;

  const captchaEnabled = process.env.CAPTCHA_ENABLED === "true";
  if (captchaEnabled) {
    const captchaToken = extractCaptchaToken(body, "captchaToken");
    const captchaConfig = {
      enabled: true,
      provider: (process.env.CAPTCHA_PROVIDER as "recaptcha" | "hcaptcha" | "turnstile") || "recaptcha",
      secretKey: process.env.CAPTCHA_SECRET_KEY,
      minScore: process.env.CAPTCHA_MIN_SCORE ? parseFloat(process.env.CAPTCHA_MIN_SCORE) : undefined,
    };

    const captchaResult = await captchaMiddleware(captchaToken, captchaConfig);
    if (!captchaResult.valid && captchaResult.response) {
      return captchaResult.response;
    }
  }

  const tableName = process.env.SUPABASE_CONTACT_TABLE || "contact_requests";

  if (!supabaseAdmin) {
    console.error("[API Contact] Supabase client is uninitialized.");
    return NextResponse.json(
      { error: "Database service is currently unavailable." },
      { status: 500 }
    );
  }

  const { error } = await supabaseAdmin.from(tableName).insert([
    {
      name: formatClientName(`${payload.firstName.trim()} ${payload.lastName.trim()}`),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      message: payload.message.trim(),
    },
  ]);

  if (error) {
    console.error("[API Contact] Database insert error:", error);
    return NextResponse.json(
      { error: "Failed to save contact request." },
      { status: 500 }
    );
  }

  try {
    await sendContactNotificationEmails(payload);
  } catch (sendError: unknown) {
    console.error('Contact notification email failed:', sendError);
    return NextResponse.json(
      { error: "Contact request saved, but notification delivery failed." },
      { status: 500 }
    );
  }

  const ip = getTrustedClientIp(request);
  // Log successful submission for security monitoring
  console.log(`Contact form submitted successfully from IP: ${ip}, Email: ${payload.email}`);

  return NextResponse.json(
    { success: true },
    {
      status: 201,
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    }
  );
}
