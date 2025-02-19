CREATE TABLE IF NOT EXISTS constituencies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  county_id INTEGER REFERENCES counties(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_constituencies_county_id ON constituencies(county_id);
CREATE INDEX IF NOT EXISTS idx_constituencies_code ON constituencies(code);
