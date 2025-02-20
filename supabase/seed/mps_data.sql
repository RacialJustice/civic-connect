insert into public.members_of_parliament (name, constituency, party) values
('Adagala Beatrice Kahai', 'Vihiga (CWR)', 'ANC'),
('Denar Joseph Hamisi', 'Nominated', 'ANC'),
('Gimose Charles Gumini', 'Hamisi', 'ANC'),
('IkanaM Frederick Lusuli', 'Shinyalu', 'ANC'),
('Injendi Moses Malulu', 'Malava', 'ANC'),
('Kagesi Kivai Ernest Ogesi', 'Vihiga', 'ANC'),
('Omboko Milemba Jeremiah', 'Emuhaya', 'ANC'),
('Tandaza Kassim Sawa', 'Matuga', 'ANC'),
('Koech Victor Kipngetich', 'Chepalungu', 'CCM'),
('Barasa Patrick Simiyu', 'Cherangany', 'DAP-K'),
('Bisau Maurice Kakai', 'Kiminini', 'DAP-K'),
('Oyugi Dick Maungu', 'Luanda', 'DAP-K'),
('Salasya Peter Kalerwa', 'Mumias East', 'DAP-K'),
('Wamboka Nelson Jack', 'Bumula', 'DAP-K'),
-- Continue with the rest of the MPs...
('Twalib Abubakar Ahmed', 'Nominated', 'WDM');

-- Add comment to table
comment on table public.members_of_parliament is 'Members of Parliament in Kenya';
