INSERT INTO mps (name, constituency, party) 
SELECT * FROM ( VALUES
    ('Abdi Ali Abdi', 'Ijara', 'NAP-K'),
    ('Abdul Rahim Dawood', 'North Imenti', 'Independent'),
    ('Abdisirat Khalif Ali', 'Nominated', 'UDA')
) AS data(name, constituency, party)
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;
