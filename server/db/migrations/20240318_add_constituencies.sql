CREATE TABLE constituencies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  county_id INTEGER REFERENCES counties(id)
);

CREATE INDEX idx_constituencies_county_id ON constituencies(county_id);
CREATE INDEX idx_constituencies_code ON constituencies(code);
