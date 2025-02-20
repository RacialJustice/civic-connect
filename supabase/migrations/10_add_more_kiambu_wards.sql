-- Batch 2: More Kiambu County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Juja Constituency
    ('Murera', 'Juja', 'Kiambu'),
    ('Theta', 'Juja', 'Kiambu'),
    ('Juja', 'Juja', 'Kiambu'),
    ('Witeithie', 'Juja', 'Kiambu'),
    ('Kalimoni', 'Juja', 'Kiambu'),

    -- Kiambu Town Constituency
    ('Township', 'Kiambu Town', 'Kiambu'),
    ('Riabai', 'Kiambu Town', 'Kiambu'),
    ('Ndumberi', 'Kiambu Town', 'Kiambu'),
    ('Tinganga', 'Kiambu Town', 'Kiambu'),
    ('Ikinu', 'Kiambu Town', 'Kiambu'),

    -- Githunguri Constituency
    ('Githunguri', 'Githunguri', 'Kiambu'),
    ('Githiga', 'Githunguri', 'Kiambu'),
    ('Ikinu', 'Githunguri', 'Kiambu'),
    ('Ngewa', 'Githunguri', 'Kiambu'),
    ('Komothai', 'Githunguri', 'Kiambu'),

    -- Ruiru Constituency
    ('Gitothua', 'Ruiru', 'Kiambu'),
    ('Biashara', 'Ruiru', 'Kiambu'),
    ('Gatongora', 'Ruiru', 'Kiambu'),
    ('Kahawa Wendani', 'Ruiru', 'Kiambu'),
    ('Kahawa Sukari', 'Ruiru', 'Kiambu')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
