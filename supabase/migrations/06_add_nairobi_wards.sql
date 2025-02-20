-- Batch 1: Nairobi County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Westlands Constituency
    ('Kitisuru', 'Westlands', 'Nairobi'),
    ('Parklands/Highridge', 'Westlands', 'Nairobi'),
    ('Karura', 'Westlands', 'Nairobi'),
    ('Kangemi', 'Westlands', 'Nairobi'),
    ('Mountain View', 'Westlands', 'Nairobi'),
    
    -- Dagoretti North Constituency
    ('Kilimani', 'Dagoretti North', 'Nairobi'),
    ('Kawangware', 'Dagoretti North', 'Nairobi'),
    ('Gatina', 'Dagoretti North', 'Nairobi'),
    ('Kileleshwa', 'Dagoretti North', 'Nairobi'),
    ('Kabiro', 'Dagoretti North', 'Nairobi'),
    
    -- Roysambu Constituency
    ('Roysambu', 'Roysambu', 'Nairobi'),
    ('Garden Estate', 'Roysambu', 'Nairobi'),
    ('Ridgeways', 'Roysambu', 'Nairobi'),
    ('Githurai', 'Roysambu', 'Nairobi'),
    ('Kahawa West', 'Roysambu', 'Nairobi')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
