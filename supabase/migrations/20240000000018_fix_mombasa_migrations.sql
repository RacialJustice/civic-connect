-- Ensure code columns exist and are populated
DO $$ 
BEGIN
    -- First ensure constituencies have codes
    IF EXISTS (
        SELECT 1 FROM constituencies 
        WHERE code IS NULL AND county_id = (SELECT id FROM counties WHERE name = 'Mombasa')
    ) THEN
        UPDATE constituencies 
        SET code = CONCAT(
            CASE 
                WHEN name = 'Mvita' THEN 'MVT'
                WHEN name = 'Nyali' THEN 'NYL'
                WHEN name = 'Kisauni' THEN 'KSN'
                WHEN name = 'Changamwe' THEN 'CHG'
                WHEN name = 'Jomvu' THEN 'JMV'
                WHEN name = 'Likoni' THEN 'LKN'
                ELSE UPPER(SUBSTRING(name, 1, 3))
            END,
            '-MSA'
        )
        WHERE county_id = (SELECT id FROM counties WHERE name = 'Mombasa');
    END IF;
END $$;

-- Now insert wards with proper references
WITH constituency_refs AS (
    SELECT id, name, code 
    FROM constituencies 
    WHERE county_id = (SELECT id FROM counties WHERE name = 'Mombasa')
),
ward_inserts AS (
    SELECT 
        w.ward_name as name,
        CONCAT(w.ward_code, '-', c.code) as code,
        c.id as constituency_id
    FROM (VALUES
        ('Mkomani', 'MKM', 'Nyali'),
        ('Kongowea', 'KNG', 'Nyali'),
        ('Kadzandani', 'KDZ', 'Nyali'),
        ('Timbwani', 'TMB', 'Likoni'),
        ('Bofu', 'BFU', 'Likoni'),
        ('Mtongwe', 'MTG', 'Likoni')
    ) AS w(ward_name, ward_code, constituency_name)
    JOIN constituency_refs c ON c.name = w.constituency_name
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_inserts
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    updated_at = timezone('utc'::text, now());
