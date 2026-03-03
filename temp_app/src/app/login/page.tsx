"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../layout';

export default function Login() {
  const router = useRouter();
  const showToast = useToast();
  
  // React State replacing the 'atab' JS function
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // React State replacing the 'setRole' JS function
  const [role, setRole] = useState('jobseeker'); 

  const handleAuth = () => {
    showToast(activeTab === 'login' ? 'Welcome back! 👋' : 'Account created! Welcome 🎉');
    router.push('/');
  };

  return (
    <div className="auth-wrap">
      <Link className="back-l" href="/">← Back to Home</Link>
      <div className="acard">
        <div className="alogo">💼</div>
        <h2>Welcome to Social Career</h2>
        <p className="sub">Sign in to access jobs, courses, and more</p>
        
        {/* Tabs */}
        <div className="tab-tog">
          <button 
            className={activeTab === 'login' ? 'active' : ''} 
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={activeTab === 'signup' ? 'active' : ''} 
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields Based on State */}
        {activeTab === 'signup' && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '.83rem', fontWeight: '600', marginBottom: '.55rem' }}>I am a</p>
            <div className="role-g">
              <div className={`rbtn ${role === 'jobseeker' ? 'active' : ''}`} onClick={() => setRole('jobseeker')}>
                <span className="ri">👤</span><span>Job Seeker</span>
              </div>
              <div className={`rbtn ${role === 'recruiter' ? 'active' : ''}`} onClick={() => setRole('recruiter')}>
                <span className="ri">🏢</span><span>Recruiter</span>
              </div>
              <div className={`rbtn ${role === 'instructor' ? 'active' : ''}`} onClick={() => setRole('instructor')}>
                <span className="ri">👨‍🏫</span><span>Instructor</span>
              </div>
            </div>
            
            <div className="fg">
              <label>Full Name</label>
              <div className="iw"><span className="ii">👤</span><input type="text" placeholder="John Doe" /></div>
            </div>
          </div>
        )}

        <div className="fg">
          <label>Email</label>
          <div className="iw"><span className="ii">✉️</span><input type="email" placeholder="your@email.com" /></div>
        </div>
        <div className="fg">
          <label>Password</label>
          <div className="iw">
            <span className="ii">🔒</span>
            <input type="password" placeholder="••••••••" />
            <button className="eye">👁</button>
          </div>
          {activeTab === 'login' && (
            <div className="forgot-r"><Link href="#">Forgot password?</Link></div>
          )}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', marginTop: '.2rem' }} 
          onClick={handleAuth}
        >
          {activeTab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
        <p className="terms-t">By continuing, you agree to our <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link></p>
      </div>
    </div>
  );
}