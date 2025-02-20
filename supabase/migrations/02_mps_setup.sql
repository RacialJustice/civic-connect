-- Basic table setup without transaction commands
CREATE TABLE IF NOT EXISTS mps (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    constituency TEXT NOT NULL,
    party TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
