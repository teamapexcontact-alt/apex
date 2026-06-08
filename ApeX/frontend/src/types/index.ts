export type NavLink = {
  label: string;
  href: string;
};

export type Service = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

export type ContactFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
  website?: string;
  captchaToken?: string; // Optional CAPTCHA token for future use
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  created_at: string;
};

export type ContactFormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };
