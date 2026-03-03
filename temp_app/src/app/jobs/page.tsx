"use client";
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import { useToast } from '../layout';

export default function JobsPage() {
  const showToast = useToast();
  return (
    <div>
      <div className="phero">
        <h1>Find Your Dream Job</h1>
        <p>Browse thousands of opportunities from top companies</p>
        <div className="sbar">
          <span style={{ padding: '0 4px 0 8px', color: '#94a3b8' }}>🔍</span>
          <input type="text" placeholder="Job title or keyword…" />
          <span style={{ color: '#94a3b8', padding: '0 4px' }}>📍</span>
          <select>
            <option>Location</option>
            <option>Andhra Pradesh</option><option>Maharashtra</option><option>Delhi (NCT)</option><option>Remote / Pan India</option>
          </select>
          <button className="btn btn-primary" style={{ borderRadius: '8px' }}>🔍 Search Jobs</button>
        </div>
      </div>

      <div className="jlayout">
        <aside className="fbox">
          <h3>🎛 Filters</h3>
          <div className="fg-group">
            <h4>Job Type</h4>
            <div className="ci"><input type="checkbox" id="f1" /><label htmlFor="f1">Full-time</label></div>
            <div className="ci"><input type="checkbox" id="f2" /><label htmlFor="f2">Part-time</label></div>
            <div className="ci"><input type="checkbox" id="f3" /><label htmlFor="f3">Contract</label></div>
            <div className="ci"><input type="checkbox" id="f4" /><label htmlFor="f4">Internship</label></div>
            <div className="ci"><input type="checkbox" id="f5" /><label htmlFor="f5">Government</label></div>
          </div>
          <div className="fg-group">
            <h4>Experience Level</h4>
            <div className="ci"><input type="checkbox" id="e1" /><label htmlFor="e1">Entry Level</label></div>
            <div className="ci"><input type="checkbox" id="e2" /><label htmlFor="e2">Mid Level</label></div>
            <div className="ci"><input type="checkbox" id="e3" /><label htmlFor="e3">Senior</label></div>
            <div className="ci"><input type="checkbox" id="e4" /><label htmlFor="e4">Executive</label></div>
          </div>
          <div className="fg-group">
            <h4>Salary Range</h4>
            <select className="fsel">
              <option>Select range</option><option>₹0–₹3L/yr</option><option>₹3–₹6L/yr</option><option>₹6–₹12L/yr</option><option>₹12–₹25L/yr</option><option>₹25L+/yr</option>
            </select>
          </div>
          <div className="fg-group">
            <h4>Industry</h4>
            <select className="fsel">
              <option>All Industries</option><option>IT & Software</option><option>Banking & Finance</option><option>Healthcare</option><option>Education</option><option>Government/PSU</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '.3rem' }} onClick={() => showToast('Filters applied ✅')}>Apply Filters</button>
        </aside>

        <div>
          <div className="show-row">
            <span>Showing <strong>6 jobs</strong></span>
            <select><option>Newest First</option><option>Most Relevant</option><option>Salary: High–Low</option></select>
          </div>
          <div className="jlist">
            <JobCard
              isList={true} icon="🏢" title="Senior Software Engineer" company="TechCorp Inc."
              location="San Francisco, CA" type="Full-time" salary="$150K–$200K"
              skills={['React', 'Node.js', 'AWS']} isNew={true}
            />
            <JobCard
              isList={true} icon="🚀" title="Product Manager" company="StartupXYZ"
              location="New York, NY" type="Full-time" salary="$120K–$160K"
              skills={['Product', 'Agile', 'SaaS']} isNew={true}
            />
            <JobCard
              isList={true} icon="🎨" title="UX Designer" company="Design Studio"
              location="Remote" type="Contract" salary="$80K–$100K"
              skills={['Figma', 'UI/UX', 'Research']} isNew={false}
            />
            <JobCard
              isList={true} icon="📊" title="Data Analyst" company="DataDriven Co."
              location="Chicago, IL" type="Full-time" salary="$90K–$120K"
              skills={['Python', 'SQL', 'Tableau']} isNew={false}
            />
            <JobCard
              isList={true} icon="📢" title="Marketing Manager" company="BrandBuilders"
              location="Los Angeles, CA" type="Full-time" salary="$100K–$130K"
              skills={['SEO', 'Content', 'Analytics']} isNew={true}
            />
            <JobCard
              isList={true} icon="☁️" title="DevOps Engineer" company="CloudScale"
              location="Remote" type="Full-time" salary="$130K–$170K"
              skills={['Docker', 'Kubernetes', 'CI/CD']} isNew={false}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}