-- Migration: 002_create_website_visitors_table.sql
-- Project: odd-silence-82467980 (Branch: production)
-- Purpose: Real visitor analytics tracking table for qualified user sessions.

CREATE TABLE IF NOT EXISTS website_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance and query indexes
CREATE INDEX IF NOT EXISTS idx_website_visitors_created_at ON website_visitors (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_visitors_session_id ON website_visitors (session_id);
