INSERT INTO mps (name, constituency, party) VALUES
    ('Abdi Ali Abdi', 'Ijara', 'NAP-K'),
    ('Abdul Rahim Dawood', 'North Imenti', 'Independent'),
    ('Abdisirat Khalif Ali', 'Nominated', 'UDA'),
    ('Abdirahman Mohamed Abdi', 'Lafey', 'JP'),
    ('Abdirahman Husseinweytan Mohamed', 'Mandera East', 'ODM')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;
