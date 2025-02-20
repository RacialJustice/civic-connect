INSERT INTO public.mps (name, constituency, party)  
VALUES     
    ('Chumel Samwel Moroto', 'Kapenguria', 'UDA'),
    ('Denar Joseph Hamisi', 'Nominated', 'ANC'),
    ('Double N Pamela Njoki Njeru', 'Embu (CWR)', 'UDA'),
    ('Elachi Beatrice Kadeveresia', 'Dagoretti North', 'ODM'),
    ('Emathe Joseph Namuar', 'Turkana Central', 'UDA'),
    ('Farah Mohamed Ali', 'Wajir West', 'ODM'),
    ('Farah Yussuf Mohamed', 'Lagdera', 'ODM'),
    ('Francis Kajwang Tom Joseph', 'Ruaraka', 'ODM'),
    ('Gachagua George N.', 'Ndaragwa', 'UDA'),
    ('Gachobe Samuel Kinuthia', 'Subukia', 'UDA'),
    ('Gakuya James Mwangi', 'Embakasi North', 'UDA'),
    ('Gathiru Mejjadonk Benjamin', 'Embakasi Central', 'UDA'),
    ('Gichohi Kaguchia John Philip', 'Mukurweini', 'UDA')
ON CONFLICT (name) DO UPDATE  
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;