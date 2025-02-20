

INSERT INTO public.mps (name, constituency, party) 
VALUES 
    ('Karauri Ronald Kamwiko', 'Kasarani', 'Independent'),
    ('Karani Stephen Wachira', 'Laikipia West', 'UDA'),
    ('Karemba Eric Muchangi Njiru', 'Runyenjes', 'UDA'),
    ('Karitho Kiili Daniel', 'Igembe Central', 'JP'),
    ('Kasalu Irene Muthoni', 'Kitui (CWR)', 'WDM'),
    ('Kasiwai Rael Chepkemoi', 'West Pokot (CWR)', 'KUP'),
    ('Katana Paul Kahindi', 'Kaloleni', 'ODM'),
    ('Kemei Beatrice Chepngeno', 'Kericho (CWR)', 'UDA'),
    ('Kemei Justice Kipsang', 'Sigowet/Soin', 'UDA'),
    ('Kemero Maisori Marwa Kitayama', 'Kuria East', 'UDA'),
    ('Khamis Chome Abdi', 'Voi', 'WDM'),
    ('Khodhe Phelix Odiwuor', 'Langata', 'ODM'),
    ('Kiamba Suzanne Ndunge', 'Makueni', 'WDM'),
    ('Kiaraho David Njuguna', 'Ol Kalou', 'JP'),
    ('Kibagendi Antoney', 'Kitutu Chache South', 'ODM'),
    ('Kihara Jayne Wanjiru Njeru', 'Naivasha', 'UDA'),
    ('Kihungi Peter Irungu', 'Kangema', 'UDA'),
    ('Kilel Richard Cheruiyot', 'Bomet Central', 'UDA'),
    ('Kimani Francis Kuria', 'Molo', 'UDA'),
    ('Kimilu Joshua Kivinda', 'Kaiti', 'WDM')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;


