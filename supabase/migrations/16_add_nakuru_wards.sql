-- Batch 1: Nakuru County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Nakuru Town West Constituency
    ('Barut', 'Nakuru Town West', 'Nakuru'),
    ('London', 'Nakuru Town West', 'Nakuru'),
    ('Kaptembwo', 'Nakuru Town West', 'Nakuru'),
    ('Kapkures', 'Nakuru Town West', 'Nakuru'),
    ('Rhoda', 'Nakuru Town West', 'Nakuru'),
    ('Shaabab', 'Nakuru Town West', 'Nakuru'),

    -- Nakuru Town East Constituency
    ('Biashara', 'Nakuru Town East', 'Nakuru'),
    ('Kivumbini', 'Nakuru Town East', 'Nakuru'),
    ('Flamingo', 'Nakuru Town East', 'Nakuru'),
    ('Menengai', 'Nakuru Town East', 'Nakuru'),
    ('Nakuru East', 'Nakuru Town East', 'Nakuru'),

    -- Naivasha Constituency
    ('Biashara', 'Naivasha', 'Nakuru'),
    ('Hellsgate', 'Naivasha', 'Nakuru'),
    ('Lake View', 'Naivasha', 'Nakuru'),
    ('Maai Mahiu', 'Naivasha', 'Nakuru'),
    ('Maiella', 'Naivasha', 'Nakuru'),
    ('Olkaria', 'Naivasha', 'Nakuru'),
    ('Viwandani', 'Naivasha', 'Nakuru')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
