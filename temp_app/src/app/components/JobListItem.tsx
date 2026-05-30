"use client";
import Link from 'next/link';
import JobActions from './JobActions';
import { timeAgo } from '@/utils/format';

export default function JobListItem({ job }: { job: any }) {
  return (
    <Link href={`/jobs/${job.id}`} className="njob">
      <div className="njob-head">
        <div className="njob-logo">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company_name} />
          ) : (
            '🏢'
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="njob-title">{job.title}</div>
          <div className="njob-company">{job.company_name}</div>
        </div>
      </div>

      <div className="njob-meta">
        <span>💼 {job.job_type}</span>
        <span>🏢 {job.work_mode}</span>
        {job.salary && <span style={{ color: 'var(--green)', fontWeight: 600 }}>💰 {job.salary}</span>}
        <span>📍 {job.city}{job.state ? `, ${job.state}` : ''}</span>
      </div>

      {job.description && <p className="njob-desc">{job.description}</p>}

      <div className="njob-tags">
        <span className="njob-tag">{job.job_type}</span>
        <span className="njob-tag">{job.work_mode}</span>
        {job.last_date && (
          <span className="njob-tag">Apply by {new Date(job.last_date).toLocaleDateString()}</span>
        )}
      </div>

      <div className="njob-foot">
        <span className="njob-posted">🕓 Posted {timeAgo(job.created_at)}</span>
        <JobActions job={job} />
      </div>
    </Link>
  );
}
