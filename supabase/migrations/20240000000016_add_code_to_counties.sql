-- Add code column to counties if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'counties' 
        AND column_name = 'code'
    ) THEN
        ALTER TABLE public.counties ADD COLUMN code text;
        -- Add unique constraint to code
        ALTER TABLE public.counties ADD CONSTRAINT counties_code_key UNIQUE (code);
    END IF;
END $$;

-- Update existing counties with codes
UPDATE public.counties
SET code = CASE
    WHEN name = 'Nairobi' THEN 'NBI'
    WHEN name = 'Kiambu' THEN 'KBU'
    WHEN name = 'Mombasa' THEN 'MSA'
    WHEN name = 'Nakuru' THEN 'NKR'
    WHEN name = 'Kisumu' THEN 'KSM'
    ELSE UPPER(SUBSTRING(name, 1, 3))
END
WHERE code IS NULL;

-- Make code column NOT NULL after updating existing records
ALTER TABLE public.counties ALTER COLUMN code SET NOT NULL;
