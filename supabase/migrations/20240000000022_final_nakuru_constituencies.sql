-- Ensure constituencies have code column and values
ALTER TABLE constituencies ADD COLUMN IF NOT EXISTS code text;

-- Insert final Nakuru constituencies with codes
WITH county_data AS (
  SELECT id FROM counties WHERE name = 'Nakuru'
)
INSERT INTO constituencies (name, code, county_id)
VALUES 
  ('Subukia', 'SBK-NKR', (SELECT id FROM county_data)),
  ('Bahati', 'BHT-NKR', (SELECT id FROM county_data)),
  ('Kuresoi', 'KRS-NKR', (SELECT id FROM county_data))
ON CONFLICT (name, county_id) DO UPDATE SET code = EXCLUDED.code;
