"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '../layout';
import { getRecentJoiners } from '../actions/userActions';
import { getJobs, createJob, deleteJob, updateJob } from '../actions/jobActions';
import { getBlogs, createBlog, deleteBlog, updateBlog } from '../actions/blogActions';
import { fileToDataUrl } from '@/utils/files/toDataUrl';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isJobModalOpen, setJobModalOpen] = useState(false);
  const [isBlogModalOpen, setBlogModalOpen] = useState(false);
  
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const showToast = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [u, j, b] = await Promise.all([
      getRecentJoiners(),
      getJobs(),
      getBlogs()
    ]);
    setUsers(u);
    setJobs(j);
    setBlogs(b);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = (e.currentTarget.elements.namedItem('logo') as HTMLInputElement).files?.[0];
    let logoUrl = '';
    if (file) {
        logoUrl = await fileToDataUrl(file);
    }
    const result = await createJob(formData, logoUrl);
    if (result.success) {
        showToast('Job created! ✅');
        setJobModalOpen(false);
        fetchData();
    } else {
        showToast(`Error: ${result.error} ❌`);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = (e.currentTarget.elements.namedItem('thumbnail') as HTMLInputElement).files?.[0];
    let thumbnailUrl = '';
    if (file) {
        thumbnailUrl = await fileToDataUrl(file);
    }
    const result = await createBlog(formData, thumbnailUrl);
    if (result.success) {
        showToast('Blog created! ✅');
        setBlogModalOpen(false);
        fetchData();
    } else {
        showToast(`Error: ${result.error} ❌`);
    }
  };

  return (
    <div className="awrap">
      <aside className="asidebar">
        <h3>Main Menu</h3>
        <div className={`si ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>📊 Dashboard</div>
        <div className={`si ${activeView === 'jobs' ? 'active' : ''}`} onClick={() => setActiveView('jobs')}>💼 Job Listings</div>
        <div className={`si ${activeView === 'blogs' ? 'active' : ''}`} onClick={() => setActiveView('blogs')}>📝 Career Tips</div>
        <div className={`si ${activeView === 'users' ? 'active' : ''}`} onClick={() => setActiveView('users')}>👥 Users</div>

        <h3>System</h3>
        <Link href="/" style={{ textDecoration: 'none' }}><div className="si" style={{ marginTop: '1rem' }}>🚪 Exit Admin</div></Link>
      </aside>

      <main className="amain">
        {activeView === 'dashboard' && (
          <div>
            <div className="krow">
              <div className="kpi"><div className="kv">{jobs.length}</div><div className="kl">Active Jobs</div></div>
              <div className="kpi"><div className="kv">{users.length}</div><div className="kl">Recent Joiners</div></div>
              <div className="kpi"><div className="kv">{blogs.length}</div><div className="kl">Blog Posts</div></div>
            </div>
            <div className="atable">
              <div className="atable-h"><h3>Recent Joiners</h3></div>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`pill ${u.role === 'admin' ? 'pg' : 'py'}`}>{u.role}</span></td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
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
                  {jobs.map(j => (
                    <tr key={j.id}>
                      <td>{j.title}</td>
                      <td>{j.company_name}</td>
                      <td>{j.state}</td>
                      <td>{j.job_type}</td>
                      <td><span className={`pill ${j.status === 'published' ? 'pg' : 'pm'}`}>{j.status}</span></td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => deleteJob(j.id).then(fetchData)}>Delete</button>
                      </td>
                    </tr>
                  ))}
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
                  {blogs.map(b => (
                    <tr key={b.id}>
                      <td>{b.title}</td>
                      <td>{b.category}</td>
                      <td>{b.author}</td>
                      <td><span className={`pill ${b.status === 'published' ? 'pg' : 'pm'}`}>{b.status}</span></td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => deleteBlog(b.id).then(fetchData)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <div className={`mbg ${isJobModalOpen ? 'open' : ''}`}>
        <div className="mbox">
          <form onSubmit={handleCreateJob}>
            <div className="mhead"><h2>Post New Job</h2><button type="button" className="xbtn" onClick={() => setJobModalOpen(false)}>×</button></div>
            <div className="mfg"><label>Job Title</label><input name="title" type="text" placeholder="e.g. Software Engineer" required /></div>
            <div className="mfg"><label>Company Name</label><input name="company_name" type="text" placeholder="e.g. Infosys" required /></div>
            <div className="mfg"><label>Company Logo</label><input name="logo" type="file" accept="image/*" /></div>
            <div className="mfg2">
              <div className="mfg"><label>State</label>
                <select name="state" required>
                    <option value="Pan India">Pan India</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div className="mfg"><label>City</label><input name="city" type="text" placeholder="Mumbai" required /></div>
            </div>
            <div className="mfg2">
              <div className="mfg"><label>Job Type</label>
                <select name="job_type" required>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="government">Government</option>
                </select>
              </div>
              <div className="mfg"><label>Work Mode</label>
                <select name="work_mode" required>
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="mfg"><label>Salary</label><input name="salary" type="text" placeholder="₹8L – ₹14L/yr" /></div>
            <div className="mfg"><label>Job Description</label><textarea name="description" placeholder="Role, responsibilities..."></textarea></div>
            <div className="mfg"><label>Last Date to Apply</label><input name="last_date" type="date" /></div>
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <button type="submit" name="status" value="draft" className="btn btn-outline" style={{ flex: 1 }}>Save Draft</button>
              <button type="submit" name="status" value="published" className="btn btn-primary" style={{ flex: 1 }}>Publish Job</button>
            </div>
          </form>
        </div>
      </div>

      <div className={`mbg ${isBlogModalOpen ? 'open' : ''}`}>
        <div className="mbox">
          <form onSubmit={handleCreateBlog}>
            <div className="mhead"><h2>Write New Blog</h2><button type="button" className="xbtn" onClick={() => setBlogModalOpen(false)}>×</button></div>
            <div className="mfg"><label>Title</label><input name="title" type="text" placeholder="Blog headline…" required /></div>
            <div className="mfg"><label>Thumbnail</label><input name="thumbnail" type="file" accept="image/*" /></div>
            <div className="mfg2">
              <div className="mfg"><label>Category</label>
                <select name="category" required>
                    <option value="resume writing">Resume Writing</option>
                    <option value="fresher guidance">Fresher Guidance</option>
                    <option value="skill development">Skill Development</option>
                    <option value="best courses">Best Courses</option>
                    <option value="interview preparation">Interview Prep</option>
                </select>
              </div>
              <div className="mfg"><label>Author</label><input name="author" type="text" placeholder="Author name" required /></div>
            </div>
            <div className="mfg"><label>Content</label><textarea name="content" placeholder="Write your article…" style={{ minHeight: '130px' }} required></textarea></div>
            <div style={{ display: 'flex', gap: '.6rem' }}>
                <button type="submit" name="status" value="draft" className="btn btn-outline" style={{ flex: 1 }}>Save Draft</button>
                <button type="submit" name="status" value="published" className="btn btn-primary" style={{ flex: 1 }}>Publish</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
