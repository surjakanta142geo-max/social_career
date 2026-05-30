"use client";
import { useState } from 'react';
import { useToast } from '../layout';
import { toggleSaveItem } from '../actions/saveActions';
import { resolveApplyTarget } from '@/utils/jobs';

export default function JobActions({
  job,
  initialSaved = false,
  size = 'sm',
}: {
  job: any;
  initialSaved?: boolean;
  size?: 'sm' | 'lg';
}) {
  const showToast = useToast();
  const [isSaved, setIsSaved] = useState(initialSaved);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleApply = (e: React.MouseEvent) => {
    stop(e);
    const target = resolveApplyTarget(job);
    if (target.type === 'link') {
      window.open(target.href, '_blank', 'noopener,noreferrer');
    } else if (target.type === 'email') {
      window.location.href = target.mailto;
    } else {
      showToast('No application method provided for this job. 🤷');
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    stop(e);
    const result = await toggleSaveItem(job.id, 'job');
    if (result.success) {
      setIsSaved(result.saved || false);
      showToast(result.saved ? 'Job Saved 🔖' : 'Job Unsaved 🗑️');
    } else {
      showToast('Login to save jobs! 🔐');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    stop(e);
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company_name}`,
      url: typeof window !== 'undefined' ? window.location.origin + '/jobs/' + job.id : '',
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user dismissed */
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard! 📋');
      } catch {
        showToast('Failed to copy link ❌');
      }
    }
  };

  const btn = size === 'lg' ? 'btn' : 'btn btn-sm';

  return (
    <div className="njob-actions">
      <button className={`btn btn-primary ${size === 'lg' ? '' : 'btn-sm'}`} onClick={handleApply}>
        Apply Now
      </button>
      <button
        className={`${btn} btn-outline`}
        onClick={handleSave}
      >
        {isSaved ? 'Saved 🔖' : 'Save'}
      </button>
      <button className={`${btn} btn-outline`} onClick={handleShare}>
        Share
      </button>
    </div>
  );
}
