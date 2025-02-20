import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPERBASE_SERVICE_ROLE; // Use service role key for admin operations

interface MP {
  name: string;
  constituency: string;
  party: string;
}

const allMPs: MP[] = [
  { name: "Adagala Beatrice Kahai", constituency: "Vihiga (CWR)", party: "ANC" },
  { name: "Denar Joseph Hamisi", constituency: "Nominated", party: "ANC" },
  { name: "Gimose Charles Gumini", constituency: "Hamisi", party: "ANC" },
  { name: "IkanaM Frederick Lusuli", constituency: "Shinyalu", party: "ANC" },
  { name: "Injendi Moses Malulu", constituency: "Malava", party: "ANC" },
  { name: "Kagesi Kivai Ernest Ogesi", constituency: "Vihiga", party: "ANC" },
  { name: "Omboko Milemba Jeremiah", constituency: "Emuhaya", party: "ANC" },
  { name: "Tandaza Kassim Sawa", constituency: "Matuga", party: "ANC" },
  { name: "Koech Victor Kipngetich", constituency: "Chepalungu", party: "CCM" },
  { name: "Barasa Patrick Simiyu", constituency: "Cherangany", party: "DAP-K" },
  // ... Add all other MPs here
];

async function migrateMPs() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const BATCH_SIZE = 50;
  console.log('Starting data insertion...');
  
  try {
    // Process MPs in batches
    for (let i = 0; i < allMPs.length; i += BATCH_SIZE) {
      const batch = allMPs.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabase
        .from('mps')
        .upsert(batch, { onConflict: 'name' });

      if (insertError) {
        throw new Error(`Insert failed for batch ${i / BATCH_SIZE + 1}: ${insertError.message}`);
      }

      console.log(`✓ Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} records)`);
    }

    // Verify final count
    const { count, error: countError } = await supabase
      .from('mps')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Verification failed: ${countError.message}`);
    }

    console.log(`Successfully inserted total of ${count} MPs`);

  } catch (error) {
    console.error('Migration failed:', error instanceof Error ? error.message : error);
  }
}

migrateMPs();