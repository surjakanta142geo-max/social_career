"use client";
import { useState } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import { useToast } from '../layout';

export default function TipsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Interview', 'Salary', 'Networking', 'Remote Work', 'Career Change', 'Technology'];
    const showToast = useToast();

    return (
        <div>
            <div className="phero">
                <h1>Career Tips & Insights</h1>
                <p>Expert advice to accelerate your career journey</p>
                <div className="sbar">
                    <span style={{ padding: '0 4px 0 8px', color: '#94a3b8' }}>🔍</span>
                    <input type="text" placeholder="Search articles…" />
                    <button className="btn btn-primary" style={{ borderRadius: '8px' }}>Search</button>
                </div>
            </div>

            <div className="ctabs">
                {tabs.map(tab => (
                    <button key={tab} className={`ctab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="section">
                <div className="blog-featured" style={{ marginBottom: '1.2rem' }}>
                    <div className="bf-img" style={{ background: 'linear-gradient(135deg,#1e3a2e,#0f1f18)' }}>👩💼</div>
                    <div className="bf-body">
                        <span className="bc bc-i">Interview</span>
                        <h3>10 Tips for Acing Your Next Job Interview</h3>
                        <p>Master the art of interviewing with these proven strategies that hiring managers love. From preparation to follow-up, we cover everything you need to know.</p>
                        <div className="bf-meta">👤 Sarah Wilson · 📅 Jan 15, 2024 · 8 min read</div>
                        <button className="read-more">Read More →</button>
                    </div>
                </div>

                <div className="bg3">
                    <div className="bcard">
                        <div className="bimg" style={{ background: 'linear-gradient(135deg,#2e1a0a,#1a0a00)' }}>💰</div>
                        <div className="bbody">
                            <span className="bc bc-s">Salary</span>
                            <h3>How to Negotiate Your Salary Like a Pro</h3>
                            <p>Earn 20% more with these proven negotiation tactics.</p>
                            <div className="bmeta">👤 Michael Chen · 6 min read</div>
                        </div>
                    </div>
                    <div className="bcard">
                        <div className="bimg" style={{ background: 'linear-gradient(135deg,#0a1a2e,#050f1a)' }}>🔗</div>
                        <div className="bbody">
                            <span className="bc bc-n">Networking</span>
                            <h3>Building Your Personal Brand on LinkedIn</h3>
                            <p>Stand out and attract recruiters with an optimized profile.</p>
                            <div className="bmeta">👤 Emily Brown · Jan 10 · 5 min read</div>
                        </div>
                    </div>
                    <div className="bcard">
                        <div className="bimg" style={{ background: 'linear-gradient(135deg,#1a2e1a,#0a1a0a)' }}>🏠</div>
                        <div className="bbody">
                            <span className="bc bc-r">Remote Work</span>
                            <h3>Remote Work: Tips for Staying Productive</h3>
                            <p>Proven strategies for maintaining work-life balance.</p>
                            <div className="bmeta">👤 David Lee · 7 min read</div>
                        </div>
                    </div>
                    <div className="bcard">
                        <div className="bimg" style={{ background: 'linear-gradient(135deg,#2e1a2e,#1a0a1a)' }}>🔄</div>
                        <div className="bbody">
                            <span className="bc bc-c">Career Change</span>
                            <h3>Career Transition: How to Switch Industries</h3>
                            <p>Leverage transferable skills to make a successful move.</p>
                            <div className="bmeta">👤 Jennifer Martinez · 10 min read</div>
                        </div>
                    </div>
                    <div className="bcard">
                        <div className="bimg" style={{ background: 'linear-gradient(135deg,#0a1a2e,#050f1a)' }}>🤖</div>
                        <div className="bbody">
                            <span className="bc bc-t">Technology</span>
                            <h3>The Future of AI in the Workplace</h3>
                            <p>How AI is reshaping jobs and what skills you need.</p>
                            <div className="bmeta">👤 Alex Thompson · 9 min read</div>
                        </div>
                    </div>
                </div>

                <div className="load-more">
                    <button className="btn btn-outline" onClick={() => showToast('Loading more…')}>Load More Articles</button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
