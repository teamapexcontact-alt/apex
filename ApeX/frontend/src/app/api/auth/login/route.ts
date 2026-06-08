import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/server/supabase-server-auth';
import { isAdmin } from '@/lib/auth';
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearLoginFailures,
} from '@/lib/server/login-rate-limiter';

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format.').max(254),
  password: z.string().trim().min(1, 'Password is required.').max(1000),
});

const GENERIC_ERROR = 'Invalid email or password.';
const TIMING_DELAY_MS = 100;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Email and password are required.' },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const rateLimitStatus = await checkLoginRateLimit(request, email);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      { error: 'Too many failed login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.session) {
    await recordFailedLoginAttempt(request, email);
    console.error('[API Login] Supabase authentication failed:', error);

    await delay(TIMING_DELAY_MS);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const userForCheck = data.user
    ? {
        id: data.user.id ?? undefined,
        email: data.user.email ?? undefined,
      }
    : null;
  const adminCheck = await isAdmin(userForCheck);
  if (!adminCheck) {
    console.warn(`[API Login] Non-admin user attempted dashboard access: ID=${data.user?.id}`);

    await delay(TIMING_DELAY_MS);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  await clearLoginFailures(request, email);
  return NextResponse.json({ success: true });
}
