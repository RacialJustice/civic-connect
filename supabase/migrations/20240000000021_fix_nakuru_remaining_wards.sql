-- First ensure Nakuru county exists and get its ID
WITH county_insert AS (
  INSERT INTO counties (name, code)
  VALUES ('Nakuru', 'NKR')
  ON CONFLICT (name) 
  DO UPDATE SET code = 'NKR'
  RETURNING id
),
-- Insert remaining Nakuru constituencies with codes and county_id
constituency_insert AS (
  INSERT INTO constituencies (name, code, county_id)
  VALUES 
    ('Gilgil', 'GGL-NKR', (SELECT id FROM county_insert)),
    ('Molo', 'MLO-NKR', (SELECT id FROM county_insert)),
    ('Rongai', 'RNG-NKR', (SELECT id FROM county_insert))
  ON CONFLICT (name, county_id) 
  DO UPDATE SET code = EXCLUDED.code
  RETURNING id, name, code
),
-- Insert wards
ward_inserts AS (
  SELECT 
    w.ward_name as name,
    CONCAT(w.ward_code, '-', c.code) as code,
    c.id as constituency_id
  FROM (VALUES
    ('Gilgil', 'GGL', 'Gilgil'),
    ('Malewa West', 'MLW', 'Gilgil'),
    ('Mbaruk/Eburu', 'MBE', 'Gilgil'),
    ('Mariashoni', 'MRS', 'Molo'),
    ('Elburgon', 'ELB', 'Molo'),
    ('Turi', 'TRI', 'Molo'),
    ('Solai', 'SOL', 'Rongai'),
    ('Mosop', 'MSP', 'Rongai'),
    ('Menengai West', 'MNW', 'Rongai')
  ) AS w(ward_name, ward_code, constituency_name)
  JOIN constituency_insert c ON c.name = w.constituency_name
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_inserts
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  updated_at = timezone('utc'::text, now());
