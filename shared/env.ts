export const getEnv = () => {
  console.log('Environment check:', {
    window: typeof window !== 'undefined',
    processEnv: process.env,
    windowEnv: typeof window !== 'undefined' ? window.ENV : null
  });
  
  if (typeof window !== 'undefined' && window.ENV) {
    return window.ENV;
  }
  return {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  };
};