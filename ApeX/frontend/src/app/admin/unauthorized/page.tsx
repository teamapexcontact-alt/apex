import type { Metadata } from 'next';
import Link from 'next/link';
import '@/components/admin/admin.css';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Access Denied',
  description: 'You do not have permission to access the ApeX Studio admin dashboard.',
  path: '/admin/unauthorized',
  noIndex: true,
});

export default function Unauthorized() {
  return (
    <div className="admin-shell">
      <div className="admin-bg" aria-hidden />
      <div className="admin-bg__glow admin-bg__glow--a" aria-hidden />
      <div className="admin-bg__glow admin-bg__glow--b" aria-hidden />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 460 }} className="admin-fade-up">
          <div className="admin-card" style={{ padding: '2.25rem 1.75rem', textAlign: 'center' }}>
            <div
              style={{
                width: 72,
                height: 72,
                margin: '0 auto 1.25rem',
                borderRadius: 20,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(255, 107, 107, 0.08)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                color: '#ff6b6b',
                fontSize: '1.8rem',
                boxShadow: '0 0 24px rgba(255, 107, 107, 0.2)',
              }}
            >
              <i className="ti ti-shield-lock" />
            </div>
            <h1 className="admin-modal__title" style={{ fontSize: '1.5rem', marginBottom: 8 }}>Access Denied</h1>
            <p className="admin-card__sub" style={{ marginBottom: '1.5rem' }}>
              You don&apos;t have permission to access the admin dashboard.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/admin/login" className="admin-btn admin-btn--primary" style={{ height: 44, justifyContent: 'center' }}>
                <i className="ti ti-login" /> Try Login Again
              </Link>
              <Link href="/" className="admin-btn" style={{ height: 44, justifyContent: 'center' }}>
                <i className="ti ti-arrow-left" /> Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
