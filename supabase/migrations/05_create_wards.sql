CREATE TABLE IF NOT EXISTS wards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    constituency TEXT NOT NULL,
    county TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, constituency, county)
);

INSERT INTO wards (name, constituency, county) VALUES
    -- Nairobi - Westlands
    ('Kitisuru', 'Westlands', 'Nairobi'),
    ('Parklands/Highridge', 'Westlands', 'Nairobi'),
    ('Karura', 'Westlands', 'Nairobi'),
    ('Kangemi', 'Westlands', 'Nairobi'),
    ('Mountain View', 'Westlands', 'Nairobi'),
    
    -- Nairobi - Dagoretti North
    ('Kilimani', 'Dagoretti North', 'Nairobi'),
    ('Kawangware', 'Dagoretti North', 'Nairobi'),
    ('Gatina', 'Dagoretti North', 'Nairobi'),
    ('Kileleshwa', 'Dagoretti North', 'Nairobi'),
    ('Kabiro', 'Dagoretti North', 'Nairobi'),
    
    -- Kiambu - Kabete
    ('Gitaru', 'Kabete', 'Kiambu'),
    ('Muguga', 'Kabete', 'Kiambu'),
    ('Nyadhuna', 'Kabete', 'Kiambu'),
    ('Kabete', 'Kabete', 'Kiambu'),
    ('Uthiru', 'Kabete', 'Kiambu'),
    ('Kahuho', 'Kabete', 'Kiambu')
ON CONFLICT (name, constituency, county) 
DO UPDATE SET name = EXCLUDED.name;
