-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table first (this connects with auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    village TEXT,
    ward TEXT,
    constituency TEXT,
    county TEXT,
    country TEXT DEFAULT 'Kenya',
    role TEXT DEFAULT 'citizen',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    verification_token_expiry TIMESTAMPTZ,
    interests JSONB DEFAULT '[]',
    profile_complete BOOLEAN DEFAULT FALSE,
    registration_step TEXT DEFAULT 'location',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (true);

-- Create officials table
CREATE TABLE IF NOT EXISTS officials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    level TEXT NOT NULL,
    position TEXT NOT NULL,
    house_type TEXT,
    representation_type TEXT,
    party TEXT,
    photo TEXT,
    email TEXT,
    phone TEXT,
    village TEXT,
    ward TEXT,
    constituency TEXT,
    county TEXT,
    country TEXT DEFAULT 'Kenya',
    term_start TIMESTAMPTZ,
    term_end TIMESTAMPTZ,
    responsibilities TEXT,
    social_media JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on officials
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for officials
CREATE POLICY "Officials are viewable by everyone" 
    ON officials FOR SELECT 
    USING (true);

-- Create forums table
CREATE TABLE IF NOT EXISTS forums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    village TEXT,
    ward TEXT,
    constituency TEXT,
    county TEXT,
    moderation_enabled BOOLEAN DEFAULT TRUE,
    membership_type TEXT DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on forums
ALTER TABLE forums ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for forums
CREATE POLICY "Forums are viewable by everyone" 
    ON forums FOR SELECT 
    USING (true);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    forum_id UUID NOT NULL REFERENCES forums(id),
    author_id UUID NOT NULL REFERENCES profiles(id),
    pinned BOOLEAN DEFAULT FALSE,
    locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for posts
CREATE POLICY "Posts are viewable by everyone" 
    ON posts FOR SELECT 
    USING (true);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id),
    author_id UUID NOT NULL REFERENCES profiles(id),
    parent_id UUID REFERENCES comments(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" 
    ON comments FOR SELECT 
    USING (true);

-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    leader_id UUID NOT NULL REFERENCES officials(id),
    content TEXT NOT NULL,
    rating INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on feedbacks
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for feedbacks
CREATE POLICY "Feedbacks are viewable by everyone" 
    ON feedbacks FOR SELECT 
    USING (true);

-- Create function to automatically set updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON forums
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();