"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../layout';
import { signup, login } from '../actions/authActions';

export default function Login() {
  const router = useRouter();
  const showToast = useToast();
  
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState('job_seeker');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('role', role);

    try {
        const result = activeTab === 'login' ? await login(formData) : await signup(formData);
        if (result?.error) {
            console.error('Login/Signup Error:', result.error);
            showToast(`Error: ${result.error} ❌`);
        } else {
            showToast(activeTab === 'login' ? 'Welcome back! 👋' : 'Account created! Welcome 🎉');
            router.push('/');
        }
    } catch (err: any) {
        showToast(`An unexpected error occurred. ❌`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <Link className="back-l" href="/">← Back to Home</Link>
      <div className="acard">
        <div className="alogo">💼</div>
        <h2>Welcome to Social Career</h2>
        <p className="sub">Sign in to access jobs, courses, and more</p>
        
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

        <form onSubmit={handleSubmit}>
          {activeTab === 'signup' && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '.83rem', fontWeight: '600', marginBottom: '.55rem' }}>I am a</p>
              <div className="role-g">
                <div className={`rbtn ${role === 'job_seeker' ? 'active' : ''}`} onClick={() => setRole('job_seeker')}>
                  <span className="ri">👤</span><span>Job Seeker</span>
                </div>
                <div className={`rbtn ${role === 'recruiter' ? 'active' : ''}`} onClick={() => setRole('recruiter')}>
                  <span className="ri">🏢</span><span>Recruiter</span>
                </div>
              </div>
              
              <div className="fg">
                <label>Full Name</label>
                <div className="iw"><span className="ii">👤</span><input name="name" type="text" placeholder="John Doe" required /></div>
              </div>

              {role === 'job_seeker' && (
                  <div className="fg">
                      <label>Account Type</label>
                      <div className="iw">
                          <select name="account_type" style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }} required>
                              <option value="fresher">Fresher</option>
                              <option value="experienced">Experienced</option>
                              <option value="student">Student</option>
                              <option value="professional">Professional</option>
                          </select>
                      </div>
                  </div>
              )}

              {role === 'recruiter' && (
                  <>
                      <div className="fg">
                          <label>Company Name</label>
                          <div className="iw"><span className="ii">🏢</span><input name="company_name" type="text" placeholder="TechCorp" required /></div>
                      </div>
                      <div className="fg">
                          <label>Organization Name</label>
                          <div className="iw"><span className="ii">🏛️</span><input name="org_name" type="text" placeholder="Global Tech Group" required /></div>
                      </div>
                  </>
              )}
            </div>
          )}

          <div className="fg">
            <label>Email</label>
            <div className="iw"><span className="ii">✉️</span><input name="email" type="email" placeholder="your@email.com" required /></div>
          </div>
          <div className="fg">
            <label>Password</label>
            <div className="iw">
              <span className="ii">🔒</span>
              <input name="password" type="password" placeholder="••••••••" required />
            </div>
            {activeTab === 'login' && (
              <div className="forgot-r"><Link href="#">Forgot password?</Link></div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '.2rem' }} 
          >
            {loading ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="terms-t">By continuing, you agree to our <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link></p>
      </div>
    </div>
  );
}