import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/firebase-admin";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://buildwithapex.app";
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    if (isSafeLocalhost(origin) || isSafeLocalhost(referer)) {
      return true;
    }
  }

  if (origin) {
    try {
      const originUrl = new URL(origin);
      const siteParsedUrl = new URL(siteUrl);
      if (originUrl.hostname === siteParsedUrl.hostname) return true;
      if (host) {
        const hostWithoutPort = host.split(":")[0];
        if (originUrl.hostname === hostWithoutPort) return true;
      }
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const siteParsedUrl = new URL(siteUrl);
      if (refererUrl.hostname === siteParsedUrl.hostname) return true;
      if (host) {
        const hostWithoutPort = host.split(":")[0];
        if (refererUrl.hostname === hostWithoutPort) return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}

export async function POST(request: Request) {
  const rateLimitResult = await rateLimitMiddleware(request, {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10000) {
    return NextResponse.json({ error: "Request payload too large." }, { status: 413 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type. Expected application/json." }, { status: 415 });
  }

  if (!verifyOrigin(request)) {
    const referer = request.headers.get("referer");
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    console.warn(`[API Contact] Blocked request from unauthorized origin: origin=${origin}, referer=${referer}, host=${host}`);
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
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

  const db = getDb();
  if (!db) {
    console.error("[API Contact] Firestore client is uninitialized.");
    return NextResponse.json({ error: "Database service is currently unavailable." }, { status: 500 });
  }

  try {
    await db.collection("contact_requests").add({
      name: formatClientName(`${payload.firstName.trim()} ${payload.lastName.trim()}`),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      message: payload.message.trim(),
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    const errMsg = String(error);
    const isFirestoreUnavailable = errMsg.includes("SERVICE_DISABLED") || errMsg.includes("PERMISSION_DENIED") || errMsg.includes("firestore.googleapis.com") || errMsg.includes("NOT_FOUND") || errMsg.includes("FAILED_PRECONDITION");

    if (isFirestoreUnavailable) {
      console.error("[API Contact] Firestore is not available.");
      return NextResponse.json(
        { error: "Database service is not configured. Contact the site owner at teamapex.contact@gmail.com." },
        { status: 503 }
      );
    }

    console.error("[API Contact] Firestore insert error:", error);
    return NextResponse.json(
      { error: "Failed to save contact request. Please try again later." },
      { status: 500 }
    );
  }

  try {
    await sendContactNotificationEmails(payload);
  } catch (sendError: unknown) {
    console.error("Contact notification email failed:", sendError);
    return NextResponse.json(
      { error: "Contact request saved, but notification delivery failed." },
      { status: 500 }
    );
  }

  const ip = getTrustedClientIp(request);
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
