import { getDb } from './firebase-admin';
import { getTrustedClientIp } from '@/lib/server/rate-limiter';

const MAX_EMAIL_ATTEMPTS = 5;
const MAX_IP_ATTEMPTS = 20;
const WINDOW_SECONDS = 60 * 60;
const LOCKOUT_SECONDS = 60 * 60;

function normalizeKey(key: string) {
  return key.trim().toLowerCase();
}

async function getLockout(lockKey: string): Promise<{ locked: boolean; retryAfter: number }> {
  const db = getDb();
  if (!db) return { locked: false, retryAfter: 0 };

  try {
    const doc = await db.collection("login_rate_limit").doc(lockKey).get();
    if (doc.exists) {
      const data = doc.data()!;
      const expiresAt = new Date(data.expires_at).getTime();
      if (expiresAt > Date.now()) {
        return { locked: true, retryAfter: Math.ceil((expiresAt - Date.now()) / 1000) };
      }
      await doc.ref.delete();
    }
  } catch (error) {
    console.error("Login lockout check failed:", error);
  }

  return { locked: false, retryAfter: 0 };
}

async function incrementAndCheck(key: string, maxAttempts: number): Promise<{ exceeded: boolean; retryAfter: number }> {
  const db = getDb();
  if (!db) return { exceeded: false, retryAfter: 0 };

  const now = Date.now();
  const windowStart = new Date(now - WINDOW_SECONDS * 1000).toISOString();

  try {
    const snapshot = await db.collection("login_rate_limit")
      .where("key", "==", key)
      .where("attempted_at", ">=", windowStart)
      .get();

    const count = snapshot.size;

    await db.collection("login_rate_limit").add({
      key,
      attempted_at: new Date().toISOString(),
    });

    if (count >= maxAttempts) {
      const lockKey = `lockout:${key}`;
      const lockExpiry = new Date(now + LOCKOUT_SECONDS * 1000);
      await db.collection("login_rate_limit").doc(lockKey).set({
        key: lockKey,
        expires_at: lockExpiry.toISOString(),
        attempted_at: new Date().toISOString(),
      });

      return { exceeded: true, retryAfter: LOCKOUT_SECONDS };
    }
  } catch (error) {
    console.error("Login rate limit increment failed:", error);
  }

  return { exceeded: false, retryAfter: 0 };
}

async function clearKey(key: string) {
  const db = getDb();
  if (!db) return;

  try {
    const snapshot = await db.collection("login_rate_limit")
      .where("key", "==", key)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  } catch (error) {
    console.error("Login rate limit clear failed:", error);
  }
}

function getEmailKey(email: string) {
  return `login:failed:email:${normalizeKey(email)}`;
}

function getIpKey(ip: string) {
  return `login:failed:ip:${normalizeKey(ip)}`;
}

function getEmailLockoutKey(email: string) {
  return `login:lockout:email:${normalizeKey(email)}`;
}

function getIpLockoutKey(ip: string) {
  return `login:lockout:ip:${normalizeKey(ip)}`;
}

export async function checkLoginRateLimit(request: Request, email: string) {
  const ip = getTrustedClientIp(request);

  const emailLock = await getLockout(getEmailLockoutKey(email));
  if (emailLock.locked) return { allowed: false, retryAfter: emailLock.retryAfter };

  const ipLock = await getLockout(getIpLockoutKey(ip));
  if (ipLock.locked) return { allowed: false, retryAfter: ipLock.retryAfter };

  return { allowed: true, retryAfter: 0 };
}

export async function recordFailedLoginAttempt(request: Request, email: string) {
  const ip = getTrustedClientIp(request);
  const emailKey = getEmailKey(email);
  const ipKey = getIpKey(ip);

  await incrementAndCheck(emailKey, MAX_EMAIL_ATTEMPTS);
  await incrementAndCheck(ipKey, MAX_IP_ATTEMPTS);

  const emailLock = await getLockout(getEmailLockoutKey(email));
  const ipLock = await getLockout(getIpLockoutKey(ip));

  return {
    blocked: emailLock.locked || ipLock.locked,
    retryAfter: Math.max(emailLock.retryAfter, ipLock.retryAfter),
  };
}

export async function clearLoginFailures(request: Request, email: string) {
  const ip = getTrustedClientIp(request);
  await Promise.all([
    clearKey(getEmailKey(email)),
    clearKey(getIpKey(ip)),
    clearKey(getEmailLockoutKey(email)),
    clearKey(getIpLockoutKey(ip)),
  ]);
}
