-- ==========================================
-- Supabase Database Schema for Custom Analytics
-- Copy and run this script in the Supabase SQL Editor.
-- ==========================================

-- 1. Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  country TEXT DEFAULT 'Unknown',
  region TEXT DEFAULT 'Unknown',
  city TEXT DEFAULT 'Unknown',
  referrer TEXT DEFAULT 'Direct',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT,
  browser TEXT
);

-- Enable RLS for Sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 2. Page Events Table
CREATE TABLE IF NOT EXISTS public.page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for Page Events
ALTER TABLE public.page_events ENABLE ROW LEVEL SECURITY;

-- 3. Conversion Events Table
CREATE TABLE IF NOT EXISTS public.conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for Conversion Events
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Row Level Security (RLS) Select Policies
-- Only authenticated admin dashboard users can select data.
-- Inserts/Updates are handled by the service_role client.
-- ==========================================

CREATE POLICY admin_select_sessions ON public.sessions 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY admin_select_page_events ON public.page_events 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY admin_select_conversion_events ON public.conversion_events 
  FOR SELECT TO authenticated USING (true);

-- ==========================================
-- Indexes for Performance and Filtering
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_sessions_first_seen ON public.sessions(first_seen);
CREATE INDEX IF NOT EXISTS idx_page_events_session_id ON public.page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_page_events_timestamp ON public.page_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_conversion_events_session_id ON public.conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_timestamp ON public.conversion_events(timestamp);

-- ==========================================
-- Blog Posts Table
-- ==========================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for Blog Posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts (anonymous + authenticated)
CREATE POLICY public_read_published_posts ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Authenticated admin can do everything
CREATE POLICY admin_all_blog_posts ON public.blog_posts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for Blog Posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);

-- ==========================================
-- Supabase Storage: Blog Images Bucket
-- ==========================================
-- NOTE: Create a storage bucket named 'blog-images' in the
-- Supabase Dashboard > Storage with PUBLIC access enabled.
-- This allows cover images and inline images to be served publicly.

-- ==========================================
-- Subscribers Table
-- ==========================================

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- Enable RLS for Subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 1. Public (anonymous) can insert a new subscription
CREATE POLICY public_insert_subscriber ON public.subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 2. Public can update their status to unsubscribed (using their UUID)
CREATE POLICY public_update_subscriber ON public.subscribers
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (status = 'unsubscribed');

-- 3. Authenticated admin can read/manage all subscribers
CREATE POLICY admin_manage_subscribers ON public.subscribers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for Subscribers
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.subscribers(status);

