import { NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/server/firebase-admin';
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
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

  const { email } = parsed.data;
  const rateLimitStatus = await checkLoginRateLimit(request, email);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      { error: 'Too many failed login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const adminAuth = getAdminAuth();
  const db = getDb();

  if (!adminAuth || !db) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const userRecord = await adminAuth.getUserByEmail(email);

    const customToken = await adminAuth.createCustomToken(userRecord.uid);

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email: userRecord.email,
      customToken,
    });
  } catch (error: unknown) {
    await recordFailedLoginAttempt(request, email);
    console.error('[API Login] Firebase authentication failed:', error);

    await delay(TIMING_DELAY_MS);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }
}
