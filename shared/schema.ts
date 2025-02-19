import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations, type AnyColumn } from "drizzle-orm";

// Add counties table definition at the top
export const counties = pgTable("counties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rest of the file remains the same...
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name"),
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county"),
  country: text("country").default("Kenya").notNull(),
  role: text("role").default("citizen").notNull(),
  level: text("level"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  interests: jsonb("interests").default('[]').notNull(),
  profileComplete: boolean("profile_complete").default(false).notNull(),
  registrationStep: text("registration_step").default("location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCountySchema = createInsertSchema(counties);

// Types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertCounty = typeof counties.$inferInsert;
export type SelectCounty = typeof counties.$inferSelect;

// Rest of your schema definitions...
// (Keep all the existing table definitions, relations, and exports)

// Add county relations
export const countyRelations = relations(counties, ({ many }) => ({
  constituencies: many(constituencies)
}));

// Update the Database type to include counties
export type Database = {
  public: {
    Tables: {
      counties: {
        Row: SelectCounty;
        Insert: InsertCounty;
      };
      users: {
        Row: SelectUser;
        Insert: InsertUser;
      };
      // ... rest of your table definitions
    };
  };
};