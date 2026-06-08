import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/server/supabase-server-auth';

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[API Logout] Supabase sign out error:', error);
    return NextResponse.json({ error: 'Sign out failed.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
