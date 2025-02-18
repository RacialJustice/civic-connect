
import postgres from 'postgres';
import { config } from './config';

async function setupTables() {
  console.log('Setting up database tables...');
  
  try {
    const sql = postgres(config.databaseUrl);
    
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS public.officials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        level TEXT NOT NULL,
        position TEXT NOT NULL,
        house_type TEXT,
        representation_type TEXT,
        party TEXT,
        photo TEXT,
        email TEXT,
        phone TEXT,
        village TEXT,
        ward TEXT,
        constituency TEXT,
        county TEXT,
        country TEXT DEFAULT 'Kenya' NOT NULL,
        term_start TIMESTAMP,
        term_end TIMESTAMP,
        responsibilities TEXT,
        social_media JSONB DEFAULT '{}',
        status TEXT DEFAULT 'active' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.forums (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        level TEXT NOT NULL,
        village TEXT,
        ward TEXT,
        constituency TEXT,
        county TEXT,
        moderation_enabled BOOLEAN DEFAULT TRUE NOT NULL,
        membership_type TEXT DEFAULT 'public' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await sql.end();
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Failed to setup tables:', error);
    process.exit(1);
  }
}

setupTables();
