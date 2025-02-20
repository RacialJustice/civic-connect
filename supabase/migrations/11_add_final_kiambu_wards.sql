-- Batch 3: Final Kiambu County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Thika Town Constituency
    ('Township', 'Thika Town', 'Kiambu'),
    ('Kamenu', 'Thika Town', 'Kiambu'),
    ('Hospital', 'Thika Town', 'Kiambu'),
    ('Gatuanyaga', 'Thika Town', 'Kiambu'),
    ('Ngoliba', 'Thika Town', 'Kiambu'),

    -- Lari Constituency
    ('Kinale', 'Lari', 'Kiambu'),
    ('Kijabe', 'Lari', 'Kiambu'),
    ('Nyanduma', 'Lari', 'Kiambu'),
    ('Kamburu', 'Lari', 'Kiambu'),
    ('Lari/Kirenga', 'Lari', 'Kiambu'),

    -- Gatundu North Constituency
    ('Gituamba', 'Gatundu North', 'Kiambu'),
    ('Githobokoni', 'Gatundu North', 'Kiambu'),
    ('Chania', 'Gatundu North', 'Kiambu'),
    ('Mang''u', 'Gatundu North', 'Kiambu'),

    -- Gatundu South Constituency
    ('Kiamwangi', 'Gatundu South', 'Kiambu'),
    ('Kiganjo', 'Gatundu South', 'Kiambu'),
    ('Ndarugu', 'Gatundu South', 'Kiambu'),
    ('Ngenda', 'Gatundu South', 'Kiambu')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
