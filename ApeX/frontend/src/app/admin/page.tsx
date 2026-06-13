import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { protectAdminRoute } from '@/lib/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { generatePageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/seo';
import '@/components/admin/admin.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: 'Admin Dashboard',
  description: 'ApeX Studio admin dashboard.',
  path: '/admin',
  noIndex: true,
});

export default async function AdminPage() {
  const auth = await protectAdminRoute();

  if (!auth.authorized) {
    redirect(auth.redirect || '/admin/login');
  }

  const cookieStore = await cookies();
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : siteConfig.url;

  interface AdminContactResponse {
    success: boolean;
    data?: {
      submissions: Array<{
        id: string;
        name: string;
        email: string;
        phone?: string;
        company?: string;
        message: string;
        created_at: string;
      }>;
      pagination?: {
        nextCursor: string | null;
        hasMore: boolean;
      };
      stats: {
        total: number;
        today: number;
        week: number;
      };
    };
    error?: string;
  }

  let result: AdminContactResponse | null = null;
  let fetchError = '';

  try {
    const cookieHeader = cookieStore.get('__session')
      ? `__session=${cookieStore.get('__session')!.value}`
      : '';

    const response = await fetch(`${origin}/api/admin/contact?includeStats=true&limit=20`, {
      cache: 'no-store',
      headers: {
        cookie: cookieHeader,
        authorization: `Bearer ${cookieStore.get('__session')?.value || ''}`,
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = (await response.json()) as AdminContactResponse;
      } else {
        const text = await response.text();
        console.error('Invalid content type received:', contentType, text.slice(0, 100));
        fetchError = `Expected JSON but received content-type: ${contentType}`;
      }
    } else {
      const text = await response.text().catch(() => '');
      try {
        const errJson = JSON.parse(text) as { error?: string };
        fetchError = errJson.error || `HTTP error ${response.status}: ${response.statusText}`;
      } catch {
        fetchError = `HTTP error ${response.status}: ${response.statusText}`;
      }
    }
  } catch (err: unknown) {
    console.error('Error fetching admin dashboard data:', err);
    fetchError = err instanceof Error ? err.message : 'Network error fetching dashboard data.';
  }

  if (fetchError || !result || !result.success || !result.data) {
    console.error('Error fetching admin dashboard data:', fetchError || (result ? result.error : 'No data returned'));
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep px-4">
        <div className="max-w-xl w-full rounded-3xl bg-bg-elevated border border-white/10 p-10 text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Admin Dashboard</h1>
          <p className="text-text-muted mb-6">
            There was a problem loading contact submissions. Please check the server logs or your Firebase configuration.
          </p>
          <p className="text-sm text-text-muted">{fetchError || (result ? result.error : 'Unknown error occurred.')}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      initialSubmissions={result.data.submissions}
      initialNextCursor={result.data.pagination?.nextCursor || null}
      initialHasMore={result.data.pagination?.hasMore || false}
      stats={result.data.stats}
    />
  );
}
