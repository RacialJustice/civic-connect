
import { createClient } from '@supabase/supabase-js';
import { Database } from '../shared/schema';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing');
  throw new Error('Missing required Supabase configuration. Please check your environment variables.');
}

const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey
);

async function createTables() {
  const { error } = await supabase.rpc('exec_sql', {
    sql_string: `
      -- Create tables
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        village TEXT,
        ward TEXT,
        constituency TEXT,
        county TEXT,
        country TEXT DEFAULT 'Kenya' NOT NULL,
        role TEXT DEFAULT 'citizen' NOT NULL,
        level TEXT,
        email_verified BOOLEAN DEFAULT FALSE NOT NULL,
        verification_token TEXT,
        verification_token_expiry TIMESTAMP,
        interests JSONB DEFAULT '[]' NOT NULL,
        profile_complete BOOLEAN DEFAULT FALSE NOT NULL,
        registration_step TEXT DEFAULT 'location' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
  });

  if (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

createTables()
  .then(() => console.log('Tables created successfully'))
  .catch(console.error);
