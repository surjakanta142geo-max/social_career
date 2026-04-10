"use client";
import { useState, useEffect } from 'react';
import { useToast } from '../layout';
import { createClient } from '@/utils/supabase/client';
import { updateProfile } from '../actions/userActions';
import { getSavedItems } from '../actions/saveActions';
import { fileToDataUrl } from '@/utils/files/toDataUrl';
import JobCard from '../components/JobCard';
import BlogCard from '../components/BlogCard';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setLoading(false);
        return;
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(profile);

    const [jobs, blogs] = await Promise.all([
        getSavedItems('job'),
        getSavedItems('blog')
    ]);
    setSavedJobs(jobs);
    setSavedBlogs(blogs);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = (e.currentTarget.elements.namedItem('avatar') as HTMLInputElement).files?.[0];
    let avatarUrl = profile?.avatar;
    if (file) {
        avatarUrl = await fileToDataUrl(file);
    }
    const result = await updateProfile(formData, avatarUrl);
    if (result.success) {
        showToast('Profile updated! ✅');
        fetchData();
    } else {
        showToast(`Error: ${result.error} ❌`);
    }
  };

  if (loading) return <div className="section"><p>Loading profile...</p></div>;
  if (!profile) return <div className="section"><p>Please login to view your profile.</p></div>;

  return (
    <div className="section">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Your Profile</h2>
        
        <div className="atable" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    background: '#f1f5f9', 
                    margin: '0 auto 1rem',
                    backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none',
                    backgroundSize: 'cover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                }}>
                    {!profile.avatar && '👤'}
                </div>
                <input type="file" name="avatar" accept="image/*" style={{ fontSize: '0.8rem' }} />
            </div>
            
            <div style={{ flex: '2', minWidth: '300px' }}>
                <div className="mfg"><label>Full Name</label><input name="name" type="text" defaultValue={profile.name} required /></div>
                <div className="mfg"><label>Phone (Optional)</label><input name="phone" type="text" defaultValue={profile.phone} placeholder="+91 98765 43210" /></div>
                
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Profile</button>
            </div>
          </form>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>Saved Content</h3>
        <div className="tab-tog" style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
            <button className="active">Saved Jobs</button>
            <button onClick={() => showToast('Blogs tab clicked')}>Saved Blogs</button>
        </div>

        <div className="jlist">
            {savedJobs.length > 0 ? (
                savedJobs.map(job => (
                    <JobCard key={job.id} job={job} isList={true} />
                ))
            ) : (
                <p style={{ color: 'var(--muted)' }}>No jobs saved yet.</p>
            )}
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Saved Blogs</h3>
        <div className="bg3">
            {savedBlogs.length > 0 ? (
                savedBlogs.map(blog => (
                    <BlogCard key={blog.id} blog={blog} />
                ))
            ) : (
                <p style={{ color: 'var(--muted)' }}>No blogs saved yet.</p>
            )}
        </div>
      </div>
    </div>
  );
}
