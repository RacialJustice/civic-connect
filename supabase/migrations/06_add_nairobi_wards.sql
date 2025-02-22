-- First, transform your data to match your table structure
WITH ward_data AS (
  SELECT 
    w.name, 
    w.name AS code, 
    c.id AS constituency_id
  FROM (VALUES
    ('Kitisuru', 'Westlands', 'Nairobi'),
    ('Parklands/Highridge', 'Westlands', 'Nairobi'),
    ('Karura', 'Westlands', 'Nairobi'),
    ('Kangemi', 'Westlands', 'Nairobi'),
    ('Mountain View', 'Westlands', 'Nairobi'),
    
    ('Kilimani', 'Dagoretti North', 'Nairobi'),
    ('Kawangware', 'Dagoretti North', 'Nairobi'),
    ('Gatina', 'Dagoretti North', 'Nairobi'),
    ('Kileleshwa', 'Dagoretti North', 'Nairobi'),
    ('Kabiro', 'Dagoretti North', 'Nairobi'),
    
    ('Roysambu', 'Roysambu', 'Nairobi'),
    ('Garden Estate', 'Roysambu', 'Nairobi'),
    ('Ridgeways', 'Roysambu', 'Nairobi'),
    ('Githurai', 'Roysambu', 'Nairobi'),
    ('Kahawa West', 'Roysambu', 'Nairobi')
  ) AS w(name, constituency, county)
  JOIN constituencies c ON c.name = w.constituency
  JOIN counties co ON co.name = w.county AND c.county_id = co.id
)
-- Now insert the data
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id FROM ward_data
ON CONFLICT (name, constituency_id) 
DO UPDATE SET code = EXCLUDED.code;