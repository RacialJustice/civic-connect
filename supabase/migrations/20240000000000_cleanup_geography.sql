-- First remove any existing foreign key constraints that reference these tables
ALTER TABLE IF EXISTS auth.users 
  DROP CONSTRAINT IF EXISTS users_ward_id_fkey,
  DROP CONSTRAINT IF EXISTS users_constituency_id_fkey,
  DROP CONSTRAINT IF EXISTS users_county_id_fkey;

-- Drop existing policies
DROP POLICY IF EXISTS "Counties are viewable by authenticated users" ON public.counties;
DROP POLICY IF EXISTS "Constituencies are viewable by authenticated users" ON public.constituencies;
DROP POLICY IF EXISTS "Wards are viewable by authenticated users" ON public.wards;

-- Drop existing tables in correct order
DROP TABLE IF EXISTS public.wards CASCADE;
DROP TABLE IF EXISTS public.constituencies CASCADE;
DROP TABLE IF EXISTS public.counties CASCADE;
