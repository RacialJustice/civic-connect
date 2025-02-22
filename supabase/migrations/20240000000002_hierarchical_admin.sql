-- Drop existing type if it exists
DROP TYPE IF EXISTS auth.admin_level CASCADE;

-- Create admin level enum
CREATE TYPE auth.admin_level AS ENUM (
  'super_admin',
  'county_admin',
  'constituency_admin',
  'ward_admin'
);

-- Add columns to auth.users table
ALTER TABLE auth.users 
  ADD COLUMN IF NOT EXISTS admin_level auth.admin_level,
  ADD COLUMN IF NOT EXISTS ward_id uuid REFERENCES public.wards(id),
  ADD COLUMN IF NOT EXISTS constituency_id uuid REFERENCES public.constituencies(id),
  ADD COLUMN IF NOT EXISTS county_id uuid REFERENCES public.counties(id);

-- Add constraint to ensure proper hierarchy
ALTER TABLE auth.users
  ADD CONSTRAINT valid_admin_hierarchy
  CHECK (
    (admin_level = 'super_admin' AND ward_id IS NULL AND constituency_id IS NULL AND county_id IS NULL) OR
    (admin_level = 'county_admin' AND ward_id IS NULL AND constituency_id IS NULL AND county_id IS NOT NULL) OR
    (admin_level = 'constituency_admin' AND ward_id IS NULL AND constituency_id IS NOT NULL) OR
    (admin_level = 'ward_admin' AND ward_id IS NOT NULL) OR
    (admin_level IS NULL)
  );