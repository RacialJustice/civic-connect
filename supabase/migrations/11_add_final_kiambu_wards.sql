-- First, get county ID
WITH county_data AS (
  SELECT id FROM counties WHERE name = 'Kiambu'
),
-- Insert or get constituencies
constituency_data AS (
  SELECT c.id, c.name
  FROM constituencies c
  WHERE c.county_id = (SELECT id FROM county_data)
  AND c.name IN ('Kabete', 'Githunguri', 'Lari')
),
-- Format ward data with proper references
ward_data AS (
  SELECT 
    w.ward_name as name,
    CONCAT(w.ward_code, '-', c.name, '-KBU') as code,
    c.id as constituency_id
  FROM (VALUES
    ('Gitaru', 'GTR', 'Kabete'),
    ('Muguga', 'MGG', 'Kabete'),
    ('Nyadhuna', 'NYD', 'Kabete'),
    ('Githunguri', 'GTH', 'Githunguri'),
    ('Githiga', 'GTG', 'Githunguri'),
    ('Ikinu', 'IKN', 'Githunguri'),
    ('Lari', 'LAR', 'Lari'),
    ('Kijabe', 'KJB', 'Lari'),
    ('Kamburu', 'KMB', 'Lari')
  ) AS w(ward_name, ward_code, constituency_name)
  JOIN constituency_data c ON c.name = w.constituency_name
)
-- Insert wards with unique codes
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_data
ON CONFLICT (code) 
DO UPDATE SET 
  name = EXCLUDED.name,
  constituency_id = EXCLUDED.constituency_id,
  updated_at = timezone('utc'::text, now());
