import { cookies } from 'next/headers';
import { getDb, getAdminAuth } from '@/lib/server/firebase-admin';

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    if (!sessionCookie) return null;

    const adminAuth = getAdminAuth();
    if (!adminAuth) return null;

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return { uid: decodedToken.uid, email: decodedToken.email };
  } catch {
    return null;
  }
}

export async function isAdmin(user?: { uid?: string; email?: string } | null) {
  const db = getDb();
  if (!db || !user || !user.uid) return false;

  try {
    const snapshot = await db.collection('admin').where('user_id', '==', user.uid).limit(1).get();
    return !snapshot.empty;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
}

export async function protectAdminRoute() {
  const user = await getSessionUser();
  if (!user) {
    return { authorized: false, redirect: '/admin/login' };
  }

  const admin = await isAdmin(user);
  if (!admin) {
    return { authorized: false, redirect: '/admin/unauthorized' };
  }

  return { authorized: true, user };
}
