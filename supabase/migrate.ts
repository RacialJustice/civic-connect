import { testConnection, supabase } from './db';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '../server/db/migrations');

async function runMigrations() {
  console.log('Testing connection...');
  await testConnection();

  console.log('Reading migrations...');
  const files = await fs.readdir(MIGRATIONS_DIR);
  const sqlFiles = files
    .filter(f => f.endsWith('.sql'))
    .sort(); // Ensure order

  for (const file of sqlFiles) {
    console.log(`Running migration: ${file}`);
    const sql = await fs.readFile(path.join(MIGRATIONS_DIR, file), 'utf-8');
    
    try {
      // Ensure the execute_sql function is created first
      if (file === '0000_create_execute_sql_function.sql') {
        const { error } = await supabase.rpc('execute_sql', { _sql: sql });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.rpc('execute_sql', { _sql: sql });
        if (error) throw error;
      }
      console.log(`Completed migration: ${file}`);
    } catch (error) {
      console.error(`Failed migration ${file}:`, error);
      throw error;
    }
  }
}

runMigrations().catch(console.error);
