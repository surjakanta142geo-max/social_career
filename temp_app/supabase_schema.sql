-- Drop old triggers and tables if they exist to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS saved_items;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS profiles;

-- Create profiles table (Replacing users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'job_seeker' CHECK (role IN ('admin', 'recruiter', 'job_seeker')),
  account_type TEXT CHECK (account_type IN ('fresher', 'experienced', 'student', 'professional')),
  company_name TEXT,
  org_name TEXT,
  session_token TEXT, -- For token saving as requested
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notification_enabled BOOLEAN DEFAULT TRUE,
  phone TEXT
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'internship', 'government')),
  work_mode TEXT NOT NULL CHECK (work_mode IN ('onsite', 'remote', 'hybrid')),
  salary TEXT,
  description TEXT,
  last_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blogs table (Career Tips)
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT NOT NULL CHECK (category IN ('resume writing', 'fresher guidance', 'skill development', 'best courses', 'interview preparation', 'salary tips', 'govt jobs')),
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_items table
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('job', 'blog')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id, type)
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published jobs are viewable by everyone" ON jobs FOR SELECT USING (status = 'published');
CREATE POLICY "All jobs viewable by admin" ON jobs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Recruiters can manage their own jobs" ON jobs FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Published blogs are viewable by everyone" ON blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Admin can manage all blogs" ON blogs FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can manage their own saved items" ON saved_items FOR ALL USING (user_id = auth.uid());

-- Trigger function to sync Auth User to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, account_type, company_name, org_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    CASE
      WHEN new.raw_user_meta_data->>'role' = 'recruiter' THEN 'recruiter'
      ELSE 'job_seeker'
    END,
    CASE
      WHEN new.raw_user_meta_data->>'role' = 'job_seeker'
       AND new.raw_user_meta_data->>'account_type' IN ('fresher', 'experienced', 'student', 'professional')
      THEN new.raw_user_meta_data->>'account_type'
      ELSE NULL
    END,
    CASE
      WHEN new.raw_user_meta_data->>'role' = 'recruiter'
      THEN NULLIF(new.raw_user_meta_data->>'company_name', '')
      ELSE NULL
    END,
    CASE
      WHEN new.raw_user_meta_data->>'role' = 'recruiter'
      THEN NULLIF(new.raw_user_meta_data->>'org_name', '')
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    account_type = EXCLUDED.account_type,
    company_name = EXCLUDED.company_name,
    org_name = EXCLUDED.org_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
