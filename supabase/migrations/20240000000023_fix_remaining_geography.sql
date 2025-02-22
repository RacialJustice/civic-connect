-- First fix counties
DO $$ 
BEGIN
    -- Add code column to counties if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'counties' AND column_name = 'code'
    ) THEN
        ALTER TABLE counties ADD COLUMN code text;
        ALTER TABLE counties ADD CONSTRAINT counties_code_key UNIQUE (code);
        
        -- Update existing counties
        UPDATE counties SET code = CASE
            WHEN name = 'Kisumu' THEN 'KSM'
            WHEN name = 'Nairobi' THEN 'NBI'
            WHEN name = 'Mombasa' THEN 'MSA'
            WHEN name = 'Nakuru' THEN 'NKR'
            WHEN name = 'Kiambu' THEN 'KBU'
            ELSE UPPER(SUBSTRING(name, 1, 3))
        END;
        
        ALTER TABLE counties ALTER COLUMN code SET NOT NULL;
    END IF;
END $$;

-- Then fix constituencies
DO $$ 
BEGIN
    -- Add code column to constituencies if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'constituencies' AND column_name = 'code'
    ) THEN
        ALTER TABLE constituencies ADD COLUMN code text;
        ALTER TABLE constituencies ADD CONSTRAINT constituencies_code_key UNIQUE (code);
        
        -- Update existing constituencies
        UPDATE constituencies c SET 
        code = CONCAT(
            UPPER(SUBSTRING(c.name, 1, 3)), 
            '-',
            (SELECT code FROM counties WHERE id = c.county_id)
        );
        
        ALTER TABLE constituencies ALTER COLUMN code SET NOT NULL;
    END IF;
END $$;

-- Finally fix wards
DO $$ 
BEGIN
    -- Add code column to wards if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'wards' AND column_name = 'code'
    ) THEN
        ALTER TABLE wards ADD COLUMN code text;
        ALTER TABLE wards ADD CONSTRAINT wards_code_key UNIQUE (code);
        
        -- Update existing wards
        UPDATE wards w SET 
        code = CONCAT(
            UPPER(SUBSTRING(w.name, 1, 3)),
            '-',
            (SELECT code FROM constituencies WHERE id = w.constituency_id)
        );
        
        ALTER TABLE wards ALTER COLUMN code SET NOT NULL;
    END IF;
END $$;
