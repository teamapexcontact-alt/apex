import type { Metadata } from 'next';
import '@/components/admin/admin.css';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Admin Login',
  description: 'Sign in to the ApeX Studio admin dashboard.',
  path: '/admin/login',
  noIndex: true,
});

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
