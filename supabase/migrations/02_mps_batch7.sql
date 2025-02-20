

INSERT INTO public.mps (name, constituency, party) 
VALUES 
    ('Wachira Rahab Mukami', 'Nyeri (CWR)', 'UDA'),
    ('Wainaina Antony Njoroge', 'Kieni', 'UDA'),
    ('Wainaina Michael Wambugu', 'Othaya', 'UDA'),
    ('Waithaka John Machua', 'Kiambu', 'UDA'),
    ('Wamacukuru James Githua Kamau', 'Kabete', 'UDA'),
    ('Wambilianga Catherine Nanjala', 'Busia (CWR)', 'FORD-K'),
    ('Wamboka Nelson Jack', 'Bumula', 'DAP-K'),
    ('Wamuchomba Gathoni', 'Githunguri', 'UDA'),
    ('Wandayi James Opiyo', 'Ugunja', 'ODM'),
    ('Wangaya Christopher Aseka', 'Khwisero', 'ODM'),
    ('Wangwe Emmanuel', 'Navakholo', 'ODM'),
    ('Wanjala Raphael Sauti Bitta', 'Budalangi', 'ODM'),
    ('Wanjira Martha Wangari', 'Gilgil', 'UDA'),
    ('Wanyonyi Ferdinand Kevin', 'Kwanza', 'FORD-K'),
    ('Wanyonyi Martin Pepela', 'Webuye West', 'FORD-K'),
    ('Waqo Naomi Jillo', 'Marsabit (CWR)', 'UDA'),
    ('Waweru John Kiarie', 'Dagoretti South', 'UDA'),
    ('Wehliye Adan Keynan', 'Eldas', 'JP'),
    ('Yakub Adow Kuno', 'Bura', 'UPIA'),
    ('Vacant', 'Banissa', 'Vacant')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;


