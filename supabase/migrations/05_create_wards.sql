-- Add code column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'wards' 
        AND column_name = 'code'
    ) THEN
        ALTER TABLE public.wards ADD COLUMN code text;
        -- Add unique constraint to code
        ALTER TABLE public.wards ADD CONSTRAINT wards_code_key UNIQUE (code);
    END IF;
END $$;

-- Update existing wards with a default code if needed
UPDATE public.wards 
SET code = CONCAT(name, '-', (
    SELECT c.name 
    FROM constituencies c 
    WHERE c.id = wards.constituency_id
))
WHERE code IS NULL;

-- Make code column NOT NULL after updating existing records
ALTER TABLE public.wards ALTER COLUMN code SET NOT NULL;

-- First, remove the foreign key constraint from auth.users
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS users_ward_id_fkey;

-- Then update the existing wards table instead of recreating it
UPDATE wards
SET code = name
WHERE code IS NULL;

-- Add constituency and county names based on related tables
-- You'll need to join with constituencies and counties tables
-- Example (adjust based on your actual table structure):
ALTER TABLE wards
ADD COLUMN IF NOT EXISTS constituency_name TEXT,
ADD COLUMN IF NOT EXISTS county_name TEXT;

-- Update the constituency and county names
UPDATE wards
SET 
  constituency_name = c.name,
  county_name = co.name
FROM constituencies c
JOIN counties co ON c.county_id = co.id
WHERE wards.constituency_id = c.id;

-- Now insert your data, matching the existing structure
INSERT INTO wards (name, code, constituency_id, constituency_name, county_name)
SELECT 
  w.name, 
  w.name AS code, 
  c.id AS constituency_id,
  c.name AS constituency_name,
  co.name AS county_name
FROM (VALUES
    ('Kitisuru', 'Westlands', 'Nairobi'),
    ('Parklands/Highridge', 'Westlands', 'Nairobi'),
    ('Karura', 'Westlands', 'Nairobi'),
    ('Kangemi', 'Westlands', 'Nairobi'),
    ('Mountain View', 'Westlands', 'Nairobi'),
    
    ('Kilimani', 'Dagoretti North', 'Nairobi'),
    ('Kawangware', 'Dagoretti North', 'Nairobi'),
    ('Gatina', 'Dagoretti North', 'Nairobi'),
    ('Kileleshwa', 'Dagoretti North', 'Nairobi'),
    ('Kabiro', 'Dagoretti North', 'Nairobi'),
    
    ('Gitaru', 'Kabete', 'Kiambu'),
    ('Muguga', 'Kabete', 'Kiambu'),
    ('Nyadhuna', 'Kabete', 'Kiambu'),
    ('Kabete', 'Kabete', 'Kiambu'),
    ('Uthiru', 'Kabete', 'Kiambu'),
    ('Kahuho', 'Kabete', 'Kiambu')
) AS w(name, constituency, county)
JOIN constituencies c ON c.name = w.constituency
JOIN counties co ON co.name = w.county AND c.county_id = co.id
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  constituency_name = EXCLUDED.constituency_name,
  county_name = EXCLUDED.county_name;

-- Re-add the foreign key constraint 
ALTER TABLE auth.users 
ADD CONSTRAINT users_ward_id_fkey 
FOREIGN KEY (ward_id) REFERENCES wards(id);