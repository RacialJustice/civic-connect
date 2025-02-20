

INSERT INTO public.mps (name, constituency, party) 
VALUES 
    ('Lesuuda Josephine Naisula', 'Samburu West', 'KANU'),
    ('Letipila Dominic Eli', 'Samburu North', 'UDA'),
    ('Lochakapong Peter', 'Sigor', 'UDA'),
    ('Logova Sloya Clement', 'Sabatia', 'UDA'),
    ('Lomwa Joseph Samal', 'Isiolo North', 'JP'),
    ('Luyai Caleb Amisi', 'Saboti', 'ODM'),
    ('M''Anaiba Julius Taitumu', 'Igembe North', 'UDA'),
    ('Maalim Farah', 'Dadaab', 'WDM'),
    ('Machele Mohamed Soud', 'Mvita', 'ODM'),
    ('Maina Betty Njeri', 'Murang''a (CWR)', 'UDA'),
    ('Maina Jane Njeri', 'Kirinyaga (CWR)', 'UDA'),
    ('Maina Mwago Amos', 'Starehe', 'JP'),
    ('Maingi Mary', 'Mwea', 'UDA'),
    ('Makali John Okwisia', 'Kanduyi', 'FORD-K'),
    ('Manduku Daniel Ogwoka', 'Nyaribari Masaba', 'ODM'),
    ('Marubu Monicah Muthoni', 'Lamu (CWR)', 'Independent'),
    ('Masara Peter Francis', 'Suna West', 'ODM'),
    ('Masito Fatuma Hamisi', 'Kwale (CWR)', 'ODM'),
    ('Mathenge Duncan Maina', 'Nyeri Town', 'UDA'),
    ('Mawathe Julius Musili', 'Embakasi South', 'WDM')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;

