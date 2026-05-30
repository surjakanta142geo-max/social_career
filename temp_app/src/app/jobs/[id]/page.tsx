import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobById } from '../../actions/jobActions';
import JobActions from '../../components/JobActions';
import Footer from '../../components/Footer';
import { timeAgo } from '@/utils/format';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) return { title: 'Job not found · Social Career' };
  return {
    title: `${job.title} at ${job.company_name} · Social Career`,
    description: (job.description || '').slice(0, 150),
  };
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) notFound();

  return (
    <>
      <div className="jd-wrap">
        <div className="jd-main">
          <Link href="/jobs" className="jd-back">← Back to jobs</Link>

          <div className="jd-card">
            <div className="jd-head">
              <div className="jd-logo">
                {job.company_logo ? <img src={job.company_logo} alt={job.company_name} /> : '🏢'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="jd-title">{job.title}</h1>
                <div className="jd-company">{job.company_name}</div>
              </div>
            </div>

            <div className="jd-meta">
              <span>📍 {job.city}{job.state ? `, ${job.state}` : ''}</span>
              <span>💼 {job.job_type}</span>
              <span>🏢 {job.work_mode}</span>
              {job.salary && <span style={{ color: 'var(--green)', fontWeight: 600 }}>💰 {job.salary}</span>}
            </div>

            <div className="jd-actions">
              <JobActions job={job} size="lg" />
            </div>

            <div className="jd-section">
              <h3>Job Description</h3>
              <p className="jd-desc">{job.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>

        <aside className="jd-side">
          <div className="jd-card">
            <h3 style={{ marginBottom: '10px' }}>Job Summary</h3>
            <div className="jd-srow"><span className="k">Role</span><span className="v">{job.title}</span></div>
            <div className="jd-srow"><span className="k">Company</span><span className="v">{job.company_name}</span></div>
            <div className="jd-srow"><span className="k">Job Type</span><span className="v">{job.job_type}</span></div>
            <div className="jd-srow"><span className="k">Work Mode</span><span className="v">{job.work_mode}</span></div>
            <div className="jd-srow"><span className="k">Location</span><span className="v">{job.city}{job.state ? `, ${job.state}` : ''}</span></div>
            {job.salary && <div className="jd-srow"><span className="k">Salary</span><span className="v">{job.salary}</span></div>}
            {job.last_date && (
              <div className="jd-srow">
                <span className="k">Apply by</span>
                <span className="v">{new Date(job.last_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="jd-srow"><span className="k">Posted</span><span className="v">{timeAgo(job.created_at)}</span></div>
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}
