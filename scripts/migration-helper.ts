import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

interface MigrationTransformation {
  pattern: RegExp;
  replacement: string;
}

const TRANSFORMATIONS: MigrationTransformation[] = [
  {
    pattern: /INSERT INTO wards \(name, constituency, county\)/g,
    replacement: `WITH ward_data AS (
  SELECT 
    w.name, 
    w.name AS code, 
    c.id AS constituency_id
  FROM (VALUES`
  },
  {
    pattern: /ON CONFLICT \(name, constituency, county\)/g,
    replacement: `) AS w(name, constituency, county)
  JOIN constituencies c ON c.name = w.constituency
  JOIN counties co ON co.name = w.county AND c.county_id = co.id
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id FROM ward_data
ON CONFLICT (name, constituency_id)`
  },
  {
    pattern: /DO UPDATE SET name = EXCLUDED\.name;/g,
    replacement: 'DO UPDATE SET code = EXCLUDED.code;'
  }
];

function needsTransformation(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('INSERT INTO wards (name, constituency, county)');
}

function transformMigrationFile(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  
  TRANSFORMATIONS.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });
  
  // Create backup
  const backupPath = `${filePath}.bak`;
  fs.writeFileSync(backupPath, fs.readFileSync(filePath));
  
  // Write transformed content
  fs.writeFileSync(filePath, content);
  console.log(`Transformed: ${filePath} (backup created)`);
}

function processMigrations(dirPath: string): void {
  try {
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.sql'))
      .map(file => path.join(dirPath, file));
    
    console.log(`Found ${files.length} migration files`);
    
    for (const file of files) {
      if (needsTransformation(file)) {
        console.log(`Processing: ${file}`);
        transformMigrationFile(file);
      }
    }
  } catch (error) {
    console.error('Error processing migrations:', error);
    process.exit(1);
  }
}

// Add verification function
async function verifySchema(): Promise<void> {
  const verifyPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240000000011_verify_schema.sql');
  
  exec(`psql -f ${verifyPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Schema verification failed:', error);
      return;
    }
    console.log('Schema verification results:', stdout);
  });
}

// Execute if run directly
if (require.main === module) {
  const migrationsPath = path.join(__dirname, '..', 'supabase', 'migrations');
  processMigrations(migrationsPath);
  verifySchema();
}

export { processMigrations, verifySchema };
