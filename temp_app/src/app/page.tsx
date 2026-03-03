"use client";
import Link from 'next/link';
import { useToast } from './layout';
import Footer from './components/Footer';

export default function Home() {
  const showToast = useToast();

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
          <div className="jcard">
            <div className="jc-top"><div className="jc-logo">🏢</div><span className="badge-new">New</span></div>
            <h3>Senior Software Engineer</h3>
            <div className="co">TechCorp Inc.</div>
            <div className="meta-row"><span className="meta-t">📍 San Francisco, CA</span><span className="meta-t">💼 Full-time</span></div>
            <div className="sal">$150K – $200K</div>
            <div className="skills"><span className="stag">React</span><span className="stag">Node.js</span><span className="stag">AWS</span></div>
            <div className="jcard-actions">
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Applied! ✅')}>Apply Now</button>
              <button className="btn-save" onClick={() => showToast('Saved 🔖')}>Save</button>
            </div>
          </div>
          <div className="jcard">
            <div className="jc-top"><div className="jc-logo">🚀</div><span className="badge-new">New</span></div>
            <h3>Product Manager</h3>
            <div className="co">StartupXYZ</div>
            <div className="meta-row"><span className="meta-t">📍 New York, NY</span><span className="meta-t">💼 Full-time</span></div>
            <div className="sal">$120K – $160K</div>
            <div className="skills"><span className="stag">Product</span><span className="stag">Agile</span><span className="stag">SaaS</span></div>
            <div className="jcard-actions">
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Applied! ✅')}>Apply Now</button>
              <button className="btn-save" onClick={() => showToast('Saved 🔖')}>Save</button>
            </div>
          </div>
          <div className="jcard">
            <div className="jc-top"><div className="jc-logo">🎨</div></div>
            <h3>UX Designer</h3>
            <div className="co">Design Studio</div>
            <div className="meta-row"><span className="meta-t">📍 Remote</span><span className="meta-t">💼 Contract</span></div>
            <div className="sal">$80K – $100K</div>
            <div className="skills"><span className="stag">Figma</span><span className="stag">UI/UX</span><span className="stag">Research</span></div>
            <div className="jcard-actions">
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Applied! ✅')}>Apply Now</button>
              <button className="btn-save" onClick={() => showToast('Saved 🔖')}>Save</button>
            </div>
          </div>
          <div className="jcard">
            <div className="jc-top"><div className="jc-logo">📊</div></div>
            <h3>Data Analyst</h3>
            <div className="co">DataDriven Co.</div>
            <div className="meta-row"><span className="meta-t">📍 Chicago, IL</span><span className="meta-t">💼 Full-time</span></div>
            <div className="sal">$90K – $120K</div>
            <div className="skills"><span className="stag">Python</span><span className="stag">SQL</span><span className="stag">Tableau</span></div>
            <div className="jcard-actions">
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Applied! ✅')}>Apply Now</button>
              <button className="btn-save" onClick={() => showToast('Saved 🔖')}>Save</button>
            </div>
          </div>
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
                <button className="btn btn-primary btn-sm" onClick={() => showToast('Enrolled! 🎓')}>Enroll</button>
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
                <button className="btn btn-primary btn-sm" onClick={() => showToast('Enrolled! 🎓')}>Enroll</button>
              </div>
            </div>
          </div>
          <div className="ccard">
            <div className="cimg" style={{ background: 'linear-gradient(135deg,#2e1a0a,#1a0a00)' }}>
              📈<span className="cb-badge cb-best">Bestseller</span><span className="cb-cat">Marketing</span>
            </div>
            <div className="cbody">
              <h3>Digital Marketing Masterclass</h3>
              <div className="inst">Mike Johnson</div>
              <div className="stars"><span className="rt">⭐ 4.7</span><span className="cnt">👥 25,400 · ⏱ 25 hrs</span></div>
              <div className="cfoot">
                <div className="price"><span className="cur">$79.99</span><span className="ori">$149.99</span></div>
                <button className="btn btn-primary btn-sm" onClick={() => showToast('Enrolled! 🎓')}>Enroll</button>
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
          <div className="bcard">
            <div className="bimg" style={{ background: 'linear-gradient(135deg,#1e3a2e,#0f1f18)' }}>👩💼</div>
            <div className="bbody">
              <span className="bc bc-i">Interview</span>
              <h3>10 Tips for Acing Your Next Job Interview</h3>
              <p>Master proven strategies that hiring managers love.</p>
              <div className="bmeta">👤 Sarah Wilson · Jan 15, 2024 · 8 min read</div>
            </div>
          </div>
          <div className="bcard">
            <div className="bimg" style={{ background: 'linear-gradient(135deg,#2e1a0a,#1a0a00)' }}>💰</div>
            <div className="bbody">
              <span className="bc bc-s">Salary</span>
              <h3>How to Negotiate Your Salary Like a Pro</h3>
              <p>Earn 20% more with these negotiation tactics.</p>
              <div className="bmeta">👤 Michael Chen · 6 min read</div>
            </div>
          </div>
          <div className="bcard">
            <div className="bimg" style={{ background: 'linear-gradient(135deg,#0a1a2e,#050f1a)' }}>🔗</div>
            <div className="bbody">
              <span className="bc bc-n">Networking</span>
              <h3>Building Your Personal Brand on LinkedIn</h3>
              <p>Stand out and attract recruiters effortlessly.</p>
              <div className="bmeta">👤 Emily Brown · 5 min read</div>
            </div>
          </div>
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
        <Link href="/signup" className="btn btn-white btn-lg" style={{ textDecoration: 'none' }}>Start Hiring Today</Link>
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