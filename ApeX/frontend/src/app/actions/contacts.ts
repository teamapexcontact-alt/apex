'use server';

import { supabaseAdmin } from '@/lib/server/supabase-server';
import { protectAdminRoute } from '@/lib/auth';
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
    const auth = await protectAdminRoute();
    if (!auth.authorized) {
      throw new Error('Unauthorized');
    }

    const client = supabaseAdmin;
    if (!client) throw new Error('Supabase admin client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.');

    let query = client
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1); // Fetch one extra to determine if there are more results

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) throw error;

    const submissions = data || [];
    const hasMore = submissions.length > limit;
    const nextCursor = hasMore ? submissions[limit - 1]?.created_at || null : null;

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

// Legacy function for backward compatibility (fetches records with hard limit for performance)
// ⚠️ DEPRECATED: Use getContactSubmissions() with cursor-based pagination instead
// This function now enforces a hard limit of 1000 records to prevent memory exhaustion
export async function getAllContactSubmissions() {
  try {
    const auth = await protectAdminRoute();
    if (!auth.authorized) {
      throw new Error('Unauthorized');
    }

    const client = supabaseAdmin;
    if (!client) throw new Error('Supabase admin client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.');

    const HARD_LIMIT = 1000; // Safety limit to prevent unbounded queries

    const { data, error } = await client
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(HARD_LIMIT);

    if (error) throw error;
    
    if (data && data.length === HARD_LIMIT) {
      console.warn(
        `getAllContactSubmissions() reached hard limit of ${HARD_LIMIT} records. ` +
        'Use getContactSubmissions() with cursor-based pagination for better performance.'
      );
    }

    return { success: true, data, _note: 'Use cursor-based pagination for large datasets' };
  } catch (error: unknown) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: 'Failed to retrieve contact submissions.' };
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    const auth = await protectAdminRoute();
    if (!auth.authorized) {
      throw new Error('Unauthorized');
    }

    const client = supabaseAdmin;
    if (!client) throw new Error('Supabase admin client not configured.');

    const { error } = await client
      .from('contact_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
    const auth = await protectAdminRoute();
    if (!auth.authorized) {
      throw new Error('Unauthorized');
    }

    const client = supabaseAdmin;
    if (!client) throw new Error('Supabase admin client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.');

    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const submissionsQuery = client
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    const [submissionsResult, totalResult, todayResult, weekResult] = await Promise.all([
      submissionsQuery,
      client
        .from('contact_requests')
        .select('id', { count: 'exact', head: true }),
      client
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString()),
      client
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
    ]);

    if (submissionsResult.error) throw submissionsResult.error;
    if (totalResult.error) throw totalResult.error;
    if (todayResult.error) throw todayResult.error;
    if (weekResult.error) throw weekResult.error;

    const submissions = submissionsResult.data || [];
    const hasMore = submissions.length > limit;
    const nextCursor = hasMore ? submissions[limit - 1]?.created_at || null : null;

    // Remove the extra record if we fetched more than the limit
    const paginatedSubmissions = hasMore ? submissions.slice(0, limit) : submissions;

    return {
      success: true,
      data: {
        submissions: paginatedSubmissions,
        pagination: {
          nextCursor,
          hasMore,
        },
        stats: {
          total: totalResult.count ?? 0,
          today: todayResult.count ?? 0,
          week: weekResult.count ?? 0,
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
    const auth = await protectAdminRoute();
    if (!auth.authorized) {
      throw new Error('Unauthorized');
    }

    const client = supabaseAdmin;
    if (!client) throw new Error('Supabase admin client not configured.');

    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    // Use count queries instead of fetching all records
    const [totalResult, todayResult, weekResult] = await Promise.all([
      client
        .from('contact_requests')
        .select('id', { count: 'exact', head: true }),
      client
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString()),
      client
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
    ]);

    if (totalResult.error) throw totalResult.error;
    if (todayResult.error) throw todayResult.error;
    if (weekResult.error) throw weekResult.error;

    return {
      success: true,
      data: {
        total: totalResult.count ?? 0,
        today: todayResult.count ?? 0,
        week: weekResult.count ?? 0,
      },
    };
  } catch (error: unknown) {
    console.error('Error fetching stats:', error);
    return { success: false, error: 'Failed to load contact request statistics.' };
  }
}
