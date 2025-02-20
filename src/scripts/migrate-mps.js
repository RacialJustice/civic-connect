// src/scripts/migrate-mps.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// First batch of MPs
const mps = [
  { name: "Adagala, Beatrice Kahai", constituency: "Vihiga (CWR)", party: "ANC" },
  { name: "Denar, Joseph Hamisi", constituency: "Nominated", party: "ANC" },
  { name: "Gimose, Charles Gumini", constituency: "Hamisi", party: "ANC" },
  { name: "IkanaM, Frederick Lusuli", constituency: "Shinyalu", party: "ANC" },
  { name: "Injendi, Moses Malulu", constituency: "Malava", party: "ANC" }
];

async function migrate() {
  console.log('Starting data insertion...');
  
  try {
    const { error: insertError } = await supabase
      .from('mps')
      .upsert(mps);

    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`);
    }

    // Verify insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('mps')
      .select('*');

    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }

    console.log(`Successfully inserted ${verifyData.length} MPs`);
    console.log('First record:', verifyData[0]);

  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

migrate();