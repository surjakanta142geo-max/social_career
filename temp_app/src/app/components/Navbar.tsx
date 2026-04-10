'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/authActions'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav>
      <div className="nav-inner">
        <Link className="logo" href="/">
          <div className="logo-icon">💼</div>Social Career
        </Link>
        <Link className={`nl ${pathname === '/' ? 'active' : ''}`} href="/">🏠 Home</Link>
        <Link className={`nl ${pathname === '/jobs' ? 'active' : ''}`} href="/jobs">💼 Jobs</Link>
        <Link className={`nl ${pathname === '/courses' ? 'active' : ''}`} href="/courses">🎓 Courses</Link>
        <Link className={`nl ${pathname === '/tips' ? 'active' : ''}`} href="/tips">📖 Career Tips</Link>

        <div className="nav-right">
          {user ? (
            <>
              <Link className="nl" href="/profile">👤 {profile?.name || 'Profile'}</Link>
              {profile?.role === 'admin' && (
                <Link className="btn btn-sm" href="/admin" style={{ background: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '.8rem', padding: '8px 13px' }}>
                  ⚙️ Admin
                </Link>
              )}
              <button 
                onClick={() => logout()} 
                className="btn btn-ghost"
                style={{ cursor: 'pointer' }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" href="/login">🔐 Login</Link>
              <Link className="btn btn-primary" href="/signup">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
