import Link from 'next/link';
import Footer from './components/Footer';
import { getRecentJobs } from './actions/jobActions';
import { getRecentBlogs } from './actions/blogActions';
import JobCard from './components/JobCard';
import BlogCard from './components/BlogCard';

export default async function Home() {
  const jobs = await getRecentJobs();
  const blogs = await getRecentBlogs();

  return (
    <div>
      <div className="hero-gradient">
        <h1>Your Career Journey<br />Starts Here</h1>
        <p>Discover thousands of job opportunities, upskill with premium courses,<br />and get expert career guidance — all in one place.</p>
        <div className="search-hero">
          <span style={{ paddingLeft: '8px', color: '#94a3b8', fontSize: '.9rem' }}>🔍</span>
          <input type="text" placeholder="Search jobs, courses, or career tips…" />
          <button className="btn btn-primary" style={{ borderRadius: '8px' }}>Search</button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="num">10K+</div><div className="lbl">Active Jobs</div></div>
          <div className="hero-stat"><div className="num">500+</div><div className="lbl">Courses</div></div>
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

      {/* Popular Courses */}
      <div className="section" style={{ background: '#fff' }}>
        <div className="sec-head">
          <div><h2>Popular Courses</h2><p>Upskill with industry-leading instructors</p></div>
          <Link className="view-all" href="/courses">Explore All →</Link>
        </div>
        <div className="cg">
          <div className="ccard">
            <div className="cimg" style={{ background: 'linear-gradient(135deg,#1e3a5f,#0a1628)' }}>
              💻<span className="cb-badge cb-best">Bestseller</span><span className="cb-cat">Development</span>
            </div>
            <div className="cbody">
              <h3>Complete Web Development Bootcamp</h3>
              <div className="inst">John Doe</div>
              <div className="stars"><span className="rt">⭐ 4.8</span><span className="cnt">👥 15,420 · ⏱ 40 hrs</span></div>
              <div className="cfoot">
                <div className="price"><span className="cur">$99.99</span><span className="ori">$199.99</span></div>
                <button className="btn btn-primary btn-sm">Enroll</button>
              </div>
            </div>
          </div>
          <div className="ccard">
            <div className="cimg" style={{ background: 'linear-gradient(135deg,#1a2e1a,#0a1a0a)' }}>
              📊<span className="cb-badge cb-live">▶ Live</span><span className="cb-cat">Data Science</span>
            </div>
            <div className="cbody">
              <h3>Data Science with Python</h3>
              <div className="inst">Jane Smith</div>
              <div className="stars"><span className="rt">⭐ 4.9</span><span className="cnt">👥 12,350 · ⏱ 35 hrs</span></div>
              <div className="cfoot">
                <div className="price"><span className="cur">$89.99</span><span className="ori">$179.99</span></div>
                <button className="btn btn-primary btn-sm">Enroll</button>
              </div>
            </div>
          </div>
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