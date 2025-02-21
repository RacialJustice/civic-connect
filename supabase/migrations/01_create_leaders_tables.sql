-- Create Members of Parliament table
CREATE TABLE IF NOT EXISTS members_of_parliament (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    constituency TEXT NOT NULL UNIQUE,
    county TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Governors table
CREATE TABLE IF NOT EXISTS governors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    county TEXT NOT NULL UNIQUE,
    contact TEXT,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Senators table
CREATE TABLE IF NOT EXISTS senators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    county TEXT NOT NULL UNIQUE,
    contact TEXT,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE members_of_parliament ENABLE ROW LEVEL SECURITY;
ALTER TABLE governors ENABLE ROW LEVEL SECURITY;
ALTER TABLE senators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access to MPs"
    ON members_of_parliament FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to governors"
    ON governors FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to senators"
    ON senators FOR SELECT
    USING (true);
