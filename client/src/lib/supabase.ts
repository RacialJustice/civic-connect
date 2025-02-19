import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@shared/env';

const env = getEnv();

// Provide default values for development
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://toeqcwzbxvhoxewifusk.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZXFjd3pieHZob3hld2lmdXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MDAzMDIsImV4cCI6MjA1NTM3NjMwMn0.M0H6FSo553Ql-7F6UApL9Dk39Y5dU4YvVuqcBYVwhhk';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration:', { url: !!supabaseUrl, key: !!supabaseKey });
  throw new Error('Missing required Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey);