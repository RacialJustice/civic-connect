-- First, ensure we have the counties and constituencies
INSERT INTO counties (name)
VALUES ('Nairobi')
ON CONFLICT (name) DO NOTHING;

-- Insert constituencies with proper county reference
WITH county_data AS (
  SELECT id FROM counties WHERE name = 'Nairobi'
)
INSERT INTO constituencies (name, county_id)
VALUES 
  ('Westlands', (SELECT id FROM county_data)),
  ('Dagoretti North', (SELECT id FROM county_data)),
  ('Roysambu', (SELECT id FROM county_data))
ON CONFLICT (name, county_id) DO NOTHING;

-- Now insert wards with proper constituency references
WITH constituency_refs AS (
  SELECT id, name 
  FROM constituencies 
  WHERE name IN ('Westlands', 'Dagoretti North', 'Roysambu')
),
ward_inserts AS (
  SELECT 
    w.ward_name as name,
    w.ward_name as code,
    c.id as constituency_id
  FROM (VALUES
    ('Kitisuru', 'Westlands'),
    ('Parklands/Highridge', 'Westlands'),
    ('Karura', 'Westlands'),
    ('Kangemi', 'Westlands'),
    ('Mountain View', 'Westlands'),
    ('Kilimani', 'Dagoretti North'),
    ('Kawangware', 'Dagoretti North'),
    ('Gatina', 'Dagoretti North'),
    ('Kileleshwa', 'Dagoretti North'),
    ('Kabiro', 'Dagoretti North'),
    ('Roysambu', 'Roysambu'),
    ('Garden Estate', 'Roysambu'),
    ('Ridgeways', 'Roysambu'),
    ('Githurai', 'Roysambu'),
    ('Kahawa West', 'Roysambu')
  ) AS w(ward_name, constituency_name)
  JOIN constituency_refs c ON c.name = w.constituency_name
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_inserts
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  updated_at = timezone('utc'::text, now());
