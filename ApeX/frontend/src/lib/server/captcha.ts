/**
 * CAPTCHA validation utility for future integration
 * Supports multiple CAPTCHA providers: reCAPTCHA, hCaptcha, Cloudflare Turnstile
 * 
 * This module provides hooks for CAPTCHA validation that can be enabled
 * when needed without breaking existing functionality.
 */

export interface CaptchaConfig {
  enabled: boolean;
  provider: "recaptcha" | "hcaptcha" | "turnstile" | "custom";
  secretKey?: string;
  minScore?: number; // For reCAPTCHA v3
}

export interface CaptchaValidationResult {
  valid: boolean;
  error?: string;
  score?: number;
}

/**
 * Default CAPTCHA configuration (disabled by default)
 */
const DEFAULT_CONFIG: CaptchaConfig = {
  enabled: false,
  provider: "recaptcha",
};

/**
 * Validate reCAPTCHA token
 */
async function validateRecaptcha(
  token: string,
  secretKey: string,
  minScore?: number
): Promise<CaptchaValidationResult> {
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        valid: false,
        error: "reCAPTCHA validation failed",
      };
    }

    // Check score for reCAPTCHA v3
    if (minScore !== undefined && result.score !== undefined) {
      if (result.score < minScore) {
        return {
          valid: false,
          error: "reCAPTCHA score too low",
          score: result.score,
        };
      }
    }

    return {
      valid: true,
      score: result.score,
    };
  } catch (error) {
    console.error("reCAPTCHA validation error:", error);
    return {
      valid: false,
      error: "reCAPTCHA validation error",
    };
  }
}

/**
 * Validate hCaptcha token
 */
async function validateHcaptcha(
  token: string,
  secretKey: string
): Promise<CaptchaValidationResult> {
  try {
    const response = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const result = await response.json();

    if (!result.success) {
      return {
        valid: false,
        error: "hCaptcha validation failed",
      };
    }

    return {
      valid: true,
      score: result.score,
    };
  } catch (error) {
    console.error("hCaptcha validation error:", error);
    return {
      valid: false,
      error: "hCaptcha validation error",
    };
  }
}

/**
 * Validate Cloudflare Turnstile token
 */
async function validateTurnstile(
  token: string,
  secretKey: string
): Promise<CaptchaValidationResult> {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        valid: false,
        error: "Turnstile validation failed",
      };
    }

    return {
      valid: true,
    };
  } catch (error) {
    console.error("Turnstile validation error:", error);
    return {
      valid: false,
      error: "Turnstile validation error",
    };
  }
}

/**
 * Validate CAPTCHA token based on provider configuration
 */
export async function validateCaptcha(
  token: string | undefined,
  config: Partial<CaptchaConfig> = {}
): Promise<CaptchaValidationResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // If CAPTCHA is disabled, allow the request
  if (!finalConfig.enabled) {
    return { valid: true };
  }

  // If no token provided and CAPTCHA is enabled, fail validation
  if (!token) {
    return {
      valid: false,
      error: "CAPTCHA token is required",
    };
  }

  if (!finalConfig.secretKey) {
    return {
      valid: false,
      error: "CAPTCHA is enabled but not configured correctly.",
    };
  }

  switch (finalConfig.provider) {
    case "recaptcha":
      return validateRecaptcha(
        token,
        finalConfig.secretKey,
        finalConfig.minScore
      );
    case "hcaptcha":
      return validateHcaptcha(token, finalConfig.secretKey);
    case "turnstile":
      return validateTurnstile(token, finalConfig.secretKey);
    case "custom":
      // Implement custom CAPTCHA validation logic here
      return { valid: true };
    default:
      return { valid: true };
  }
}

/**
 * Middleware function to validate CAPTCHA and return error response if invalid
 */
export async function captchaMiddleware(
  token: string | undefined,
  config?: Partial<CaptchaConfig>
): Promise<{ valid: boolean; response?: Response }> {
  const result = await validateCaptcha(token, config);

  if (!result.valid) {
    const response = new Response(
      JSON.stringify({
        error: result.error || "CAPTCHA validation failed",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { valid: false, response };
  }

  return { valid: true };
}

/**
 * Helper function to extract CAPTCHA token from request body
 */
export function extractCaptchaToken(
  body: Record<string, unknown>,
  fieldName: string = "captchaToken"
): string | undefined {
  const token = body[fieldName];
  return typeof token === "string" ? token : undefined;
}
