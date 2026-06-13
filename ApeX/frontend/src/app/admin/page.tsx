import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { protectAdminRoute } from '@/lib/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { generatePageMetadata } from '@/lib/seo';
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

  return <AdminDashboard />;
}
