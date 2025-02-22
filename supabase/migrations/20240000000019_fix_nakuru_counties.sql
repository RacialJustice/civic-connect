-- Update counties table first
DO $$ 
BEGIN
    -- First ensure code exists in counties
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'counties' AND column_name = 'code'
    ) THEN
        ALTER TABLE public.counties ADD COLUMN code text;
    END IF;

    -- Update Nakuru county code
    UPDATE counties 
    SET code = 'NKR'
    WHERE name = 'Nakuru' AND (code IS NULL OR code = '');

    -- Make code NOT NULL if not already
    ALTER TABLE public.counties ALTER COLUMN code SET NOT NULL;
END $$;

-- Update constituencies codes
UPDATE constituencies 
SET code = CASE 
    WHEN name = 'Nakuru Town West' THEN 'NTW-NKR'
    WHEN name = 'Nakuru Town East' THEN 'NTE-NKR'
    WHEN name = 'Naivasha' THEN 'NVA-NKR'
END
WHERE county_id = (SELECT id FROM counties WHERE name = 'Nakuru')
AND (code IS NULL OR code = '');
