-- Create table if not exists
CREATE TABLE IF NOT EXISTS mps (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    constituency TEXT NOT NULL,
    party TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simple insert without the complex constraints
INSERT INTO mps (name, constituency, party) VALUES
    ('Abdi Ali Abdi', 'Ijara', 'NAP-K'),
    ('Abdul Rahim Dawood', 'North Imenti', 'Independent'),
    ('Abdisirat Khalif Ali', 'Nominated', 'UDA'),
    ('Abdirahman Mohamed Abdi', 'Lafey', 'JP'),
    ('Abdirahman Husseinweytan Mohamed', 'Mandera East', 'ODM'),
    ('Abdullahi Amina Dika', 'Tana River (CWR)', 'KANU'),
    ('Abdullahi Bashir Sheikh', 'Mandera North', 'UDM'),
    ('Abubakar Ahmed Twalib', 'Nominated', 'WDM'),
    ('Abuor Paul', 'Rongo', 'ODM'),
    ('Adagala Beatrice Kahai', 'Vihiga (CWR)', 'ANC'),
    ('Adow Mohamed Aden', 'Wajir South', 'ODM'),
    ('Ahmed Shakeel Ahmed Shabbir', 'Kisumu East', 'Independent'),
    ('Akuja Protus Ewesit', 'Loima', 'UDA'),
    ('Alfah Miruka Ondieki', 'Bomachoge Chache', 'UDA'),
    ('Amollo Paul Otiende', 'Rarieda', 'ODM'),
    ('Arama Samuel', 'Nakuru Town West', 'JP'),
    ('Aburi Lawrence Mpuru', 'Tigania East', 'NOPEU'),
    ('Aburi Donya Dorice', 'Kisii (CWR)', 'WDM'),
    ('Bader Salim Feisal', 'Msambweni', 'UDA'),
    ('Bady Bady Twalib', 'Jomvu', 'ODM'),
    ('Barasa Didmus Wekesa', 'Kimilili', 'UDA'),
    ('Barasa Patrick Simiyu', 'Cherangany', 'DAP-K'),
    ('Barongo Nolfason Obadiah', 'Bomachoge Borabu', 'ODM'),
    ('Barre Hussein Abdi', 'Tarbaj', 'UDA'),
    ('Barrow Dekow Mohamed', 'Garissa Township', 'UDA')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;
