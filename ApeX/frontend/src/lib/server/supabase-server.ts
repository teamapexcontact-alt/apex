import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase admin client. Construct lazily to avoid failing builds
// when server-only env vars are not present (CI/local without secrets).
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && serviceRoleKey) {
  _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
} else {
  // Do not throw here — callers should handle absence and return a 500 at runtime.
  // This allows `next build` to succeed in developer environments without secrets.
  console.warn(
    "Supabase server env vars missing: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. supabaseAdmin will be null."
  );
}

export const supabaseAdmin = _supabaseAdmin;
