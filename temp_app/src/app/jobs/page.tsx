"use client";
import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import JobListItem from '../components/JobListItem';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { useToast } from '../layout';
import { getJobs } from '../actions/jobActions';

function JobsContent() {
  const searchParams = useSearchParams();
  const showToast = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [filters, setFilters] = useState({
    job_type: [] as string[],
    work_mode: [] as string[],
  });

  const fetchJobs = useCallback(
    async (kw: string, loc: string, f: typeof filters) => {
      setLoading(true);
      const data = await getJobs({
        query: kw,
        location: loc,
        job_type: f.job_type.length > 0 ? f.job_type[0] : null,
        work_mode: f.work_mode.length > 0 ? f.work_mode[0] : null,
        status: 'published',
      });
      setJobs(data);
      setLoading(false);
    },
    [],
  );

  // Initial load + react to URL changes coming from the home-page search bar
  useEffect(() => {
    const kw = searchParams.get('query') || '';
    const loc = searchParams.get('location') || '';
    setKeyword(kw);
    setLocation(loc);
    fetchJobs(kw, loc, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleFilterChange = (type: 'job_type' | 'work_mode', value: string) => {
    setFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const applyFilters = () => {
    fetchJobs(keyword, location, filters);
    showToast('Filters applied ✅');
  };

  return (
    <div>
      <div className="phero">
        <h1>Find Your Dream Job</h1>
        <p>Browse thousands of opportunities from top companies</p>
        <SearchBar
          defaultKeyword={keyword}
          defaultLocation={location}
          onSearch={({ keyword: kw, location: loc }) => {
            setKeyword(kw);
            setLocation(loc);
            fetchJobs(kw, loc, filters);
          }}
        />
      </div>

      <div className="jlayout">
        <aside className="fbox">
          <h3>🎛 Filters</h3>
          <div className="fg-group">
            <h4>Job Type</h4>
            {[
              ['full-time', 'Full-time'],
              ['part-time', 'Part-time'],
              ['internship', 'Internship'],
              ['government', 'Government'],
            ].map(([val, label]) => (
              <div className="ci" key={val}>
                <input
                  type="checkbox"
                  id={`jt-${val}`}
                  checked={filters.job_type.includes(val)}
                  onChange={() => handleFilterChange('job_type', val)}
                />
                <label htmlFor={`jt-${val}`}>{label}</label>
              </div>
            ))}
          </div>

          <div className="fg-group">
            <h4>Work Mode</h4>
            {[
              ['onsite', 'On-site'],
              ['remote', 'Remote'],
              ['hybrid', 'Hybrid'],
            ].map(([val, label]) => (
              <div className="ci" key={val}>
                <input
                  type="checkbox"
                  id={`wm-${val}`}
                  checked={filters.work_mode.includes(val)}
                  onChange={() => handleFilterChange('work_mode', val)}
                />
                <label htmlFor={`wm-${val}`}>{label}</label>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '.3rem' }} onClick={applyFilters}>
            Apply Filters
          </button>
        </aside>

        <div>
          <div className="show-row">
            <span>
              Showing <strong>{jobs.length} jobs</strong>
            </span>
            <select>
              <option>Newest First</option>
              <option>Most Relevant</option>
            </select>
          </div>
          <div className="jlist">
            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length > 0 ? (
              jobs.map((job: any) => <JobListItem key={job.id} job={job} />)
            ) : (
              <p>No jobs found matching your criteria.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="section"><p>Loading…</p></div>}>
      <JobsContent />
    </Suspense>
  );
}
