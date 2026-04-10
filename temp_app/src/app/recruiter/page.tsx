"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '../layout';
import { getJobs, createJob, deleteJob, updateJob } from '../actions/jobActions';
import { fileToDataUrl } from '@/utils/files/toDataUrl';
import { createClient } from '@/utils/supabase/client';

export default function RecruiterDashboard() {
  const [activeView, setActiveView] = useState('jobs');
  const [isJobModalOpen, setJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch only recruiter's own jobs
    const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
    
    setJobs(data || []);
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

  return (
    <div className="awrap">
      <aside className="asidebar">
        <h3>Employer Menu</h3>
        <div className={`si ${activeView === 'jobs' ? 'active' : ''}`} onClick={() => setActiveView('jobs')}>💼 Job Postings</div>
        <div className={`si ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>🏢 Company Profile</div>
        <Link href="/" style={{ textDecoration: 'none' }}><div className="si" style={{ marginTop: '1rem' }}>🚪 Exit Dashboard</div></Link>
      </aside>

      <main className="amain">
        {activeView === 'jobs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Your Job Listings</h2>
              <button className="btn btn-primary" onClick={() => setJobModalOpen(true)}>+ Post New Job</button>
            </div>
            {loading ? <p>Loading your jobs...</p> : (
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
            )}
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
    </div>
  );
}
