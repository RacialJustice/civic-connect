-- First ensure the code column exists in wards table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'wards' 
        AND column_name = 'code'
    ) THEN
        ALTER TABLE public.wards ADD COLUMN code text;
        -- Add unique constraint
        ALTER TABLE public.wards ADD CONSTRAINT wards_code_key UNIQUE (code);
    END IF;
END $$;

-- Fix ward data structure
WITH ward_data AS (
  SELECT 
    w.name, 
    w.name AS code, 
    c.id AS constituency_id
  FROM (
    -- Example data structure
    VALUES
      ('Kitisuru', 'Westlands', 'Nairobi'),
      ('Parklands/Highridge', 'Westlands', 'Nairobi'),
      ('Karura', 'Westlands', 'Nairobi')
      -- Add more wards as needed
  ) AS w(name, constituency, county)
  JOIN constituencies c ON c.name = w.constituency
  JOIN counties co ON co.name = w.county AND c.county_id = co.id
)
-- Insert the data
INSERT INTO wards (name, code, constituency_id)
SELECT 
  name,
  code,
  constituency_id 
FROM ward_data
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  updated_at = timezone('utc'::text, now());

-- Add missing indexes if needed
CREATE INDEX IF NOT EXISTS idx_wards_constituency_id ON wards(constituency_id);
