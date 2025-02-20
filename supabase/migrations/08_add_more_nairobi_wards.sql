-- Batch 3: More Nairobi County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Dagoretti South Constituency
    ('Mutuini', 'Dagoretti South', 'Nairobi'),
    ('Ngando', 'Dagoretti South', 'Nairobi'),
    ('Riruta', 'Dagoretti South', 'Nairobi'),
    ('Uthiru/Ruthimitu', 'Dagoretti South', 'Nairobi'),
    ('Waithaka', 'Dagoretti South', 'Nairobi'),

    -- Embakasi Central Constituency
    ('Kayole North', 'Embakasi Central', 'Nairobi'),
    ('Kayole Central', 'Embakasi Central', 'Nairobi'),
    ('Kayole South', 'Embakasi Central', 'Nairobi'),
    ('Komarock', 'Embakasi Central', 'Nairobi'),
    ('Matopeni', 'Embakasi Central', 'Nairobi'),

    -- Embakasi North Constituency
    ('Kariobangi North', 'Embakasi North', 'Nairobi'),
    ('Dandora Area I', 'Embakasi North', 'Nairobi'),
    ('Dandora Area II', 'Embakasi North', 'Nairobi'),
    ('Dandora Area III', 'Embakasi North', 'Nairobi'),
    ('Dandora Area IV', 'Embakasi North', 'Nairobi')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
