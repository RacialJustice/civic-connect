import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZXFjd3pieHZob3hld2lmdXNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTgwMDMwMiwiZXhwIjoyMDU1Mzc2MzAyfQ.O0vXm4HidqcTdan8YfmTaeZt_LKXfrJn-KaeyX0XaTI',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('counties').select('count');
    if (error) throw error;
    console.log('Database connected, county count:', data[0].count);
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

export async function executeMigration(sql: string) {
  const { error } = await supabase.from('_sql').select().eq('query', sql).maybeSingle();
  if (error) throw error;
}

export { supabase };
