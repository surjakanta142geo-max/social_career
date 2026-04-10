"use client";
import { useToast } from '../layout';
import { toggleSaveItem } from '../actions/saveActions';
import { useState } from 'react';

export default function BlogCard({ blog }: { blog: any }) {
  const showToast = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await toggleSaveItem(blog.id, 'blog');
    if (result.success) {
      setIsSaved(result.saved || false);
      showToast(result.saved ? 'Article Saved 🔖' : 'Article Unsaved 🗑️');
    } else {
      showToast('Login to save articles! 🔐');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: blog.title,
      text: `Check out this article: ${blog.title}`,
      url: window.location.origin + '/tips/' + blog.id
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard! 📋');
      } catch (err) {
        showToast('Failed to copy link ❌');
      }
    }
  };

  return (
    <div className="bcard">
      <div className="bimg" style={{ 
          backgroundImage: blog.thumbnail ? `url(${blog.thumbnail})` : 'linear-gradient(135deg,#1a2e2e,#0a1a1a)',
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }}>
          {!blog.thumbnail && '📝'}
      </div>
      <div className="bbody">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span className="bc bc-i">{blog.category}</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-save" onClick={handleSave} style={{ fontSize: '0.9rem', padding: '2px 6px', border: 'none', background: 'none', cursor: 'pointer' }}>
                    {isSaved ? '🔖' : '📑'}
                </button>
                <button className="btn-save" onClick={handleShare} style={{ fontSize: '0.9rem', padding: '2px 6px', border: 'none', background: 'none', cursor: 'pointer' }}>
                    📤
                </button>
            </div>
        </div>
        <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>{blog.title}</h3>
        <div className="bmeta" style={{ marginTop: '0.6rem' }}>👤 {blog.author} · {new Date(blog.created_at).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
