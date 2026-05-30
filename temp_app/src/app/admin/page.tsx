"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useToast } from '../layout';
import { getAllUsers, updateUserRole } from '../actions/userActions';
import { getJobs, createJob, editJob, deleteJob, reviewJob } from '../actions/jobActions';
import { getBlogs, createBlog, editBlog, deleteBlog, updateBlog } from '../actions/blogActions';

type View = 'dashboard' | 'jobs' | 'blogs' | 'users';

const statusClass = (status: string) =>
  status === 'published' ? 'pg' : status === 'pending' ? 'py' : status === 'rejected' ? 'pr' : 'pm';

const roleLabel: Record<string, string> = {
  admin: '⚙️ Admin',
  recruiter: '🏢 Recruiter',
  job_seeker: '👤 Job Seeker',
};

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [jobFilter, setJobFilter] = useState<'all' | 'pending' | 'published' | 'draft' | 'rejected'>('all');
  const [blogFilter, setBlogFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'recruiter' | 'job_seeker'>('all');

  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const showToast = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [u, j, b] = await Promise.all([getAllUsers(), getJobs(), getBlogs()]);
    setUsers(u);
    setJobs(j);
    setBlogs(b);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // reset search when switching views
  const switchView = (v: View) => {
    setActiveView(v);
    setQuery('');
  };

  // ---- derived stats ----
  const stats = useMemo(() => ({
    totalJobs: jobs.length,
    published: jobs.filter((j) => j.status === 'published').length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    draft: jobs.filter((j) => j.status === 'draft').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
    totalUsers: users.length,
    recruiters: users.filter((u) => u.role === 'recruiter').length,
    seekers: users.filter((u) => u.role === 'job_seeker').length,
    admins: users.filter((u) => u.role === 'admin').length,
    publishedBlogs: blogs.filter((b) => b.status === 'published').length,
  }), [jobs, users, blogs]);

  // ---- filtered lists ----
  const q = query.trim().toLowerCase();
  const jobsFiltered = jobs.filter(
    (j) =>
      (jobFilter === 'all' || j.status === jobFilter) &&
      (!q || `${j.title} ${j.company_name} ${j.city} ${j.state}`.toLowerCase().includes(q)),
  );
  const blogsFiltered = blogs.filter(
    (b) =>
      (blogFilter === 'all' || b.status === blogFilter) &&
      (!q || `${b.title} ${b.category} ${b.author}`.toLowerCase().includes(q)),
  );
  const usersFiltered = users.filter(
    (u) =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      (!q || `${u.name} ${u.email}`.toLowerCase().includes(q)),
  );

  // ---- handlers ----
  const handleSubmitJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = editingJob ? await editJob(editingJob.id, formData) : await createJob(formData);
    if (result.success) {
      showToast(result.warning ? result.warning : editingJob ? 'Job updated ✅' : 'Job published! ✅');
      setJobModalOpen(false);
      setEditingJob(null);
      fetchData();
    } else {
      showToast(`Error: ${result.error} ❌`);
    }
  };

  const handleSubmitBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = editingBlog ? await editBlog(editingBlog.id, formData) : await createBlog(formData);
    if (result.success) {
      showToast(result.warning ? result.warning : editingBlog ? 'Blog updated ✅' : 'Blog created! ✅');
      setBlogModalOpen(false);
      setEditingBlog(null);
      fetchData();
    } else {
      showToast(`Error: ${result.error} ❌`);
    }
  };

  const handleReviewJob = async (id: string, decision: 'approve' | 'reject') => {
    const result = await reviewJob(id, decision);
    if (result.success) {
      showToast(decision === 'approve' ? 'Job approved & published ✅' : 'Job rejected ❌');
      fetchData();
    } else {
      showToast(`Error: ${result.error} ❌`);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job permanently?')) return;
    const r = await deleteJob(id);
    if (r.success) { showToast('Job deleted 🗑️'); fetchData(); } else showToast(`Error: ${r.error} ❌`);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Delete this blog permanently?')) return;
    const r = await deleteBlog(id);
    if (r.success) { showToast('Blog deleted 🗑️'); fetchData(); } else showToast(`Error: ${r.error} ❌`);
  };

  const handleToggleBlog = async (b: any) => {
    const next = b.status === 'published' ? 'draft' : 'published';
    const r = await updateBlog(b.id, { status: next });
    if (r.success) { showToast(next === 'published' ? 'Blog published ✅' : 'Moved to draft 💾'); fetchData(); }
    else showToast(`Error: ${r.error} ❌`);
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const r = await updateUserRole(userId, role);
    if (r.success) { showToast('Role updated ✅'); fetchData(); } else showToast(`Error: ${r.error} ❌`);
  };

  const openCreateJob = () => { setEditingJob(null); setJobModalOpen(true); };
  const openEditJob = (j: any) => { setEditingJob(j); setJobModalOpen(true); };
  const openCreateBlog = () => { setEditingBlog(null); setBlogModalOpen(true); };
  const openEditBlog = (b: any) => { setEditingBlog(b); setBlogModalOpen(true); };

  return (
    <div className="awrap">
      <aside className="asidebar">
        <h3>Main Menu</h3>
        <div className={`si ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => switchView('dashboard')}>📊 Dashboard</div>
        <div className={`si ${activeView === 'jobs' ? 'active' : ''}`} onClick={() => switchView('jobs')}>
          💼 Job Listings {stats.pending > 0 && <span className="pill py" style={{ marginLeft: 6, fontSize: '.66rem' }}>{stats.pending}</span>}
        </div>
        <div className={`si ${activeView === 'blogs' ? 'active' : ''}`} onClick={() => switchView('blogs')}>📝 Career Tips</div>
        <div className={`si ${activeView === 'users' ? 'active' : ''}`} onClick={() => switchView('users')}>👥 Users</div>

        <h3>System</h3>
        <div className="si" onClick={fetchData}>🔄 Refresh Data</div>
        <Link href="/" style={{ textDecoration: 'none' }}><div className="si">🚪 Exit Admin</div></Link>
      </aside>

      <main className="amain">
        {loading ? (
          <p>Loading admin data…</p>
        ) : (
          <>
            {/* ===================== DASHBOARD ===================== */}
            {activeView === 'dashboard' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.2rem' }}>Dashboard Overview</h2>
                <div className="krow">
                  <div className="kpi" style={{ cursor: 'pointer' }} onClick={() => switchView('jobs')}><div className="kv">{stats.totalJobs}</div><div className="kl">Total Jobs</div></div>
                  <div className="kpi"><div className="kv">{stats.published}</div><div className="kl">Published Jobs</div></div>
                  <div
                    className="kpi"
                    style={stats.pending > 0 ? { cursor: 'pointer', borderColor: '#ca8a04' } : { cursor: 'pointer' }}
                    onClick={() => { setJobFilter('pending'); switchView('jobs'); }}
                  >
                    <div className="kv" style={{ color: stats.pending > 0 ? '#ca8a04' : undefined }}>{stats.pending}</div>
                    <div className="kl">Pending Review</div>
                  </div>
                  <div className="kpi" style={{ cursor: 'pointer' }} onClick={() => switchView('users')}><div className="kv">{stats.totalUsers}</div><div className="kl">Total Users</div></div>
                  <div className="kpi"><div className="kv">{stats.recruiters}</div><div className="kl">Recruiters</div></div>
                  <div className="kpi"><div className="kv">{stats.seekers}</div><div className="kl">Job Seekers</div></div>
                  <div className="kpi" style={{ cursor: 'pointer' }} onClick={() => switchView('blogs')}><div className="kv">{stats.publishedBlogs}</div><div className="kl">Published Tips</div></div>
                </div>

                {stats.pending > 0 && (
                  <div className="atable" style={{ marginBottom: '1.5rem' }}>
                    <div className="atable-h"><h3>⏳ Awaiting Your Review</h3></div>
                    <table>
                      <thead><tr><th>Job Title</th><th>Company</th><th>Location</th><th>Action</th></tr></thead>
                      <tbody>
                        {jobs.filter((j) => j.status === 'pending').map((j) => (
                          <tr key={j.id}>
                            <td>{j.title}</td>
                            <td>{j.company_name}</td>
                            <td>{j.city}{j.state ? `, ${j.state}` : ''}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '.4rem' }}>
                                <button className="btn btn-primary btn-sm" onClick={() => handleReviewJob(j.id, 'approve')}>Accept</button>
                                <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }} onClick={() => handleReviewJob(j.id, 'reject')}>Reject</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="atable">
                  <div className="atable-h"><h3>Recent Joiners</h3></div>
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                    <tbody>
                      {users.slice(0, 8).map((u) => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td><span className={`pill ${u.role === 'admin' ? 'pg' : u.role === 'recruiter' ? 'py' : 'pm'}`}>{u.role}</span></td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================== JOBS ===================== */}
            {activeView === 'jobs' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Job Listings</h2>
                  <button className="btn btn-primary" onClick={openCreateJob}>+ Post New Job</button>
                </div>

                <div className="atoolbar">
                  <input className="ainput" placeholder="Search by title, company or location…" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <div className="afilters">
                    {(['all', 'pending', 'published', 'draft', 'rejected'] as const).map((f) => (
                      <button key={f} className={`achip ${jobFilter === f ? 'active' : ''}`} onClick={() => setJobFilter(f)}>
                        {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
                        {f !== 'all' && ` (${jobs.filter((j) => j.status === f).length})`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="atable">
                  <table>
                    <thead><tr><th>Job Title</th><th>Company</th><th>Location</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {jobsFiltered.map((j) => (
                        <tr key={j.id}>
                          <td><Link href={`/jobs/${j.id}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>{j.title}</Link></td>
                          <td>{j.company_name}</td>
                          <td>{j.city}{j.state ? `, ${j.state}` : ''}</td>
                          <td>{j.job_type}</td>
                          <td><span className={`pill ${statusClass(j.status)}`}>{j.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                              {j.status === 'pending' && (
                                <>
                                  <button className="btn btn-primary btn-sm" onClick={() => handleReviewJob(j.id, 'approve')}>Accept</button>
                                  <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }} onClick={() => handleReviewJob(j.id, 'reject')}>Reject</button>
                                </>
                              )}
                              {j.status === 'rejected' && (
                                <button className="btn btn-primary btn-sm" onClick={() => handleReviewJob(j.id, 'approve')}>Approve</button>
                              )}
                              <button className="btn btn-outline btn-sm" onClick={() => openEditJob(j)}>Edit</button>
                              <button className="btn btn-outline btn-sm" onClick={() => handleDeleteJob(j.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {jobsFiltered.length === 0 && <div className="aempty">No jobs match your filters.</div>}
                </div>
              </div>
            )}

            {/* ===================== BLOGS ===================== */}
            {activeView === 'blogs' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Career Tips / Blogs</h2>
                  <button className="btn btn-primary" onClick={openCreateBlog}>+ Write Blog</button>
                </div>

                <div className="atoolbar">
                  <input className="ainput" placeholder="Search by title, category or author…" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <div className="afilters">
                    {(['all', 'published', 'draft'] as const).map((f) => (
                      <button key={f} className={`achip ${blogFilter === f ? 'active' : ''}`} onClick={() => setBlogFilter(f)}>
                        {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="atable">
                  <table>
                    <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {blogsFiltered.map((b) => (
                        <tr key={b.id}>
                          <td>{b.title}</td>
                          <td>{b.category}</td>
                          <td>{b.author}</td>
                          <td><span className={`pill ${b.status === 'published' ? 'pg' : 'pm'}`}>{b.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                              <button className="btn btn-outline btn-sm" onClick={() => handleToggleBlog(b)}>
                                {b.status === 'published' ? 'Unpublish' : 'Publish'}
                              </button>
                              <button className="btn btn-outline btn-sm" onClick={() => openEditBlog(b)}>Edit</button>
                              <button className="btn btn-outline btn-sm" onClick={() => handleDeleteBlog(b.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {blogsFiltered.length === 0 && <div className="aempty">No blogs match your filters.</div>}
                </div>
              </div>
            )}

            {/* ===================== USERS ===================== */}
            {activeView === 'users' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>User Management</h2>
                  <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{stats.totalUsers} users · {stats.admins} admin · {stats.recruiters} recruiter · {stats.seekers} seeker</span>
                </div>

                <div className="atoolbar">
                  <input className="ainput" placeholder="Search by name or email…" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <div className="afilters">
                    {(['all', 'admin', 'recruiter', 'job_seeker'] as const).map((f) => (
                      <button key={f} className={`achip ${roleFilter === f ? 'active' : ''}`} onClick={() => setRoleFilter(f)}>
                        {f === 'all' ? 'All' : f === 'job_seeker' ? 'Job Seeker' : f[0].toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="atable">
                  <table>
                    <thead><tr><th>User</th><th>Email</th><th>Company / Type</th><th>Joined</th><th>Role</th></tr></thead>
                    <tbody>
                      {usersFiltered.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="auser">
                              <div className="auser-av" style={u.avatar ? { backgroundImage: `url(${u.avatar})` } : undefined}>
                                {!u.avatar && (u.name?.[0]?.toUpperCase() || '👤')}
                              </div>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>{u.company_name || u.account_type || '—'}</td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td>
                            <select className="arole-select" value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                              <option value="job_seeker">Job Seeker</option>
                              <option value="recruiter">Recruiter</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {usersFiltered.length === 0 && <div className="aempty">No users match your filters.</div>}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ===================== JOB MODAL (create / edit) ===================== */}
      <div className={`mbg ${jobModalOpen ? 'open' : ''}`}>
        <div className="mbox">
          <form onSubmit={handleSubmitJob} key={editingJob?.id || 'new-job'}>
            <div className="mhead">
              <h2>{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button type="button" className="xbtn" onClick={() => { setJobModalOpen(false); setEditingJob(null); }}>×</button>
            </div>
            <div className="mfg"><label>Job Title</label><input name="title" type="text" defaultValue={editingJob?.title || ''} placeholder="e.g. Software Engineer" required /></div>
            <div className="mfg"><label>Company Name</label><input name="company_name" type="text" defaultValue={editingJob?.company_name || ''} placeholder="e.g. Infosys" required /></div>
            <div className="mfg"><label>Company Logo {editingJob && '(leave empty to keep current)'}</label><input name="logo" type="file" accept="image/*" /></div>
            <div className="mfg2">
              <div className="mfg"><label>State</label>
                <select name="state" defaultValue={editingJob?.state || 'Pan India'} required>
                  <option value="Pan India">Pan India</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div className="mfg"><label>City</label><input name="city" type="text" defaultValue={editingJob?.city || ''} placeholder="Mumbai" required /></div>
            </div>
            <div className="mfg2">
              <div className="mfg"><label>Job Type</label>
                <select name="job_type" defaultValue={editingJob?.job_type || 'full-time'} required>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="government">Government</option>
                </select>
              </div>
              <div className="mfg"><label>Work Mode</label>
                <select name="work_mode" defaultValue={editingJob?.work_mode || 'onsite'} required>
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="mfg"><label>Salary</label><input name="salary" type="text" defaultValue={editingJob?.salary || ''} placeholder="₹8L – ₹14L/yr" /></div>
            <div className="mfg"><label>Job Description</label><textarea name="description" defaultValue={editingJob?.description || ''} placeholder="Role, responsibilities..."></textarea></div>
            <div className="mfg"><label>Last Date to Apply</label><input name="last_date" type="date" defaultValue={editingJob?.last_date || ''} /></div>
            <div className="mfg"><label>Application Link (optional)</label><input name="apply_link" type="url" defaultValue={editingJob?.apply_link || ''} placeholder="https://company.com/careers or Google Form link" /></div>
            <div className="mfg"><label>Contact Email (fallback if no link)</label><input name="apply_email" type="email" defaultValue={editingJob?.apply_email || ''} placeholder="recruiter@company.com" /></div>

            {editingJob ? (
              <>
                <div className="mfg"><label>Status</label>
                  <select name="status" defaultValue={editingJob.status}>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending review</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button type="submit" name="status" value="draft" className="btn btn-outline" style={{ flex: 1 }}>Save Draft</button>
                <button type="submit" name="status" value="published" className="btn btn-primary" style={{ flex: 1 }}>Publish Job</button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ===================== BLOG MODAL (create / edit) ===================== */}
      <div className={`mbg ${blogModalOpen ? 'open' : ''}`}>
        <div className="mbox">
          <form onSubmit={handleSubmitBlog} key={editingBlog?.id || 'new-blog'}>
            <div className="mhead">
              <h2>{editingBlog ? 'Edit Blog' : 'Write New Blog'}</h2>
              <button type="button" className="xbtn" onClick={() => { setBlogModalOpen(false); setEditingBlog(null); }}>×</button>
            </div>
            <div className="mfg"><label>Title</label><input name="title" type="text" defaultValue={editingBlog?.title || ''} placeholder="Blog headline…" required /></div>
            <div className="mfg"><label>Thumbnail {editingBlog && '(leave empty to keep current)'}</label><input name="thumbnail" type="file" accept="image/*" /></div>
            <div className="mfg2">
              <div className="mfg"><label>Category</label>
                <select name="category" defaultValue={editingBlog?.category || 'resume writing'} required>
                  <option value="resume writing">Resume Writing</option>
                  <option value="fresher guidance">Fresher Guidance</option>
                  <option value="skill development">Skill Development</option>
                  <option value="best courses">Best Courses</option>
                  <option value="interview preparation">Interview Prep</option>
                  <option value="salary tips">Salary Tips</option>
                  <option value="govt jobs">Govt Jobs</option>
                </select>
              </div>
              <div className="mfg"><label>Author</label><input name="author" type="text" defaultValue={editingBlog?.author || ''} placeholder="Author name" required /></div>
            </div>
            <div className="mfg"><label>Content</label><textarea name="content" defaultValue={editingBlog?.content || ''} placeholder="Write your article…" style={{ minHeight: '130px' }} required></textarea></div>

            {editingBlog ? (
              <>
                <div className="mfg"><label>Status</label>
                  <select name="status" defaultValue={editingBlog.status}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button type="submit" name="status" value="draft" className="btn btn-outline" style={{ flex: 1 }}>Save Draft</button>
                <button type="submit" name="status" value="published" className="btn btn-primary" style={{ flex: 1 }}>Publish</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
