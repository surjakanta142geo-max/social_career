"use client";
import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Development', 'Data Science', 'Marketing', 'Design', 'Business'];

  return (
    <div>
      <div className="phero">
        <h1>Explore Our Courses</h1>
        <p>Upskill with industry-leading instructors</p>
        <div className="sbar"><span style={{ padding: '0 4px 0 8px', color: '#94a3b8' }}>🔍</span><input type="text" placeholder="Search courses…" /><button className="btn btn-primary" style={{ borderRadius: '8px' }}>Search</button></div>
      </div>

      <div className="ctabs">
        {tabs.map(tab => (
          <button key={tab} className={`ctab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="section">
        <div className="show-row"><span>Showing <strong>6 courses</strong></span><select><option>Most Popular</option><option>Newest</option><option>Price: Low–High</option></select></div>
        <div className="cg">
          <CourseCard
            icon="💻" title="Complete Web Development Bootcamp" instructor="John Doe"
            rating="4.8" students="15,420" hours="40" price="$99.99" originalPrice="$199.99"
            bg="linear-gradient(135deg,#1e3a5f,#0a1628)" badge="Bestseller" category="Development"
          />
          <CourseCard
            icon="📊" title="Data Science with Python" instructor="Jane Smith"
            rating="4.9" students="12,350" hours="35" price="$89.99" originalPrice="$179.99"
            bg="linear-gradient(135deg,#1a2e1a,#0a1a0a)" badge="▶ Live" category="Data Science"
          />
          <CourseCard
            icon="📈" title="Digital Marketing Masterclass" instructor="Mike Johnson"
            rating="4.7" students="8,920" hours="25" price="$79.99" originalPrice="$149.99"
            bg="linear-gradient(135deg,#2e1a0a,#1a0a00)" badge="Bestseller" category="Marketing"
          />
          <CourseCard
            icon="🎨" title="UI/UX Design Fundamentals" instructor="Sarah Wilson"
            rating="4.8" students="10,230" hours="30" price="$84.99" originalPrice="$169.99"
            bg="linear-gradient(135deg,#1a1a3e,#0a0a1e)" badge="" category="Design"
          />
          <CourseCard
            icon="🤖" title="Machine Learning A–Z" instructor="Alex Chen"
            rating="4.9" students="18,500" hours="45" price="$109.99" originalPrice="$219.99"
            bg="linear-gradient(135deg,#1a2e1a,#0a1a0a)" badge="▶ Live" category="Data Science"
          />
          <CourseCard
            icon="📉" title="Business Analytics Essentials" instructor="Emily Brown"
            rating="4.6" students="7,800" hours="20" price="$69.99" originalPrice="$139.99"
            bg="linear-gradient(135deg,#2e2010,#1a1000)" badge="" category="Business"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}