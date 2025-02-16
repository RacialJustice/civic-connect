import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

// Default to a local SQLite database if no DATABASE_URL is provided
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/civicconnect';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });