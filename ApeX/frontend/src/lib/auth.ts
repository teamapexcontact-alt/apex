import { createSupabaseServerClient } from '@/lib/server/supabase-server-auth';

// Check if user is authenticated
export async function getUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Check if user is admin by querying the `public.admins` table in Supabase.
// This is the single source of truth for admin authorization.
// The admins table is protected by RLS policies and is enforced at the database level.
export async function isAdmin(user?: { id?: string; email?: string } | null) {
  const currentUser = user ?? (await getUser());
  if (!currentUser || !currentUser.id) return false;

  try {
    const supabase = await createSupabaseServerClient();

    // Check if user exists in the admins table by user_id
    // This is the ONLY method of admin authorization
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', currentUser.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error checking admins table:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
}

// Protect admin routes - redirect if not authenticated or not admin
export async function protectAdminRoute() {
  const user = await getUser();
  if (!user) {
    return { authorized: false, redirect: '/admin/login' };
  }

  const admin = await isAdmin(user);
  if (!admin) {
    return { authorized: false, redirect: '/admin/unauthorized' };
  }

  return { authorized: true, user };
}

// Sign out
export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
