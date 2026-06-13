import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/server/firebase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function verifyAdminSession(): Promise<{ authorized: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    if (!sessionCookie) return { authorized: false, error: 'No session' };

    const adminAuth = getAdminAuth();
    if (!adminAuth) return { authorized: false, error: 'Auth not configured' };

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    const db = getDb();
    if (!db) return { authorized: false, error: 'DB not configured' };

    const snapshot = await db.collection('admin').where('user_id', '==', decoded.uid).limit(1).get();
    if (snapshot.empty) return { authorized: false, error: 'Not an admin' };

    return { authorized: true };
  } catch {
    return { authorized: false, error: 'Invalid session' };
  }
}

export async function GET(request: Request) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ success: false, error: 'Database is not configured.' }, { status: 500 });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const limitParam = url.searchParams.get('limit');
  const limit = Math.min(Math.max(Number(limitParam ?? '20'), 1), 100);

  try {
    let query = db.collection('contact_requests').orderBy('created_at', 'desc').limit(limit + 1);

    if (cursor) {
      const cursorDoc = await db.collection('contact_requests').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();
    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const hasMore = submissions.length > limit;
    const paginatedSubmissions = hasMore ? submissions.slice(0, limit) : submissions;
    const nextCursor = hasMore ? paginatedSubmissions[limit - 1]?.id ?? null : null;

    const includeStats = url.searchParams.get('includeStats') === 'true';
    let stats = null;

    if (includeStats) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const totalSnap = await db.collection('contact_requests').count().get();
      const todaySnap = await db.collection('contact_requests')
        .where('created_at', '>=', today.toISOString())
        .count().get();
      const weekSnap = await db.collection('contact_requests')
        .where('created_at', '>=', weekAgo.toISOString())
        .count().get();

      stats = {
        total: totalSnap.data().count,
        today: todaySnap.data().count,
        week: weekSnap.data().count,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        submissions: paginatedSubmissions,
        nextCursor,
        hasMore,
        stats,
      },
    });
  } catch (error) {
    console.error('Failed to fetch contact submissions:', error);
    return NextResponse.json({ success: false, error: 'Could not load submissions.' }, { status: 500 });
  }
}
