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
