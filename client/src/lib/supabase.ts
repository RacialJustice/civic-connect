import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@shared/env';

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration:', { url: !!supabaseUrl, key: !!supabaseKey });
  throw new Error('Missing required Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey);