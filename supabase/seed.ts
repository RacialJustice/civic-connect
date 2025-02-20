import { supabase } from './lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  // ...existing code...

  // Load and execute MP data
  const mpSeedSQL = fs.readFileSync(
    path.join(__dirname, 'seed', 'mps_data.sql'),
    'utf8'
  );
  
  const { error: mpError } = await supabase.query(mpSeedSQL);
  if (mpError) {
    console.error('Error seeding MPs:', mpError);
    return;
  }

  console.log('✅ MPs data seeded successfully');
}

seed();
