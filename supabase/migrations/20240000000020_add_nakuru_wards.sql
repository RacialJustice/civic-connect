-- First ensure Nakuru county exists with code
INSERT INTO counties (name, code)
VALUES ('Nakuru', 'NKR')
ON CONFLICT (name) DO UPDATE SET code = 'NKR'
RETURNING id;

-- Insert Nakuru constituencies with codes
WITH county_data AS (
  SELECT id FROM counties WHERE name = 'Nakuru'
)
INSERT INTO constituencies (name, code, county_id)
VALUES 
  ('Nakuru Town West', 'NTW-NKR', (SELECT id FROM county_data)),
  ('Nakuru Town East', 'NTE-NKR', (SELECT id FROM county_data)),
  ('Naivasha', 'NVA-NKR', (SELECT id FROM county_data))
ON CONFLICT (name, county_id) DO UPDATE SET code = EXCLUDED.code;

-- Insert wards with proper references
WITH constituency_refs AS (
  SELECT id, name, code 
  FROM constituencies 
  WHERE name IN ('Nakuru Town West', 'Nakuru Town East', 'Naivasha')
  AND county_id = (SELECT id FROM counties WHERE name = 'Nakuru')
),
ward_inserts AS (
  SELECT 
    w.ward_name as name,
    CONCAT(w.ward_code, '-', c.code) as code,
    c.id as constituency_id
  FROM (VALUES
    ('Shaabab', 'SHB', 'Nakuru Town West'),
    ('London', 'LDN', 'Nakuru Town West'),
    ('Barut', 'BRT', 'Nakuru Town West'),
    ('Biashara', 'BSH', 'Nakuru Town East'),
    ('Menengai', 'MNG', 'Nakuru Town East'),
    ('Kivumbini', 'KVM', 'Nakuru Town East'),
    ('Viwanda', 'VWD', 'Naivasha'),
    ('Hellsgate', 'HGT', 'Naivasha'),
    ('Lake View', 'LKV', 'Naivasha')
  ) AS w(ward_name, ward_code, constituency_name)
  JOIN constituency_refs c ON c.name = w.constituency_name
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_inserts
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  updated_at = timezone('utc'::text, now());
