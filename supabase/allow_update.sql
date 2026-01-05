-- Allow updates to wizkids table
-- Run this in your Supabase SQL Editor

CREATE POLICY "Anyone can update wizkids" ON wizkids
  FOR UPDATE USING (true);
