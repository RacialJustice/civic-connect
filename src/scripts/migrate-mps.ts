import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMPsTable() {
  const { error } = await supabase.rpc('create_mps_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS mps (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        constituency TEXT NOT NULL,
        party TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
      );
    `
  });

  if (error) {
    console.error('Error creating table:', error);
    return;
  }

  console.log('Table created successfully');
}

async function insertMPs() {
  const mps = [
    { name: "Adagala, Beatrice Kahai", constituency: "Vihiga (CWR)", party: "ANC" },
    { name: "Denar, Joseph Hamisi", constituency: "Nominated", party: "ANC" },
    // First batch
  ];

  const { error } = await supabase
    .from('mps')
    .upsert(mps);

  if (error) {
    console.error('Error inserting MPs:', error);
    return;
  }

  console.log('MPs inserted successfully');
}

async function migrate() {
  await createMPsTable();
  await insertMPs();
}

migrate().catch(console.error);