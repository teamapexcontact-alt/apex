import { NextResponse } from 'next/server';
import { protectAdminRoute } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/server/supabase-server';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await protectAdminRoute();
  if (!auth || !auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!id) {
    return NextResponse.json({ success: false, error: 'Submission id is required.' }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, error: 'Supabase is not configured.' }, { status: 500 });
  }

  const { error } = await supabaseAdmin
    .from('contact_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete contact submission:', error);
    return NextResponse.json({ success: false, error: 'Could not delete submission.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
