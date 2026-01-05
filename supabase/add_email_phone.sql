-- Wizkid Manager 2000 - Add email and phone columns
-- Run this in your Supabase SQL Editor

-- Add new columns
ALTER TABLE wizkids ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE wizkids ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update existing data with new roles, emails, and phones
UPDATE wizkids SET 
  role = 'Boss',
  email = 'daan@owow.nl',
  phone = '+31 6 12345678'
WHERE name = 'Daan van der Berg';

UPDATE wizkids SET 
  role = 'Designer',
  email = 'sophie@owow.nl',
  phone = '+31 6 23456789'
WHERE name = 'Sophie de Vries';

UPDATE wizkids SET 
  role = 'Developer',
  email = 'luuk@owow.nl',
  phone = '+31 6 34567890'
WHERE name = 'Luuk Jansen';

UPDATE wizkids SET 
  role = 'Boss',
  email = 'emma@owow.nl',
  phone = '+31 6 45678901'
WHERE name = 'Emma Bakker';

UPDATE wizkids SET 
  role = 'Developer',
  email = 'bram@owow.nl',
  phone = '+31 6 56789012'
WHERE name = 'Bram Visser';

UPDATE wizkids SET 
  role = 'Designer',
  email = 'lotte@owow.nl',
  phone = '+31 6 67890123'
WHERE name = 'Lotte van Dijk';

UPDATE wizkids SET 
  role = 'Developer',
  email = 'thijs@owow.nl',
  phone = '+31 6 78901234'
WHERE name = 'Thijs Mulder';

UPDATE wizkids SET 
  role = 'Intern',
  email = 'fleur@owow.nl',
  phone = '+31 6 89012345'
WHERE name = 'Fleur Smit';

UPDATE wizkids SET 
  role = 'Developer',
  email = 'sem@owow.nl',
  phone = '+31 6 90123456'
WHERE name = 'Sem de Boer';

UPDATE wizkids SET 
  role = 'Intern',
  email = 'julia@owow.nl',
  phone = '+31 6 01234567'
WHERE name = 'Julia Klein';

UPDATE wizkids SET 
  role = 'Developer',
  email = 'ruben@owow.nl',
  phone = '+31 6 11223344'
WHERE name = 'Ruben Peters';

UPDATE wizkids SET 
  role = 'Designer',
  email = 'noor@owow.nl',
  phone = '+31 6 22334455'
WHERE name = 'Noor Hendriks';
