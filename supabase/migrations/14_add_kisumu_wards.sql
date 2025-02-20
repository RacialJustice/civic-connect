-- Batch 1: Kisumu County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Kisumu Central Constituency
    ('Railways', 'Kisumu Central', 'Kisumu'),
    ('Migosi', 'Kisumu Central', 'Kisumu'),
    ('Shaurimoyo Kaloleni', 'Kisumu Central', 'Kisumu'),
    ('Market Milimani', 'Kisumu Central', 'Kisumu'),
    ('Kondele', 'Kisumu Central', 'Kisumu'),

    -- Kisumu East Constituency
    ('Kajulu', 'Kisumu East', 'Kisumu'),
    ('Kolwa East', 'Kisumu East', 'Kisumu'),
    ('Manyatta B', 'Kisumu East', 'Kisumu'),
    ('Nyalenda A', 'Kisumu East', 'Kisumu'),
    ('Kolwa Central', 'Kisumu East', 'Kisumu'),

    -- Kisumu West Constituency
    ('South West Kisumu', 'Kisumu West', 'Kisumu'),
    ('Central Kisumu', 'Kisumu West', 'Kisumu'),
    ('North West Kisumu', 'Kisumu West', 'Kisumu'),
    ('West Kisumu', 'Kisumu West', 'Kisumu'),
    ('North Kisumu', 'Kisumu West', 'Kisumu')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
