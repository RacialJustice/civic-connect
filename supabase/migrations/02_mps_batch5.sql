

INSERT INTO public.mps (name, constituency, party) 
VALUES 
    ('Ngikolong Nicholas Ngikor Nixon', 'Turkana East', 'JP'),
    ('Ngitit Cecilia Asinyen', 'Turkana (CWR)', 'UDA'),
    ('Nguna Charles Ngusya', 'Mwingi West', 'WDM'),
    ('Nguro Onesmus Ngogoyo', 'Kajiado North', 'UDA'),
    ('Njoroge Mary Wamaua Waithira', 'Maragwa', 'UDA'),
    ('Njuguna Chege', 'Kandara', 'UDA'),
    ('Ntwiga Patrick Munene', 'Chuka/Igambang''ombe', 'UDA'),
    ('Nyamai Rachael Kaki', 'Kitui South', 'JP'),
    ('Nyamita Mark Ogolla', 'Uriri', 'ODM'),
    ('Nyamoko Joash Nyamache', 'North Mugirango', 'UDA'),
    ('Nyenze Edith Vethi', 'Kitui West', 'WDM'),
    ('Nyikal James Wambura', 'Seme', 'ODM'),
    ('Nzioka Erastus Kivasu', 'Mbooni', 'WDM'),
    ('Nzambia Thudeeus Kithua', 'Kilome', 'WDM'),
    ('Nzengu Paul Musyimi', 'Mwingi North', 'WDM'),
    ('Nyoro Samson Ndindi', 'Kiharu', 'UDA'),
    ('Obara Eve Akinyi', 'Kabondo Kasipul', 'ODM'),
    ('Obo Ruweida Mohamed', 'Lamu East', 'JP'),
    ('Ochanda Gideon', 'Bondo', 'ODM'),
    ('Ochieng David Ouma', 'Ugenya', 'MDG')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;


