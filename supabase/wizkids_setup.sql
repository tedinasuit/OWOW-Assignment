-- Wizkid Manager 2000 - Database Setup
-- Run this in your Supabase SQL Editor

-- Create wizkids table
CREATE TABLE wizkids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  birth_date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE wizkids ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read wizkids (no auth required for viewing)
CREATE POLICY "Anyone can view wizkids" ON wizkids
  FOR SELECT USING (true);

-- Seed data: 12 Dutch Wizkids
INSERT INTO wizkids (name, role, birth_date, image_url) VALUES
  ('Daan van der Berg', 'Lead Developer', '1992-03-15', NULL),
  ('Sophie de Vries', 'UX Designer', '1995-07-22', NULL),
  ('Luuk Jansen', 'Frontend Developer', '1998-11-03', NULL),
  ('Emma Bakker', 'Product Manager', '1993-05-18', NULL),
  ('Bram Visser', 'Backend Developer', '1996-09-27', NULL),
  ('Lotte van Dijk', 'UI Designer', '1997-02-14', NULL),
  ('Thijs Mulder', 'DevOps Engineer', '1991-12-08', NULL),
  ('Fleur Smit', 'Data Analyst', '1994-08-30', NULL),
  ('Sem de Boer', 'Mobile Developer', '1999-04-11', NULL),
  ('Julia Klein', 'QA Engineer', '1995-01-25', NULL),
  ('Ruben Peters', 'Full Stack Developer', '1993-10-07', NULL),
  ('Noor Hendriks', 'Scrum Master', '1990-06-19', NULL);
