import { createClient } from '@supabase/supabase-js';
import { type Database } from '@shared/schema';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables:');
  console.error('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Present' : 'Missing');
  console.error('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  throw new Error('Missing required Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
