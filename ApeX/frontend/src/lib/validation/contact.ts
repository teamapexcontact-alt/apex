import { z } from "zod";

// RFC 5322 simplified email regex (practical validation)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// International phone validation (allows +, digits, hyphens, spaces, parentheses)
// Matches E.164 format and common variations
const PHONE_RE = /^[\d\s\-().+]{7,20}$/;

// Enhanced patterns to block in message (XSS, spam vectors, injection attacks)
const SUSPICIOUS_PATTERNS = [
  /http/i, /www\./i, /\.com/i, /href/i, /<a /i, /<script/i,
  /javascript:/i, /onerror=/i, /onload=/i, /onclick=/i,
  /<iframe/i, /<object/i, /<embed/i, /eval\(/i, /document\./i,
  /window\./i, /alert\(/i, /prompt\(/i, /confirm\(/i,
  /<svg/i, /onfocus=/i, /onblur=/i, /onmouseover=/i,
  /\$\{.*\}/i, /@import/i, /expression\(/i,
];

/**
 * Enhanced contact form schema with strict validation
 * - All string fields are trimmed before validation
 * - Email uses RFC 5322 simplified regex
 * - Phone uses international format validation
 * - Message includes honeypot check and pattern scanning
 * - All field lengths match database column constraints
 */
export const contactFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(100, "First name must not exceed 100 characters"),
    
    lastName: z
      .string()
      .trim()
      .max(100, "Last name must not exceed 100 characters")
      .refine(
        (val) => val === "" || val.length >= 2,
        "Last name must be at least 2 characters"
      )
      .optional()
      .or(z.literal("")),
    
    email: z
      .string()
      .trim()
      .max(254, "Email must not exceed 254 characters")
      .regex(EMAIL_RE, "Please enter a valid email address"),
    
    phone: z
      .string()
      .trim()
      .max(30, "Phone number must not exceed 30 characters")
      .refine(
        (val) => val === "" || PHONE_RE.test(val),
        "Phone number format is invalid. Use digits, spaces, hyphens, or +prefix."
      )
      .optional()
      .or(z.literal("")),
    
    company: z
      .string()
      .trim()
      .max(100, "Company name must not exceed 100 characters")
      .optional()
      .or(z.literal("")),
    
    currentWebsite: z
      .string()
      .trim()
      .url("Enter a valid URL")
      .max(500, "Website URL must not exceed 500 characters")
      .optional()
      .or(z.literal("")),
    
    service: z
      .string()
      .trim()
      .min(1, "Please select a service")
      .max(100, "Service name must not exceed 100 characters"),
    
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(5000, "Message must not exceed 5000 characters"),
    
    // Honeypot field - should remain empty
    website: z
      .string()
      .trim()
      .max(300, "Website field is invalid")
      .optional()
      .or(z.literal("")),
    
    captchaToken: z
      .string()
      .trim()
      .max(500, "CAPTCHA token is invalid")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Prevent accidental duplication of first name and last name
    if (
      data.lastName &&
      data.firstName.trim().toLowerCase() === data.lastName.trim().toLowerCase()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lastName"],
        message: "Last name cannot be identical to first name to prevent duplication.",
      });
    }

    // Honeypot check - website field must be empty
    if (data.website && data.website.trim() !== "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid submission.",
      });
    }

    // Scan message for XSS and spam patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(data.message)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Message contains unsupported content.",
        });
        break;
      }
    }
  });

export type ContactFormPayload = z.infer<typeof contactFormSchema>;

export function validateContactForm(
  data: unknown
): { ok: true; data: ContactFormPayload } | { ok: false; error: string } {
  const result = contactFormSchema.safeParse(data);
  if (!result.success) {
    return { ok: false, error: result.error.errors[0]?.message || "Invalid form submission." };
  }
  return { ok: true, data: result.data };
}
