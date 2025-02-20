-- Final Batch: Remaining Kisumu County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Nyando Constituency
    ('Ahero', 'Nyando', 'Kisumu'),
    ('Kabonyo/Kanyagwal', 'Nyando', 'Kisumu'),
    ('Kobura', 'Nyando', 'Kisumu'),
    ('Kodingo', 'Nyando', 'Kisumu'),
    ('East Kano/Wawidhi', 'Nyando', 'Kisumu'),

    -- Muhoroni Constituency
    ('Miwani', 'Muhoroni', 'Kisumu'),
    ('Ombeyi', 'Muhoroni', 'Kisumu'),
    ('Masogo/Nyang''oma', 'Muhoroni', 'Kisumu'),
    ('Chemelil', 'Muhoroni', 'Kisumu'),
    ('Muhoroni/Koru', 'Muhoroni', 'Kisumu'),

    -- Nyakach Constituency
    ('South East Nyakach', 'Nyakach', 'Kisumu'),
    ('West Nyakach', 'Nyakach', 'Kisumu'),
    ('North Nyakach', 'Nyakach', 'Kisumu'),
    ('Central Nyakach', 'Nyakach', 'Kisumu'),
    ('South West Nyakach', 'Nyakach', 'Kisumu'),

    -- Seme Constituency
    ('West Seme', 'Seme', 'Kisumu'),
    ('Central Seme', 'Seme', 'Kisumu'),
    ('East Seme', 'Seme', 'Kisumu'),
    ('North Seme', 'Seme', 'Kisumu')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
