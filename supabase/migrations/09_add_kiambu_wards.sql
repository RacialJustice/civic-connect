-- Batch 1: Kiambu County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Kiambaa Constituency
    ('Cianda', 'Kiambaa', 'Kiambu'),
    ('Karuri', 'Kiambaa', 'Kiambu'),
    ('Ndenderu', 'Kiambaa', 'Kiambu'),
    ('Muchatha', 'Kiambaa', 'Kiambu'),
    ('Kihara', 'Kiambaa', 'Kiambu'),

    -- Kikuyu Constituency
    ('Karai', 'Kikuyu', 'Kiambu'),
    ('Nachu', 'Kikuyu', 'Kiambu'),
    ('Sigona', 'Kikuyu', 'Kiambu'),
    ('Kikuyu', 'Kikuyu', 'Kiambu'),
    ('Kinoo', 'Kikuyu', 'Kiambu'),

    -- Limuru Constituency
    ('Bibirioni', 'Limuru', 'Kiambu'),
    ('Limuru Central', 'Limuru', 'Kiambu'),
    ('Ndeiya', 'Limuru', 'Kiambu'),
    ('Limuru East', 'Limuru', 'Kiambu'),
    ('Ngecha Tigoni', 'Limuru', 'Kiambu'),

    -- Kabete Constituency
    ('Gitaru', 'Kabete', 'Kiambu'),
    ('Muguga', 'Kabete', 'Kiambu'),
    ('Nyathuna', 'Kabete', 'Kiambu'),
    ('Kabete', 'Kabete', 'Kiambu'),
    ('Uthiru', 'Kabete', 'Kiambu')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
