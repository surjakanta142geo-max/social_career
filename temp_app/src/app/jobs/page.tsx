"use client";
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import { useToast } from '../layout';
import { useState, useEffect } from 'react';
import { getJobs } from '../actions/jobActions';

export default function JobsPage() {
  const showToast = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    job_type: [] as string[],
    work_mode: [] as string[],
  });

  const fetchJobs = async () => {
    setLoading(true);
    const data = await getJobs({
        query: searchQuery,
        job_type: filters.job_type.length > 0 ? filters.job_type[0] : null, // Simplification for now
        work_mode: filters.work_mode.length > 0 ? filters.work_mode[0] : null,
    });
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (type: 'job_type' | 'work_mode', value: string) => {
    setFilters(prev => {
        const current = prev[type];
        const updated = current.includes(value) 
            ? current.filter(v => v !== value) 
            : [...current, value];
        return { ...prev, [type]: updated };
    });
  };

  const applyFilters = () => {
    fetchJobs();
    showToast('Filters applied ✅');
  };

  return (
    <div>
      <div className="phero">
        <h1>Find Your Dream Job</h1>
        <p>Browse thousands of opportunities from top companies</p>
        <div className="sbar">
          <span style={{ padding: '0 4px 0 8px', color: '#94a3b8' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Job title or keyword…" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" style={{ borderRadius: '8px' }} onClick={fetchJobs}>🔍 Search Jobs</button>
        </div>
      </div>

      <div className="jlayout">
        <aside className="fbox">
          <h3>🎛 Filters</h3>
          <div className="fg-group">
            <h4>Job Type</h4>
            <div className="ci">
                <input type="checkbox" id="f1" onChange={() => handleFilterChange('job_type', 'full-time')} />
                <label htmlFor="f1">Full-time</label>
            </div>
            <div className="ci">
                <input type="checkbox" id="f2" onChange={() => handleFilterChange('job_type', 'part-time')} />
                <label htmlFor="f2">Part-time</label>
            </div>
            <div className="ci">
                <input type="checkbox" id="f4" onChange={() => handleFilterChange('job_type', 'internship')} />
                <label htmlFor="f4">Internship</label>
            </div>
            <div className="ci">
                <input type="checkbox" id="f5" onChange={() => handleFilterChange('job_type', 'government')} />
                <label htmlFor="f5">Government</label>
            </div>
          </div>

          <div className="fg-group">
            <h4>Work Mode</h4>
            <div className="ci">
                <input type="checkbox" id="wm1" onChange={() => handleFilterChange('work_mode', 'onsite')} />
                <label htmlFor="wm1">On-site</label>
            </div>
            <div className="ci">
                <input type="checkbox" id="wm2" onChange={() => handleFilterChange('work_mode', 'remote')} />
                <label htmlFor="wm2">Remote</label>
            </div>
            <div className="ci">
                <input type="checkbox" id="wm3" onChange={() => handleFilterChange('work_mode', 'hybrid')} />
                <label htmlFor="wm3">Hybrid</label>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '.3rem' }} onClick={applyFilters}>Apply Filters</button>
        </aside>

        <div>
          <div className="show-row">
            <span>Showing <strong>{jobs.length} jobs</strong></span>
            <select><option>Newest First</option><option>Most Relevant</option></select>
          </div>
          <div className="jlist">
            {loading ? (
                <p>Loading jobs...</p>
            ) : jobs.length > 0 ? (
                jobs.map((job: any) => (
                    <JobCard key={job.id} job={job} isList={true} />
                ))
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