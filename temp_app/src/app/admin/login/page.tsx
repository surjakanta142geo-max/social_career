"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '../../layout';
import { login } from '../../actions/authActions';
import { createClient } from '@/utils/supabase/client';

export default function AdminLogin() {
  const router = useRouter();
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // If already signed in as an admin, skip the form and go straight in.
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') {
          router.replace('/admin');
          return;
        }
      }
      setChecking(false);
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result: any = await login(formData);
      if (result?.error) {
        showToast(`Error: ${result.error} ❌`);
      } else if (result?.role === 'admin') {
        showToast('Welcome, admin 🛡️');
        router.push('/admin');
      } else {
        showToast('This account does not have admin access ⛔');
      }
    } catch {
      showToast('An unexpected error occurred ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-wrap">
      <div className="admin-auth-card">
        <div className="admin-auth-badge">🛡️</div>
        <h2>Admin Portal</h2>
        <p className="admin-auth-sub">Restricted access — administrators only</p>

        {checking ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem 0' }}>Checking session…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-fg">
              <label>Email</label>
              <input name="email" type="email" placeholder="admin@socialcareer.in" required />
            </div>
            <div className="admin-fg">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="admin-auth-btn">
              {loading ? 'Signing in…' : 'Sign In to Admin'}
            </button>
          </form>
        )}

        <div className="admin-auth-foot">
          <Link href="/">← Back to site</Link>
          <Link href="/login">User login</Link>
        </div>
      </div>
    </div>
  );
}
