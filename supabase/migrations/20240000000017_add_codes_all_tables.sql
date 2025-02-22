-- Safely handle existing constraints
DO $$ 
BEGIN
    -- Drop constraints only if they exist
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'counties_code_key'
    ) THEN
        ALTER TABLE counties DROP CONSTRAINT counties_code_key;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'constituencies_code_key'
    ) THEN
        ALTER TABLE constituencies DROP CONSTRAINT constituencies_code_key;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'wards_code_key'
    ) THEN
        ALTER TABLE wards DROP CONSTRAINT wards_code_key;
    END IF;
END $$;

-- Add code columns to all geography tables if they don't exist
DO $$ 
BEGIN
    -- Add code to counties first and populate
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'counties' AND column_name = 'code'
    ) THEN
        ALTER TABLE counties ADD COLUMN code text;
    END IF;

    -- Update counties codes
    UPDATE counties 
    SET code = CASE 
        WHEN name = 'Mombasa' THEN 'MSA'
        WHEN name = 'Nairobi' THEN 'NBI'
        WHEN name = 'Kiambu' THEN 'KBU'
        WHEN name = 'Nakuru' THEN 'NKR'
        WHEN name = 'Kisumu' THEN 'KSM'
        ELSE UPPER(SUBSTRING(REGEXP_REPLACE(name, '[^a-zA-Z]', '', 'g'), 1, 3))
    END
    WHERE code IS NULL OR code = '';

    -- Add code to constituencies and populate
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'constituencies' AND column_name = 'code'
    ) THEN
        ALTER TABLE constituencies ADD COLUMN code text;
    END IF;

    -- Update constituencies with codes
    UPDATE constituencies c
    SET code = CONCAT(
        UPPER(SUBSTRING(REGEXP_REPLACE(c.name, '[^a-zA-Z]', '', 'g'), 1, 3)),
        '-',
        COALESCE((SELECT code FROM counties WHERE id = c.county_id), 'UNK')
    )
    WHERE c.code IS NULL OR c.code = '';

    -- Add code to wards and populate
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'wards' AND column_name = 'code'
    ) THEN
        ALTER TABLE wards ADD COLUMN code text;
    END IF;

    -- Update wards with codes
    UPDATE wards w
    SET code = CONCAT(
        UPPER(SUBSTRING(REGEXP_REPLACE(w.name, '[^a-zA-Z]', '', 'g'), 1, 3)),
        '-',
        COALESCE((
            SELECT code 
            FROM constituencies 
            WHERE id = w.constituency_id
        ), 'UNK')
    )
    WHERE w.code IS NULL OR w.code = '';

    -- Now add constraints after data is populated
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'counties_code_key'
    ) THEN
        ALTER TABLE counties ADD CONSTRAINT counties_code_key UNIQUE (code);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'constituencies_code_key'
    ) THEN
        ALTER TABLE constituencies ADD CONSTRAINT constituencies_code_key UNIQUE (code);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'wards_code_key'
    ) THEN
        ALTER TABLE wards ADD CONSTRAINT wards_code_key UNIQUE (code);
    END IF;

    -- Finally make columns NOT NULL
    ALTER TABLE counties ALTER COLUMN code SET NOT NULL;
    ALTER TABLE constituencies ALTER COLUMN code SET NOT NULL;
    ALTER TABLE wards ALTER COLUMN code SET NOT NULL;
END $$;
