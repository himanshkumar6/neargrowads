-- Migration: 001_create_enquiries_table.sql
-- Project: odd-silence-82467980 (Branch: production)
-- Purpose: Unified enquiry and lead storage for Contact Us, Get in Touch, and Chatbot.

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL CHECK (source IN ('contact_us', 'get_in_touch', 'chatbot')),
  full_name VARCHAR(150) NOT NULL,
  company VARCHAR(150),
  email VARCHAR(255),
  phone VARCHAR(50),
  service TEXT[] DEFAULT '{}',
  message TEXT,
  page_url VARCHAR(1000),
  status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'contacted', 'booked', 'meeting_booked', 'closed', 'archived')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance and query indexes
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_source ON enquiries (source);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries (email);
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON enquiries (phone);
