export const getEnv = () => {
  if (typeof window !== 'undefined') {
    return window.ENV || {};
  }
  return {
    VITE_SUPABASE_URL: process.env.SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
  };
};

function getEnvConfig() {
  const env = getEnv();
  return {
    supabaseUrl: env.VITE_SUPABASE_URL,
    supabaseKey: env.VITE_SUPABASE_ANON_KEY
  };
}

export const env = getEnvConfig();
