-- Drop existing tables and constraints in proper order
DROP TABLE IF EXISTS public.wards CASCADE;
DROP TABLE IF EXISTS public.constituencies CASCADE;
DROP TABLE IF EXISTS public.counties CASCADE;

-- Create base geography tables with all required columns
CREATE TABLE public.counties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.constituencies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  county_id uuid REFERENCES public.counties(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name, county_id)
);

CREATE TABLE public.wards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  constituency_id uuid REFERENCES public.constituencies(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name, constituency_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS constituencies_county_id_idx ON public.constituencies(county_id);
CREATE INDEX IF NOT EXISTS wards_constituency_id_idx ON public.wards(constituency_id);
