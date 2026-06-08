import { NextResponse } from 'next/server';
import { protectAdminRoute } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/server/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await protectAdminRoute();
  if (!auth || !auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, error: 'Supabase is not configured.' }, { status: 500 });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const limitParam = url.searchParams.get('limit');
  const limit = Math.min(Math.max(Number(limitParam ?? '20'), 1), 100);

  let query = supabaseAdmin
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to fetch contact submissions:', error);
    return NextResponse.json({ success: false, error: 'Could not load submissions.' }, { status: 500 });
  }

  const submissions = data || [];
  const hasMore = submissions.length > limit;
  const paginatedSubmissions = hasMore ? submissions.slice(0, limit) : submissions;
  const nextCursor = hasMore ? paginatedSubmissions[limit - 1]?.created_at ?? null : null;

  const includeStats = url.searchParams.get('includeStats') === 'true';
  let stats = null;

  if (includeStats) {
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const [totalResult, todayResult, weekResult] = await Promise.all([
      supabaseAdmin.from('contact_requests').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('contact_requests').select('id', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
      supabaseAdmin.from('contact_requests').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
    ]);

    if (totalResult.error || todayResult.error || weekResult.error) {
      console.error('Failed to fetch admin dashboard stats:', totalResult.error || todayResult.error || weekResult.error);
      return NextResponse.json({ success: false, error: 'Failed to load dashboard statistics.' }, { status: 500 });
    }

    stats = {
      total: totalResult.count ?? 0,
      today: todayResult.count ?? 0,
      week: weekResult.count ?? 0,
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
}
