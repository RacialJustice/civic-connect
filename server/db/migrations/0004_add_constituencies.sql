-- Create constituencies table
CREATE TABLE IF NOT EXISTS constituencies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  county_id INTEGER REFERENCES counties(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_constituencies_county_id ON constituencies(county_id);
CREATE INDEX IF NOT EXISTS idx_constituencies_code ON constituencies(code);

-- Enable RLS
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON constituencies
  FOR SELECT USING (true);

-- Insert constituencies data
INSERT INTO constituencies (name, code, county_id) VALUES
  ('Changamwe', '001', (SELECT id FROM counties WHERE name = 'Mombasa')),
  ('Jomvu', '002', (SELECT id FROM counties WHERE name = 'Mombasa')),
  -- ...rest of the constituencies data...
  ('Mathare', '290', (SELECT id FROM counties WHERE name = 'Nairobi'))
ON CONFLICT (code) DO NOTHING;
