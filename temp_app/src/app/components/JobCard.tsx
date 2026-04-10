"use client";
import { useToast } from '../layout';
import { toggleSaveItem } from '../actions/saveActions';
import { useState } from 'react';

export default function JobCard({ job, isList }: { job: any, isList?: boolean }) {
  const showToast = useToast();
  const [isSaved, setIsSaved] = useState(false); // This should ideally come from initial data or a hook

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await toggleSaveItem(job.id, 'job');
    if (result.success) {
      setIsSaved(result.saved || false);
      showToast(result.saved ? 'Job Saved 🔖' : 'Job Unsaved 🗑️');
    } else {
      showToast('Login to save jobs! 🔐');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company_name}`,
      url: window.location.origin + '/jobs/' + job.id
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard! 📋');
      } catch (err) {
        showToast('Failed to copy link ❌');
      }
    }
  };

  const isNew = new Date(job.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  if (isList) {
    return (
      <div className="jrow">
        <div className="jrow-logo">
            {job.company_logo ? <img src={job.company_logo} alt={job.company_name} style={{ width: '40px', height: '40px', borderRadius: '8px' }} /> : '🏢'}
        </div>
        <div className="jrow-info">
          <div className="jtop">
            <h3>{job.title}</h3>
            {isNew && <span className="badge-new">New</span>}
          </div>
          <div className="co">{job.company_name}</div>
          <div className="meta-row">
            <span className="meta-t">📍 {job.city}, {job.state}</span>
            <span className="meta-t">💼 {job.job_type}</span>
            <span className="meta-t" style={{ color: '#22c55e', fontWeight: 600 }}>{job.salary}</span>
          </div>
        </div>
        <div className="jrow-btns" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-primary btn-sm" onClick={() => showToast('Redirecting to apply... 🚀')}>Apply Now</button>
          <button className="btn btn-sm" style={{ background: 'var(--light)', color: 'var(--muted)', border: '1px solid var(--border)' }} onClick={handleSave}>
            {isSaved ? 'Saved 🔖' : 'Save'}
          </button>
          <button className="btn btn-sm btn-outline" onClick={handleShare}>Share</button>
        </div>
      </div>
    );
  }

  return (
    <div className="jcard">
      <div className="jc-top">
        <div className="jc-logo">
            {job.company_logo ? <img src={job.company_logo} alt={job.company_name} style={{ width: '40px', height: '40px', borderRadius: '8px' }} /> : '🏢'}
        </div>
        {isNew && <span className="badge-new">New</span>}
      </div>
      <h3>{job.title}</h3>
      <div className="co">{job.company_name}</div>
      <div className="meta-row">
        <span className="meta-t">📍 {job.city}</span>
        <span className="meta-t">💼 {job.job_type}</span>
      </div>
      <div className="sal">{job.salary}</div>
      <div className="jcard-actions">
        <button className="btn btn-primary btn-sm" onClick={() => showToast('Redirecting... 🚀')}>Apply Now</button>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button className="btn-save" onClick={handleSave}>{isSaved ? '🔖' : 'Save'}</button>
            <button className="btn-save" onClick={handleShare}>📤</button>
        </div>
      </div>
    </div>
  );
}