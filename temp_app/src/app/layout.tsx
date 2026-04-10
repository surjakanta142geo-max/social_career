"use client";
import './globals.css';
import { createContext, useState, useContext, ReactNode } from 'react';

// Toast Context for global notifications
const ToastContext = createContext<(msg: string) => void>(() => { });

export const useToast = () => useContext(ToastContext);

import Navbar from './components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
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
          <Navbar />

          {/* MAIN CONTENT */}
          {children}

          {/* GLOBAL TOAST */}
          <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
        </ToastContext.Provider>
      </body>
    </html>
  );
}