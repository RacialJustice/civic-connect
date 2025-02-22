-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS public.wards CASCADE;
DROP TABLE IF EXISTS public.constituencies CASCADE;
DROP TABLE IF EXISTS public.counties CASCADE;

-- Drop any related indexes
DROP INDEX IF EXISTS constituencies_county_id_idx;
DROP INDEX IF EXISTS wards_constituency_id_idx;

-- Create the base geography tables
CREATE TABLE public.counties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.constituencies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  county_id uuid REFERENCES public.counties(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name, county_id)
);

CREATE TABLE public.wards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  constituency_id uuid REFERENCES public.constituencies(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name, constituency_id)
);