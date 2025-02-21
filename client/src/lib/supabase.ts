import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY');
}

if (!supabaseServiceRole) {
  throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error(`Invalid SUPABASE_URL: ${supabaseUrl}`);
}

// Create regular client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Create admin client only if service role is available
export const supabaseAdmin = supabaseServiceRole 
  ? createClient(supabaseUrl, supabaseServiceRole)
  : null;

// Helper function for admin operations
export const withAdmin = async <T>(operation: (client: typeof supabase) => Promise<T>): Promise<T> => {
  if (!supabaseAdmin) {
    throw new Error('Admin client not available');
  }
  return operation(supabaseAdmin);
};