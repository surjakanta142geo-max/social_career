"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '../layout';
import { createClient } from '@/utils/supabase/client';
import { updateProfile } from '../actions/userActions';
import { getSavedItems } from '../actions/saveActions';
import { createJob, deleteJob } from '../actions/jobActions';
import JobCard from '../components/JobCard';
import BlogCard from '../components/BlogCard';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<any[]>([]);
  const [savedTab, setSavedTab] = useState<'jobs' | 'blogs'>('jobs');
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [isJobModalOpen, setJobModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const supabase = createClient();

  const isRecruiter = profile?.role === 'recruiter';

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);

    if (prof?.role === 'recruiter') {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      setMyJobs(jobs || []);
    } else {
      const [jobs, blogs] = await Promise.all([getSavedItems('job'), getSavedItems('blog')]);
      setSavedJobs(jobs);
      setSavedBlogs(blogs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    if (result.success) {
      showToast('Profile updated! ✅');
      fetchData();
    } else {
      showToast(`Error: ${result.error} ❌`);
    }
  };

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createJob(formData);
    if (result.success) {
      showToast('Job posted! ✅');
      setJobModalOpen(false);
      fetchData();
    } else {
      showToast(`Error: ${result.error} ❌`);
    }
  };

  const handleDeleteJob = async (id: string) => {
    const result = await deleteJob(id);
    if (result.success) {
      showToast('Job deleted 🗑️');
      fetchData();
    } else {
      showToast(`Error: ${result.error} ❌`);
    }
  };

  if (loading) return <div className="section"><p>Loading profile...</p></div>;
  if (!profile) return <div className="section"><p>Please login to view your profile.</p></div>;

  const publishedCount = myJobs.filter((j) => j.status === 'published').length;
  const draftCount = myJobs.length - publishedCount;

  return (
    <div className="section">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>{isRecruiter ? 'Recruiter Profile' : 'Your Profile'}</h2>
          <span className={`pill ${isRecruiter ? 'pg' : 'py'}`} style={{ textTransform: 'capitalize' }}>
            {isRecruiter ? '🏢 Recruiter' : profile.role === 'admin' ? '⚙️ Admin' : '👤 Job Seeker'}
          </span>
        </div>

        {/* PROFILE / COMPANY CARD */}
        <div className="atable" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  margin: '0 auto 1rem',
                  backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none',
                  backgroundSize: 'cover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}
              >
                {!profile.avatar && (isRecruiter ? '🏢' : '👤')}
              </div>
              <input type="file" name="avatar" accept="image/*" style={{ fontSize: '0.8rem' }} />
              <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--muted)' }}>✉️ {profile.email}</div>
            </div>

            <div style={{ flex: '2', minWidth: '300px' }}>
              <div className="mfg"><label>Full Name</label><input name="name" type="text" defaultValue={profile.name} required /></div>
              <div className="mfg"><label>Phone (Optional)</label><input name="phone" type="text" defaultValue={profile.phone} placeholder="+91 98765 43210" /></div>

              {isRecruiter && (
                <div className="mfg2">
                  <div className="mfg"><label>Company Name</label><input name="company_name" type="text" defaultValue={profile.company_name} placeholder="e.g. Infosys" /></div>
                  <div className="mfg"><label>Organization Name</label><input name="org_name" type="text" defaultValue={profile.org_name} placeholder="e.g. Global Tech Group" /></div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Profile</button>
            </div>
          </form>
        </div>

        {isRecruiter ? (
          /* ===== RECRUITER VIEW ===== */
          <>
            <div className="krow" style={{ marginBottom: '1.5rem' }}>
              <div className="kpi"><div className="kv">{myJobs.length}</div><div className="kl">Total Jobs</div></div>
              <div className="kpi"><div className="kv">{publishedCount}</div><div className="kl">Published</div></div>
              <div className="kpi"><div className="kv">{draftCount}</div><div className="kl">Drafts</div></div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0 }}>Your Job Postings</h3>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Link href="/recruiter" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>Open Dashboard →</Link>
                <button className="btn btn-primary btn-sm" onClick={() => setJobModalOpen(true)}>+ Post New Job</button>
              </div>
            </div>

            <div className="atable">
              <table>
                <thead><tr><th>Job Title</th><th>Location</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {myJobs.length > 0 ? (
                    myJobs.map((j) => (
                      <tr key={j.id}>
                        <td><Link href={`/jobs/${j.id}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>{j.title}</Link></td>
                        <td>{j.city}{j.state ? `, ${j.state}` : ''}</td>
                        <td>{j.job_type}</td>
                        <td><span className={`pill ${j.status === 'published' ? 'pg' : 'pm'}`}>{j.status}</span></td>
                        <td><button className="btn btn-outline btn-sm" onClick={() => handleDeleteJob(j.id)}>Delete</button></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} style={{ color: 'var(--muted)', padding: '1.2rem' }}>You haven&apos;t posted any jobs yet. Click “Post New Job” to get started.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* ===== JOB SEEKER VIEW ===== */
          <>
            <h3 style={{ marginBottom: '1rem' }}>Saved Content</h3>
            <div className="tab-tog" style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
              <button className={savedTab === 'jobs' ? 'active' : ''} onClick={() => setSavedTab('jobs')}>
                Saved Jobs ({savedJobs.length})
              </button>
              <button className={savedTab === 'blogs' ? 'active' : ''} onClick={() => setSavedTab('blogs')}>
                Saved Blogs ({savedBlogs.length})
              </button>
            </div>

            {savedTab === 'jobs' ? (
              <div className="jlist">
                {savedJobs.length > 0 ? (
                  savedJobs.map((job) => <JobCard key={job.id} job={job} isList={true} />)
                ) : (
                  <p style={{ color: 'var(--muted)' }}>No jobs saved yet.</p>
                )}
              </div>
            ) : (
              <div className="bg3">
                {savedBlogs.length > 0 ? (
                  savedBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
                ) : (
                  <p style={{ color: 'var(--muted)' }}>No blogs saved yet.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* POST NEW JOB MODAL (recruiter) */}
      {isRecruiter && (
        <div className={`mbg ${isJobModalOpen ? 'open' : ''}`}>
          <div className="mbox">
            <form onSubmit={handleCreateJob}>
              <div className="mhead"><h2>Post New Job</h2><button type="button" className="xbtn" onClick={() => setJobModalOpen(false)}>×</button></div>
              <div className="mfg"><label>Job Title</label><input name="title" type="text" placeholder="e.g. Software Engineer" required /></div>
              <div className="mfg"><label>Company Name</label><input name="company_name" type="text" defaultValue={profile.company_name || ''} placeholder="e.g. Infosys" required /></div>
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
              <div className="mfg"><label>Application Link (optional)</label><input name="apply_link" type="url" placeholder="https://company.com/careers or Google Form link" /></div>
              <div className="mfg"><label>Contact Email (fallback if no link)</label><input name="apply_email" type="email" placeholder="recruiter@company.com — defaults to your account email" /></div>
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button type="submit" name="status" value="draft" className="btn btn-outline" style={{ flex: 1 }}>Save Draft</button>
                <button type="submit" name="status" value="published" className="btn btn-primary" style={{ flex: 1 }}>Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
