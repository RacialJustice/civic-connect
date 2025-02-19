export const getEnv = () => {
  if (typeof window !== 'undefined' && window.ENV) {
    return window.ENV;
  }
  
  // For server-side
  if (typeof process !== 'undefined' && process.env) {
    return {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    };
  }

  // Fallback for development
  return {
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: ''
  };
};