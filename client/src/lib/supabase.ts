import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error(`Invalid SUPABASE_URL: ${supabaseUrl}`);
}

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

function createSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'civic-connect-auth',
      storageType: 'localStorage',
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return supabaseInstance;
}

// Export a single instance
export const supabase = createSupabaseClient();

// Use the same instance for admin operations
export const supabaseAdmin = supabase;

// Helper for admin operations
export const withAdmin = async <T>(operation: (client: typeof supabase) => Promise<T>): Promise<T> => {
  return operation(supabase);
};