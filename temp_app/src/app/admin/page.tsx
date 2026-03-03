"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '../layout';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isJobModalOpen, setJobModalOpen] = useState(false);
  const [isBlogModalOpen, setBlogModalOpen] = useState(false);
  const [isCourseModalOpen, setCourseModalOpen] = useState(false);
  const showToast = useToast();

  const handleAction = (msg: string, setter?: (state: boolean) => void) => {
    showToast(msg);
    if (setter) setter(false);
  };

  return (
    <div className="awrap">
      <aside className="asidebar">
        <h3>Main Menu</h3>
        <div className={`si ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>📊 Dashboard</div>
        <div className={`si ${activeView === 'jobs' ? 'active' : ''}`} onClick={() => setActiveView('jobs')}>💼 Job Listings</div>
        <div className={`si ${activeView === 'blogs' ? 'active' : ''}`} onClick={() => setActiveView('blogs')}>📝 Career Tips</div>
        <div className={`si ${activeView === 'courses' ? 'active' : ''}`} onClick={() => setActiveView('courses')}>🎓 Courses</div>
        <div className={`si ${activeView === 'users' ? 'active' : ''}`} onClick={() => setActiveView('users')}>👥 Users</div>

        <h3>System</h3>
        <div className={`si ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>⚙️ Settings</div>
        <Link href="/" style={{ textDecoration: 'none' }}><div className="si" style={{ marginTop: '1rem' }}>🚪 Exit Admin</div></Link>
      </aside>

      <main className="amain">
        {activeView === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Dashboard</h2>
              <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Welcome back, Admin 👋</span>
            </div>
            <div className="krow">
              <div className="kpi"><div className="kv">284</div><div className="kl">Active Jobs</div><div className="ku">↑ 12 this week</div></div>
              <div className="kpi"><div className="kv">12,847</div><div className="kl">Registered Users</div><div className="ku">↑ 342 this week</div></div>
              <div className="kpi"><div className="kv">18</div><div className="kl">Blog Posts</div><div className="ku">↑ 3 this week</div></div>
              <div className="kpi"><div className="kv">6</div><div className="kl">Courses</div><div className="ku">Launch pending</div></div>
            </div>
            <div className="atable">
              <div className="atable-h"><h3>Recent Applications</h3></div>
              <table>
                <thead><tr><th>Applicant</th><th>Job Title</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Amit Patel</td><td>Full Stack Developer</td><td>Today, 10:32am</td><td><span className="pill pg">Under Review</span></td></tr>
                  <tr><td>Sneha Gupta</td><td>Banking Officer PO</td><td>Today, 9:14am</td><td><span className="pill py">Shortlisted</span></td></tr>
                  <tr><td>Vikram Singh</td><td>UX Designer</td><td>Yesterday</td><td><span className="pill pg">Under Review</span></td></tr>
                  <tr><td>Pooja Mehta</td><td>School Teacher TGT</td><td>Yesterday</td><td><span className="pill pm">Pending</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'jobs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Job Listings</h2>
              <button className="btn btn-primary" onClick={() => setJobModalOpen(true)}>+ Post New Job</button>
            </div>
            <div className="atable">
              <table>
                <thead><tr><th>Job Title</th><th>Company</th><th>State</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  <tr><td>Full Stack Developer</td><td>Infosys BPM</td><td>Maharashtra</td><td>Full-time</td><td><span className="pill pg">Active</span></td><td><button className="btn btn-outline btn-sm" onClick={() => showToast('Editing…')}>Edit</button></td></tr>
                  <tr><td>Banking PO 2024</td><td>PNB</td><td>Pan India</td><td>Government</td><td><span className="pill pg">Active</span></td><td><button className="btn btn-outline btn-sm" onClick={() => showToast('Editing…')}>Edit</button></td></tr>
                  <tr><td>Android Developer</td><td>Swiggy Tech</td><td>Karnataka</td><td>Full-time</td><td><span className="pill pm">Draft</span></td><td><button className="btn btn-primary btn-sm" onClick={() => showToast('Published! ✅')}>Publish</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'blogs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Career Tips / Blogs</h2>
              <button className="btn btn-primary" onClick={() => setBlogModalOpen(true)}>+ Write Blog</button>
            </div>
            <div className="atable">
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  <tr><td>10 Resume Mistakes…</td><td>Resume Writing</td><td>Priya Sharma</td><td><span className="pill pg">Published</span></td><td><button className="btn btn-outline btn-sm" onClick={() => showToast('Editing…')}>Edit</button></td></tr>
                  <tr><td>SSC CGL 2024 Guide</td><td>Govt Jobs</td><td>Admin</td><td><span className="pill pm">Draft</span></td><td><button className="btn btn-primary btn-sm" onClick={() => showToast('Published! ✅')}>Publish</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'courses' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Courses</h2>
              <button className="btn btn-primary" onClick={() => setCourseModalOpen(true)}>+ Add Course</button>
            </div>
            <div className="atable">
              <table>
                <thead><tr><th>Course</th><th>Category</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  <tr><td>Python for Data Science</td><td>Programming</td><td>₹1,999</td><td><span className="pill py">Coming Soon</span></td><td><button className="btn btn-primary btn-sm" onClick={() => showToast('Launched! 🚀')}>Launch</button></td></tr>
                  <tr><td>Job Readiness Bootcamp</td><td>Job Readiness</td><td>FREE</td><td><span className="pill py">Coming Soon</span></td><td><button className="btn btn-primary btn-sm" onClick={() => showToast('Launched! 🚀')}>Launch</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'users' && (
          <div>
            <div style={{ marginBottom: '1.4rem' }}><h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>User Management</h2></div>
            <div className="atable">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Amit Patel</td><td>amit@email.com</td><td>Job Seeker</td><td>Jan 2024</td><td><span className="pill pg">Active</span></td></tr>
                  <tr><td>TechIndia HR</td><td>hr@techindia.com</td><td>Recruiter</td><td>Nov 2023</td><td><span className="pill pg">Active</span></td></tr>
                  <tr><td>Prof. Sharma</td><td>sharma@edu.in</td><td>Instructor</td><td>Dec 2023</td><td><span className="pill pg">Active</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div>
            <div style={{ marginBottom: '1.4rem' }}><h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Site Settings</h2></div>
            <div className="atable" style={{ padding: '1.4rem', maxWidth: '500px' }}>
              <div className="mfg"><label>Site Name</label><input type="text" defaultValue="Social Career" /></div>
              <div className="mfg"><label>Contact Email</label><input type="email" defaultValue="support@socialcareer.in" /></div>
              <div className="mfg"><label>Tagline</label><input type="text" defaultValue="India's Career Growth Platform" /></div>
              <div className="mfg"><label>Maintenance Mode</label><select><option>Off</option><option>On</option></select></div>
              <button className="btn btn-primary" onClick={() => showToast('Settings saved! ✅')}>Save Changes</button>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <div className={`mbg ${isJobModalOpen ? 'open' : ''}`}>
        <div className="mbox">
          <div className="mhead"><h2>Post New Job</h2><button className="xbtn" onClick={() => setJobModalOpen(false)}>×</button></div>
          <div className="mfg"><label>Job Title</label><input type="text" placeholder="e.g. Software Engineer – React" /></div>
          <div className="mfg"><label>Company Name</label><input type="text" placeholder="e.g. Infosys" /></div>
          <div className="mfg2"><div className="mfg"><label>State</label><select><option>Select State</option><option>Maharashtra</option><option>Karnataka</option><option>Delhi</option><option>Tamil Nadu</option><option>Gujarat</option><option>Pan India</option></select></div><div className="mfg"><label>City</label><input type="text" placeholder="Mumbai" /></div></div>
          <div className="mfg2"><div className="mfg"><label>Job Type</label><select><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Government</option></select></div><div className="mfg"><label>Work Mode</label><select><option>On-site</option><option>Remote</option><option>Hybrid</option></select></div></div>
          <div className="mfg"><label>Salary</label><input type="text" placeholder="₹8L – ₹14L/yr" /></div>
          <div className="mfg"><label>Job Description</label><textarea placeholder="Role, responsibilities, requirements…"></textarea></div>
          <div className="mfg"><label>Last Date to Apply</label><input type="date" /></div>
          <div style={{ display: 'flex', gap: '.6rem' }}><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleAction('Saved as draft 📝', setJobModalOpen)}>Save Draft</button><button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAction('Job published! ✅', setJobModalOpen)}>Publish Job</button></div>
        </div>
      </div>

      <div className={`mbg ${isBlogModalOpen ? 'open' : ''}`}>
        <div className="mbox">
          <div className="mhead"><h2>Write New Blog</h2><button className="xbtn" onClick={() => setBlogModalOpen(false)}>×</button></div>
          <div className="mfg"><label>Title</label><input type="text" placeholder="Blog headline…" /></div>
          <div className="mfg2"><div className="mfg"><label>Category</label><select><option>Interview Prep</option><option>Resume Writing</option><option>Salary Tips</option><option>Govt Jobs</option><option>Freshers</option></select></div><div className="mfg"><label>Author</label><input type="text" placeholder="Author name" /></div></div>
          <div className="mfg"><label>Content</label><textarea placeholder="Write your article…" style={{ minHeight: '130px' }}></textarea></div>
          <div style={{ display: 'flex', gap: '.6rem' }}><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleAction('Saved as draft 📝', setBlogModalOpen)}>Save Draft</button><button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAction('Blog published! ✅', setBlogModalOpen)}>Publish</button></div>
        </div>
      </div>

      <div className={`mbg ${isCourseModalOpen ? 'open' : ''}`}>
        <div className="mbox">
          <div className="mhead"><h2>Add New Course</h2><button className="xbtn" onClick={() => setCourseModalOpen(false)}>×</button></div>
          <div className="mfg"><label>Course Name</label><input type="text" placeholder="e.g. Python for Data Science" /></div>
          <div className="mfg2"><div className="mfg"><label>Category</label><select><option>Programming</option><option>Data Science</option><option>Design</option><option>Marketing</option><option>Business</option></select></div><div className="mfg"><label>Price (₹)</label><input type="number" placeholder="0 = free" /></div></div>
          <div className="mfg"><label>Description</label><textarea placeholder="What will learners gain?"></textarea></div>
          <div className="mfg2"><div className="mfg"><label>Launch Date</label><input type="date" /></div><div className="mfg"><label>Status</label><select><option>Coming Soon</option><option>Live</option><option>Draft</option></select></div></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleAction('Course saved! 🎓', setCourseModalOpen)}>Save Course</button>
        </div>
      </div>
    </div>
  );
}