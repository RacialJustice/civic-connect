INSERT INTO mps (name, constituency, party) 
SELECT t.* 
FROM (VALUES
    ('Chumel Samwel Moroto', 'Kapenguria', 'UDA'),
    ('Denar Joseph Hamisi', 'Nominated', 'ANC'),
    ('Double N Pamela Njoki Njeru', 'Embu (CWR)', 'UDA'),
    ('Elachi Beatrice Kadeveresia', 'Dagoretti North', 'ODM'),
    ('Emathe Joseph Namuar', 'Turkana Central', 'UDA')
) AS t(name, constituency, party)
ON CONFLICT (name) 
DO UPDATE SET 
    constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;

