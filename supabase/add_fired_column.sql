-- Fire Wizkid Feature - Add fired column
-- Run this in your Supabase SQL Editor

ALTER TABLE wizkids ADD COLUMN IF NOT EXISTS fired BOOLEAN DEFAULT FALSE;
