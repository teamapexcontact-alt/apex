'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '@/components/admin/admin.css';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create session.');
      }

      router.refresh();
      router.push('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-bg" aria-hidden />
      <div className="admin-bg__glow admin-bg__glow--a" aria-hidden />
      <div className="admin-bg__glow admin-bg__glow--b" aria-hidden />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="admin-fade-up">
          <div className="admin-card" style={{ padding: '2rem 1.75rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div className="admin-brand__mark" style={{ width: 52, height: 52, margin: '0 auto 1rem', fontSize: '1.3rem' }}>A</div>
              <h1 className="admin-modal__title" style={{ fontSize: '1.5rem', marginBottom: 4 }}>Welcome back</h1>
              <div className="admin-card__sub">ApeX Digital Studio · Admin Panel</div>
            </div>

            {error && (
              <div className="admin-error">
                <i className="ti ti-alert-triangle" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space-mono), monospace', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-search__input"
                  style={{ paddingLeft: 14, paddingRight: 14 }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space-mono), monospace', marginBottom: 6 }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-search__input"
                  style={{ paddingLeft: 14, paddingRight: 14 }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn--primary"
                style={{ height: 44, justifyContent: 'center', marginTop: 8 }}
              >
                {loading ? (
                  <>
                    <i className="ti ti-loader" style={{ animation: 'admin-pulse 1s linear infinite' }} /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In <i className="ti ti-arrow-right" />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <Link href="/" className="admin-card__sub" style={{ textDecoration: 'none' }}>
                ← Back to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
