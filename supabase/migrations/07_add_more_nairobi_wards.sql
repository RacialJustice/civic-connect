-- Batch 2: More Nairobi County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Embakasi East Constituency
    ('Upper Savanna', 'Embakasi East', 'Nairobi'),
    ('Lower Savanna', 'Embakasi East', 'Nairobi'),
    ('Embakasi', 'Embakasi East', 'Nairobi'),
    ('Utawala', 'Embakasi East', 'Nairobi'),
    ('Mihango', 'Embakasi East', 'Nairobi'),

    -- Embakasi West Constituency
    ('Umoja I', 'Embakasi West', 'Nairobi'),
    ('Umoja II', 'Embakasi West', 'Nairobi'),
    ('Mowlem', 'Embakasi West', 'Nairobi'),
    ('Kariobangi South', 'Embakasi West', 'Nairobi'),

    -- Kasarani Constituency
    ('Clay City', 'Kasarani', 'Nairobi'),
    ('Mwiki', 'Kasarani', 'Nairobi'),
    ('Kasarani', 'Kasarani', 'Nairobi'),
    ('Njiru', 'Kasarani', 'Nairobi'),
    ('Ruai', 'Kasarani', 'Nairobi')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
