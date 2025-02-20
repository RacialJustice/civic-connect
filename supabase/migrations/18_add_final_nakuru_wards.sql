-- Final Batch: Remaining Nakuru County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Njoro Constituency
    ('Njoro', 'Njoro', 'Nakuru'),
    ('Mau Narok', 'Njoro', 'Nakuru'),
    ('Mauche', 'Njoro', 'Nakuru'),
    ('Kihingo', 'Njoro', 'Nakuru'),
    ('Nessuit', 'Njoro', 'Nakuru'),
    ('Lare', 'Njoro', 'Nakuru'),

    -- Rongai Constituency
    ('Menengai West', 'Rongai', 'Nakuru'),
    ('Soin', 'Rongai', 'Nakuru'),
    ('Visoi', 'Rongai', 'Nakuru'),
    ('Mosop', 'Rongai', 'Nakuru'),
    ('Solai', 'Rongai', 'Nakuru'),

    -- Subukia Constituency
    ('Subukia', 'Subukia', 'Nakuru'),
    ('Waseges', 'Subukia', 'Nakuru'),
    ('Kabazi', 'Subukia', 'Nakuru')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
