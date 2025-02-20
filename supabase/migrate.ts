import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function migrate() {
  try {
    const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'))
      .sort()
      .filter(f => f.endsWith('.sql'))

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`)
      const sql = fs.readFileSync(
        path.join(__dirname, 'migrations', file),
        'utf8'
      )
      
      const { data, error } = await supabase.from('_migrations')
        .select('name')
        .eq('name', file)
        .single()

      if (!data) {
        const { error: migrationError } = await supabase.rpc('run_migrations', {
          migration_queries: [sql]
        })
        
        if (migrationError) throw migrationError

        await supabase.from('_migrations')
          .insert({ name: file })

        console.log(`✓ Completed migration: ${file}`)
      } else {
        console.log(`→ Skipping migration: ${file} (already executed)`)
      }
    }
    
    console.log('All migrations completed successfully')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  }
}

migrate()