import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
<<<<<<< HEAD
  schema: "./shared/schema.ts",
=======
  schema: "./db/schema.ts",
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
