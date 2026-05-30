"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { buildJobsHref } from '@/utils/search';

type Props = {
  /** Seed values (e.g. when landing on /jobs from a query string) */
  defaultKeyword?: string;
  defaultLocation?: string;
  defaultExperience?: string;
  /**
   * "jobs"   -> keyword + experience + location (naukri.com style, used on home & jobs)
   * "simple" -> single keyword field (used on tips / articles)
   */
  variant?: 'jobs' | 'simple';
  /** Placeholder for the keyword field */
  placeholder?: string;
  /**
   * If provided, called on search instead of navigating to /jobs.
   * Used by pages that filter their own data client-side (jobs, tips).
   */
  onSearch?: (params: { keyword: string; location: string; experience: string }) => void;
};

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Experience' },
  { value: '0', label: 'Fresher (0 yrs)' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-6', label: '3-6 years' },
  { value: '6-10', label: '6-10 years' },
  { value: '10+', label: '10+ years' },
];

export default function SearchBar({
  defaultKeyword = '',
  defaultLocation = '',
  defaultExperience = '',
  variant = 'jobs',
  placeholder = 'Enter skills / designations / companies',
  onSearch,
}: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [location, setLocation] = useState(defaultLocation);
  const [experience, setExperience] = useState(defaultExperience);

  const submit = () => {
    if (onSearch) {
      onSearch({ keyword: keyword.trim(), location: location.trim(), experience });
      return;
    }
    router.push(buildJobsHref({ keyword, location, experience }));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className={`nsearch ${variant === 'simple' ? 'nsearch-simple' : ''}`}>
      <div className="ns-field ns-keyword">
        <span className="ns-ico">🔍</span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search keyword"
        />
      </div>

      {variant === 'jobs' && (
        <>
          <span className="ns-divider" />
          <div className="ns-field ns-exp">
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              aria-label="Experience"
            >
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <span className="ns-divider" />
          <div className="ns-field ns-loc">
            <span className="ns-ico">📍</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter location"
              aria-label="Location"
            />
          </div>
        </>
      )}

      <button className="ns-btn" onClick={submit} type="button">Search</button>
    </div>
  );
}
