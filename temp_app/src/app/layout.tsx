"use client";
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useState, useContext, ReactNode } from 'react';

// Toast Context for global notifications
const ToastContext = createContext<(msg: string) => void>(() => { });

export const useToast = () => useContext(ToastContext);

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  return (
    <html lang="en">
      <body>
        <ToastContext.Provider value={triggerToast}>
          {/* NAV */}
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
                <Link className="btn btn-ghost" href="/login">🔐 Login</Link>
                <Link className="btn btn-primary" href="/signup">Get Started</Link>
                <Link className="btn btn-sm" href="/admin" style={{ background: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '.8rem', padding: '8px 13px' }}>
                  ⚙️ Admin
                </Link>
              </div>
            </div>
          </nav>

          {/* MAIN CONTENT */}
          {children}

          {/* GLOBAL TOAST */}
          <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
        </ToastContext.Provider>
      </body>
    </html>
  );
}