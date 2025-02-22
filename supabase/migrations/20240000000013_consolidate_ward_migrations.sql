-- Ensure we have the correct columns first
DO $$ 
BEGIN
    -- Add code column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'wards' AND column_name = 'code'
    ) THEN
        ALTER TABLE public.wards ADD COLUMN code text;
    END IF;
END $$;

-- Consolidate ward data
WITH constituency_data AS (
  SELECT c.id, c.name, co.name as county_name
  FROM constituencies c
  JOIN counties co ON c.id = co.id
),
ward_data AS (
  SELECT 
    w.ward_name as name,
    CONCAT(w.ward_code, '-', c.name) as code,
    c.id as constituency_id
  FROM (VALUES
    ('Kitisuru', 'KTS', 'Westlands'),
    ('Parklands', 'PKL', 'Westlands'),
    ('Karura', 'KRA', 'Westlands')
    -- Add more wards as needed
  ) AS w(ward_name, ward_code, constituency_name)
  JOIN constituency_data c ON c.name = w.constituency_name
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_data
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  updated_at = timezone('utc'::text, now());

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'wards_code_key'
    ) THEN
        ALTER TABLE public.wards ADD CONSTRAINT wards_code_key UNIQUE (code);
    END IF;
END $$;
