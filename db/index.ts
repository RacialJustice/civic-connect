import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

// Use a default connection string for development
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://default:randompassword@ep-cool-water-123456.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });