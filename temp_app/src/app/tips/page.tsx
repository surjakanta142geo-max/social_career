"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import { useToast } from '../layout';
import { getBlogs } from '../actions/blogActions';
import BlogCard from '../components/BlogCard';

export default function TipsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Interview prep', 'Resume writing', 'Salary Tips', 'Govt Jobs', 'Freshers', 'Skill development', 'Best courses'];
    const showToast = useToast();

    const fetchBlogs = async () => {
        setLoading(true);
        const data = await getBlogs();
        setBlogs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = activeTab === 'All' 
        ? blogs 
        : blogs.filter(blog => blog.category.toLowerCase() === activeTab.toLowerCase());

    const featuredBlog = blogs.length > 0 ? blogs[0] : null;
    const remainingBlogs = activeTab === 'All' ? blogs.slice(1) : filteredBlogs;

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

            <div className="ctabs" style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '0.4rem' }}>
                {tabs.map(tab => (
                    <button key={tab} className={`ctab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="section">
                {activeTab === 'All' && featuredBlog && (
                    <div className="blog-featured" style={{ marginBottom: '1.2rem' }}>
                        <div className="bf-img" style={{ 
                            backgroundImage: featuredBlog.thumbnail ? `url(${featuredBlog.thumbnail})` : 'linear-gradient(135deg,#1e3a2e,#0f1f18)',
                            backgroundSize: 'cover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                             {!featuredBlog.thumbnail && '📋'}
                        </div>
                        <div className="bf-body">
                            <span className="bc bc-i">{featuredBlog.category}</span>
                            <h3>{featuredBlog.title}</h3>
                            <p>{featuredBlog.content.substring(0, 160)}...</p>
                            <div className="bf-meta">👤 {featuredBlog.author} · {new Date(featuredBlog.created_at).toLocaleDateString()}</div>
                            <button className="read-more">Read More →</button>
                        </div>
                    </div>
                )}

                <div className="bg3">
                    {loading ? (
                        <p>Loading articles...</p>
                    ) : remainingBlogs.length > 0 ? (
                        remainingBlogs.map((blog: any) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))
                    ) : (
                        <p>No articles found for this category.</p>
                    )}
                </div>

                {remainingBlogs.length > 6 && (
                    <div className="load-more">
                        <button className="btn btn-outline" onClick={() => showToast('Loading more…')}>Load More Articles</button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
