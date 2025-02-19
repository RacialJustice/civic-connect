import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration:', { url: !!supabaseUrl, key: !!supabaseKey })
  throw new Error('Missing required Supabase configuration')
}

export const supabase = createClient(supabaseUrl, supabaseKey)