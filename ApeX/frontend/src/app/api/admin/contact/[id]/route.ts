import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/server/firebase-admin';
import { cookies } from 'next/headers';

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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!id) {
    return NextResponse.json({ success: false, error: 'Submission id is required.' }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ success: false, error: 'Database is not configured.' }, { status: 500 });
  }

  try {
    await db.collection('contact_requests').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete contact submission:', error);
    return NextResponse.json({ success: false, error: 'Could not delete submission.' }, { status: 500 });
  }
}
