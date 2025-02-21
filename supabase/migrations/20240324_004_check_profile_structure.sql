-- Check table structure using information_schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'profiles'
ORDER BY 
    ordinal_position;

-- Add columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ward text,
ADD COLUMN IF NOT EXISTS constituency text,
ADD COLUMN IF NOT EXISTS county text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_ward ON profiles(ward);
CREATE INDEX IF NOT EXISTS idx_profiles_constituency ON profiles(constituency);
CREATE INDEX IF NOT EXISTS idx_profiles_county ON profiles(county);

-- Check some sample data
SELECT 
    id,
    ward,
    constituency,
    county
FROM 
    profiles
LIMIT 5;

-- Fix profile columns if needed
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location_ward text,
ADD COLUMN IF NOT EXISTS location_constituency text,
ADD COLUMN IF NOT EXISTS location_county text;

SELECT 
  title,
  region_name,
  region_type,
  start_date,
  description
FROM events
WHERE region_name in ('Kabete', 'Kiambu', 'Gitaru')
ORDER BY start_date;
