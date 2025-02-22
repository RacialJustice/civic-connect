-- Second migration: Add Kiambu wards (09_add_kiambu_wards.sql)
-- First ensure Kiambu county exists with code
INSERT INTO counties (name, code)
VALUES ('Kiambu', 'KBU')
ON CONFLICT (name) DO UPDATE SET code = 'KBU'
RETURNING id;

-- Insert Kiambu constituencies with codes
WITH county_data AS (
  SELECT id FROM counties WHERE name = 'Kiambu'
)
INSERT INTO constituencies (name, code, county_id)
VALUES 
  ('Kiambaa', 'KBA-KBU', (SELECT id FROM county_data)),
  ('Kikuyu', 'KKU-KBU', (SELECT id FROM county_data)),
  ('Limuru', 'LMR-KBU', (SELECT id FROM county_data))
ON CONFLICT (name, county_id) 
DO UPDATE SET code = EXCLUDED.code;

-- Insert wards with code column
WITH constituency_refs AS (
  SELECT id, name 
  FROM constituencies 
  WHERE name IN ('Kiambaa', 'Kikuyu', 'Limuru')
  AND county_id = (SELECT id FROM counties WHERE name = 'Kiambu')
),
ward_data AS (
  SELECT 
    w.ward_name as name,
    w.ward_code as code,
    c.id as constituency_id
  FROM (VALUES
    ('Cianda', 'CND-KBA-KBU', 'Kiambaa'),
    ('Karuri', 'KRR-KBA-KBU', 'Kiambaa'),
    ('Ndenderu', 'NDD-KBA-KBU', 'Kiambaa'),
    ('Muchatha', 'MCH-KBA-KBU', 'Kiambaa'),
    ('Kawaida', 'KWD-KKU-KBU', 'Kikuyu'),
    ('Kikuyu', 'KKY-KKU-KBU', 'Kikuyu'),
    ('Kinoo', 'KNO-KKU-KBU', 'Kikuyu'),
    ('Ndeiya', 'NDY-LMR-KBU', 'Limuru'),
    ('Limuru Central', 'LMC-LMR-KBU', 'Limuru'),
    ('Bibirioni', 'BBR-LMR-KBU', 'Limuru')
  ) AS w(ward_name, ward_code, constituency_name)
  JOIN constituency_refs c ON c.name = w.constituency_name
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_data
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  updated_at = timezone('utc'::text, now());