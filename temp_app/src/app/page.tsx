import Link from 'next/link';
import Footer from './components/Footer';
import { getRecentJobs } from './actions/jobActions';
import { getRecentBlogs } from './actions/blogActions';
import JobCard from './components/JobCard';
import BlogCard from './components/BlogCard';
import SearchBar from './components/SearchBar';

export default async function Home() {
  const jobs = await getRecentJobs();
  const blogs = await getRecentBlogs();

  return (
    <div>
      <div className="hero-gradient">
        <h1>Your Career Journey<br />Starts Here</h1>
        <p>Discover thousands of job opportunities and get expert career guidance — all in one place.</p>
        <SearchBar />
        <div className="hero-stats">
          <div className="hero-stat"><div className="num">10K+</div><div className="lbl">Active Jobs</div></div>
          <div className="hero-stat"><div className="num">2K+</div><div className="lbl">Companies</div></div>
          <div className="hero-stat"><div className="num">50K+</div><div className="lbl">Career Tips</div></div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="section">
        <div className="sec-head">
          <div><h2>Featured Jobs</h2><p>Discover your next career opportunity</p></div>
          <Link className="view-all" href="/jobs">View All Jobs →</Link>
        </div>
        <div className="jobs-grid">
          {jobs.length > 0 ? (
            jobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <p>No featured jobs at the moment. Check back later!</p>
          )}
        </div>
      </div>

      {/* Career Tips */}
      <div className="section">
        <div className="sec-head">
          <div><h2>Career Tips & Insights</h2><p>Expert advice to accelerate your career</p></div>
          <Link className="view-all" href="/tips">Read More →</Link>
        </div>
        <div className="bg3">
          {blogs.length > 0 ? (
            blogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p>No career tips found.</p>
          )}
        </div>
      </div>

      {/* Recruiter CTA */}
      <div className="recruiter">
        <h2>Are You a Recruiter?</h2>
        <p>Post your job openings and find the best talent from our pool of qualified candidates.</p>
        <div className="rf-grid">
          <div className="rfi">
            <div className="rfi-icon">👥</div>
            <div><h4>Reach thousands of qualified candidates</h4><p>Access our growing pool of verified job seekers.</p></div>
          </div>
          <div className="rfi">
            <div className="rfi-icon">📋</div>
            <div><h4>Manage applications with ease</h4><p>Powerful dashboard to track and filter applicants.</p></div>
          </div>
          <div className="rfi">
            <div className="rfi-icon">🎯</div>
            <div><h4>Target the right talent for your roles</h4><p>Advanced filters to find the perfect match.</p></div>
          </div>
        </div>
        <Link href="/signup?role=recruiter" className="btn btn-white btn-lg" style={{ textDecoration: 'none' }}>Start Hiring Today</Link>
      </div>

      {/* Post Job Free */}
      <div className="section" style={{ background: '#fff' }}>
        <div className="sec-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '.3rem' }}>
          <h2>Post Your First Job Free</h2>
        </div>
        <div className="how3">
          <div className="hw"><div className="hwnum">1</div><h3>Create Account</h3><p>Sign up as a recruiter in minutes</p></div>
          <div className="hw"><div className="hwnum">2</div><h3>Post Your Job</h3><p>Fill in job details (takes 2 minutes)</p></div>
          <div className="hw"><div className="hwnum">3</div><h3>Find Talent</h3><p>Review applications and hire the best</p></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}