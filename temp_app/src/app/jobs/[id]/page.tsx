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

  const location = `${job.city}${job.state ? `, ${job.state}` : ''}`;
  const applyHint = job.apply_link
    ? 'Clicking Apply opens the company application link in a new tab.'
    : job.apply_email
    ? `Clicking Apply lets you email the recruiter${job.apply_email ? ` (${job.apply_email})` : ''}.`
    : 'Use the Apply button to start your application.';

  return (
    <>
      <div className="jd-page">
        <Link href="/jobs" className="jd-back">← Back to jobs</Link>

        {/* HEADER */}
        <div className="jd-header">
          <div className="jd-header-main">
            <div className="jd-logo">
              {job.company_logo ? <img src={job.company_logo} alt={job.company_name} /> : '🏢'}
            </div>
            <div className="jd-header-info">
              <h1 className="jd-title">{job.title}</h1>
              <div className="jd-company">{job.company_name}</div>
              <div className="jd-chips">
                <span className="jd-chip">📍 {location}</span>
                <span className="jd-chip">💼 {job.job_type}</span>
                <span className="jd-chip">🏢 {job.work_mode}</span>
                <span className="jd-chip">🕓 Posted {timeAgo(job.created_at)}</span>
              </div>
            </div>
          </div>
          <div className="jd-cta">
            {job.salary && <div className="jd-salary">💰 {job.salary}</div>}
            <JobActions job={job} size="lg" />
          </div>
        </div>

        {/* BODY */}
        <div className="jd-grid">
          <main className="jd-main">
            <div className="jd-highlights">
              <div className="jd-hl">
                <div className="jd-hl-ico">💼</div>
                <div><div className="jd-hl-k">Job Type</div><div className="jd-hl-v">{job.job_type}</div></div>
              </div>
              <div className="jd-hl">
                <div className="jd-hl-ico">🏢</div>
                <div><div className="jd-hl-k">Work Mode</div><div className="jd-hl-v">{job.work_mode}</div></div>
              </div>
              <div className="jd-hl">
                <div className="jd-hl-ico">📍</div>
                <div><div className="jd-hl-k">Location</div><div className="jd-hl-v">{location}</div></div>
              </div>
              <div className="jd-hl">
                <div className="jd-hl-ico">💰</div>
                <div><div className="jd-hl-k">Salary</div><div className="jd-hl-v">{job.salary || 'Not disclosed'}</div></div>
              </div>
            </div>

            <div className="jd-card">
              <h3 className="jd-h">Job Description</h3>
              <p className="jd-desc">{job.description || 'No description provided for this role.'}</p>
            </div>

            <div className="jd-card">
              <h3 className="jd-h">Role at a glance</h3>
              <p className="jd-desc">
                {job.company_name} is hiring a {job.title} ({job.job_type}, {job.work_mode}) based in {location}.
                {job.salary ? ` Offered compensation: ${job.salary}.` : ''}
                {job.last_date ? ` Applications close on ${new Date(job.last_date).toLocaleDateString()}.` : ''}
              </p>
            </div>
          </main>

          {/* SIDEBAR */}
          <aside className="jd-side">
            <div className="jd-apply">
              <div className="jd-apply-h">Interested in this role?</div>
              <p className="jd-apply-sub">{applyHint}</p>
              <JobActions job={job} size="lg" />
              {job.last_date && (
                <div className="jd-deadline">⏳ Apply by {new Date(job.last_date).toLocaleDateString()}</div>
              )}
            </div>

            <div className="jd-card">
              <h3 className="jd-h">Job Summary</h3>
              <div className="jd-srow"><span className="k">Role</span><span className="v">{job.title}</span></div>
              <div className="jd-srow"><span className="k">Company</span><span className="v">{job.company_name}</span></div>
              <div className="jd-srow"><span className="k">Job Type</span><span className="v">{job.job_type}</span></div>
              <div className="jd-srow"><span className="k">Work Mode</span><span className="v">{job.work_mode}</span></div>
              <div className="jd-srow"><span className="k">Location</span><span className="v">{location}</span></div>
              {job.salary && <div className="jd-srow"><span className="k">Salary</span><span className="v">{job.salary}</span></div>}
              {job.last_date && (
                <div className="jd-srow"><span className="k">Apply by</span><span className="v">{new Date(job.last_date).toLocaleDateString()}</span></div>
              )}
              <div className="jd-srow"><span className="k">Posted</span><span className="v">{timeAgo(job.created_at)}</span></div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
