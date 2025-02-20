-- Setup table and constraints
CREATE TABLE IF NOT EXISTS public.mps (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    constituency TEXT NOT NULL,
    party TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'mps_name_unique'
    ) THEN
        ALTER TABLE public.mps ADD CONSTRAINT mps_name_unique UNIQUE (name);
    END IF;
END $$;

-- First 25 MPs (A-B)
INSERT INTO public.mps (name, constituency, party) VALUES 
    ('Abdi Ali Abdi', 'Ijara', 'NAP-K'),
    ('Abdul Rahim Dawood', 'North Imenti', 'Independent'),
    ('Abdisirat Khalif Ali', 'Nominated', 'UDA'),
    ('Abdirahman Mohamed Abdi', 'Lafey', 'JP'),
    ('Abdirahman Husseinweytan Mohamed', 'Mandera East', 'ODM')
ON CONFLICT (name) DO UPDATE 
SET constituency = EXCLUDED.constituency,
    party = EXCLUDED.party;