-- Wizkid Manager 2000 - Restrict updates to authenticated users
-- Run this in your Supabase SQL Editor

-- First, drop the old permissive policy
DROP POLICY IF EXISTS "Anyone can update wizkids" ON wizkids;

-- Create a new restricted policy
CREATE POLICY "Authenticated users can update wizkids" ON wizkids
  FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);
