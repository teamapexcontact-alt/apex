import { NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/server/firebase-admin';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const { idToken } = body;
  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
  }

  const adminAuth = getAdminAuth();
  const db = getDb();

  if (!adminAuth || !db) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef.where('user_id', '==', decodedToken.uid).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('[API Session] Failed to create session:', error);
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('__session');
  return response;
}
