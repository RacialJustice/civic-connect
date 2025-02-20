-- Batch 1: Mombasa County Wards
INSERT INTO wards (name, constituency, county) VALUES
    -- Mvita Constituency
    ('Mji wa Kale/Makadara', 'Mvita', 'Mombasa'),
    ('Tudor', 'Mvita', 'Mombasa'),
    ('Tononoka', 'Mvita', 'Mombasa'),
    ('King''orani', 'Mvita', 'Mombasa'),
    ('Majengo', 'Mvita', 'Mombasa'),

    -- Nyali Constituency
    ('Frere Town', 'Nyali', 'Mombasa'),
    ('Ziwa la Ng''ombe', 'Nyali', 'Mombasa'),
    ('Mkomani', 'Nyali', 'Mombasa'),
    ('Kongowea', 'Nyali', 'Mombasa'),
    ('Kadzandani', 'Nyali', 'Mombasa'),

    -- Jomvu Constituency
    ('Jomvu Kuu', 'Jomvu', 'Mombasa'),
    ('Miritini', 'Jomvu', 'Mombasa'),
    ('Mikindani', 'Jomvu', 'Mombasa'),

    -- Kisauni Constituency
    ('Mjambere', 'Kisauni', 'Mombasa'),
    ('Junda', 'Kisauni', 'Mombasa'),
    ('Bamburi', 'Kisauni', 'Mombasa'),
    ('Mwakirunge', 'Kisauni', 'Mombasa'),
    ('Mtopanga', 'Kisauni', 'Mombasa'),
    ('Magogoni', 'Kisauni', 'Mombasa'),
    ('Shanzu', 'Kisauni', 'Mombasa')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
