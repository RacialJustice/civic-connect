

INSERT INTO public.mps (name, constituency, party) 
VALUES 
    ('Odanga Geoffrey Makokha', 'Matayos', 'ODM'),
    ('Odege Tom Mboya', 'Nyatike', 'ODM'),
    ('Odhiambo Elisha Ochieng', 'Gem', 'ODM'),
    ('Odhiambo Millie Grace Akoth', 'Suba North', 'ODM'),
    ('Odoyo Okello Jared', 'Nyando', 'ODM'),
    ('Oduor Christine Ombaka', 'Siaya (CWR)', 'ODM'),
    ('Oku Edward Kaunya', 'Teso North', 'ODM'),
    ('Okuome Andrew Adipo', 'Karachuonyo', 'ODM'),
    ('Oluoch Anthony Tom', 'Mathare', 'ODM'),
    ('Omanyo Catherine Nakhabi', 'Busia (CWR)', 'ODM'),
    ('Omboko Milemba Jeremiah', 'Emuhaya', 'ANC'),
    ('Omondi Caroli', 'Suba South', 'ODM'),
    ('Omwera George Aladwa', 'Makadara', 'ODM'),
    ('Onchoke Charles', 'Bonchari', 'UPA'),
    ('Ongili Babu Owino Paul', 'Embakasi East', 'ODM'),
    ('Onyiego Silvanus Osoro', 'South Mugirango', 'UDA'),
    ('Orero Peter Ochieng', 'Kibra', 'ODM'),
    ('Oron Joshua Odongo', 'Kisumu Central', 'ODM'),
    ('Osero Patrick Kibagendi', 'Borabu', 'ODM'),
    ('Osogo Bensuda Joyce Atieno', 'Homa Bay (CWR)', 'ODM')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;


