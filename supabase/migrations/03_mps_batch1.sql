-- First batch of MPs without transaction commands
INSERT INTO mps (name, constituency, party) VALUES
    ('Abdi Ali Abdi', 'Ijara', 'NAP-K'),
    ('Abdul Rahim Dawood', 'North Imenti', 'Independent'),
    ('Abdisirat Khalif Ali', 'Nominated', 'UDA')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;
