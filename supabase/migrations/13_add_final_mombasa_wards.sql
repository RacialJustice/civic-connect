-- Final Batch: Remaining Mombasa County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Likoni Constituency
    ('Mtongwe', 'Likoni', 'Mombasa'),
    ('Shika Adabu', 'Likoni', 'Mombasa'),
    ('Bofu', 'Likoni', 'Mombasa'),
    ('Likoni', 'Likoni', 'Mombasa'),
    ('Timbwani', 'Likoni', 'Mombasa'),

    -- Changamwe Constituency
    ('Port Reitz', 'Changamwe', 'Mombasa'),
    ('Kipevu', 'Changamwe', 'Mombasa'),
    ('Airport', 'Changamwe', 'Mombasa'),
    ('Changamwe', 'Changamwe', 'Mombasa'),
    ('Chaani', 'Changamwe', 'Mombasa')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
