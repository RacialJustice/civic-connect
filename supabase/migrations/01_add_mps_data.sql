DROP TABLE IF EXISTS mps;

CREATE TABLE mps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  constituency TEXT NOT NULL,
  party TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

INSERT INTO public.mps (name, constituency, party) VALUES
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
('Ruku Geoffrey Kariuki Kiringa', 'Mbeere North', 'DP'),
('Kalasinga Joseph Simiyu Wekesa', 'Kabuchai', 'FORD-K'),
('Makali John Okwisia', 'Kanduyi', 'FORD-K'),
('Murumba John Chikati', 'Tongaren', 'FORD-K'),
('Wambilianga Catherine Nanjala', 'Busia (CWR)', 'FORD-K'),
('Wanyonyi Ferdinand Kevin', 'Kwanza', 'FORD-K'),
('Wanyonyi Martin Pepela', 'Webuye West', 'FORD-K')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;