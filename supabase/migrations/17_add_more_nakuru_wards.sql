-- Batch 2: More Nakuru County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Gilgil Constituency
    ('Gilgil', 'Gilgil', 'Nakuru'),
    ('Elementaita', 'Gilgil', 'Nakuru'),
    ('Mbaruk/Eburu', 'Gilgil', 'Nakuru'),
    ('Malewa West', 'Gilgil', 'Nakuru'),
    ('Murindati', 'Gilgil', 'Nakuru'),

    -- Kuresoi North Constituency
    ('Sirikwa', 'Kuresoi North', 'Nakuru'),
    ('Kamara', 'Kuresoi North', 'Nakuru'),
    ('Kiptororo', 'Kuresoi North', 'Nakuru'),
    ('Nyota', 'Kuresoi North', 'Nakuru'),

    -- Kuresoi South Constituency
    ('Amalo', 'Kuresoi South', 'Nakuru'),
    ('Keringet', 'Kuresoi South', 'Nakuru'),
    ('Kiptagich', 'Kuresoi South', 'Nakuru'),
    ('Tinet', 'Kuresoi South', 'Nakuru'),

    -- Molo Constituency
    ('Elburgon', 'Molo', 'Nakuru'),
    ('Turi', 'Molo', 'Nakuru'),
    ('Mariashoni', 'Molo', 'Nakuru'),
    ('Molo', 'Molo', 'Nakuru')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
