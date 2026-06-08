'use server';

import { getDb } from '@/lib/server/firebase-admin';
import type { ContactRequest } from '@/types';

export interface PaginatedSubmissionsResult {
  submissions: ContactRequest[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function getContactSubmissions(
  limit: number = 50,
  cursor: string | null = null
): Promise<{ success: boolean; data?: PaginatedSubmissionsResult; error?: string }> {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore not configured.');

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
    })) as unknown as ContactRequest[];

    const hasMore = submissions.length > limit;
    const nextCursor = hasMore ? (submissions[limit - 1] as unknown as { id: string }).id || null : null;
    const paginatedSubmissions = hasMore ? submissions.slice(0, limit) : submissions;

    return {
      success: true,
      data: {
        submissions: paginatedSubmissions,
        nextCursor,
        hasMore,
      },
    };
  } catch (error: unknown) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: 'Failed to retrieve contact submissions.' };
  }
}

export async function getAllContactSubmissions() {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore not configured.');

    const HARD_LIMIT = 1000;
    const snapshot = await db.collection('contact_requests')
      .orderBy('created_at', 'desc')
      .limit(HARD_LIMIT)
      .get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data, _note: 'Use cursor-based pagination for large datasets' };
  } catch (error: unknown) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: 'Failed to retrieve contact submissions.' };
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore not configured.');

    await db.collection('contact_requests').doc(id).delete();
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting submission:', error);
    return { success: false, error: 'Failed to delete contact submission.' };
  }
}

export async function loadMoreSubmissions(cursor: string | null, limit: number = 20) {
  try {
    const result = await getContactSubmissions(limit, cursor);
    return result;
  } catch (error: unknown) {
    console.error('Error loading more submissions:', error);
    return { success: false, error: 'Failed to retrieve additional contact submissions.' };
  }
}

export async function getAdminDashboardData(limit: number = 20) {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore not configured.');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const submissionsSnap = await db.collection('contact_requests')
      .orderBy('created_at', 'desc')
      .limit(limit + 1)
      .get();

    const totalSnap = await db.collection('contact_requests').count().get();
    const todaySnap = await db.collection('contact_requests')
      .where('created_at', '>=', today.toISOString())
      .count().get();
    const weekSnap = await db.collection('contact_requests')
      .where('created_at', '>=', weekAgo.toISOString())
      .count().get();

    const submissions = submissionsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const hasMore = submissions.length > limit;
    const nextCursor = hasMore ? submissions[limit - 1]?.id || null : null;
    const paginatedSubmissions = hasMore ? submissions.slice(0, limit) : submissions;

    return {
      success: true,
      data: {
        submissions: paginatedSubmissions,
        pagination: { nextCursor, hasMore },
        stats: {
          total: totalSnap.data().count,
          today: todaySnap.data().count,
          week: weekSnap.data().count,
        },
      },
    };
  } catch (error: unknown) {
    console.error('Error fetching admin dashboard data:', error);
    return { success: false, error: 'Failed to load dashboard statistics and submissions.' };
  }
}

export async function getContactStats() {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore not configured.');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [totalSnap, todaySnap, weekSnap] = await Promise.all([
      db.collection('contact_requests').count().get(),
      db.collection('contact_requests').where('created_at', '>=', today.toISOString()).count().get(),
      db.collection('contact_requests').where('created_at', '>=', weekAgo.toISOString()).count().get(),
    ]);

    return {
      success: true,
      data: {
        total: totalSnap.data().count,
        today: todaySnap.data().count,
        week: weekSnap.data().count,
      },
    };
  } catch (error: unknown) {
    console.error('Error fetching stats:', error);
    return { success: false, error: 'Failed to load contact request statistics.' };
  }
}
