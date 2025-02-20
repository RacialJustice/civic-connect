import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPERBASE_SERVICE_ROLE;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const projectId = process.env.SUPABASE_PROJECT_ID;

if (!supabaseUrl || !serviceRoleKey || !projectId || !accessToken) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function executeSql(sql: string) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectId}/sql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: sql,
      production: true // Set to true to run on production database
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`SQL execution failed: ${JSON.stringify(error)}`);
  }

  return response;
}

async function migrate() {
  console.log('Testing connection...');
  
  try {
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .sort()
      .filter(f => f.endsWith('.sql'));

    console.log('Running migrations...');
    
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(
        path.join(MIGRATIONS_DIR, file),
        'utf8'
      );
      
      try {
        await executeSql(sql);
        console.log(`✓ Completed migration: ${file}`);
      } catch (error) {
        console.error(`Failed migration ${file}:`, error);
        return;
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
