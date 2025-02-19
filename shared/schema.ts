import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Users table
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

// Polls table
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county"),
  status: text("status").default("active").notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pollVotes = pgTable("poll_votes", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull().references(() => polls.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const pollsRelations = relations(polls, ({ one, many }) => ({
  author: one(users, {
    fields: [polls.authorId],
    references: [users.id],
  }),
  votes: many(pollVotes),
}));

export const pollVotesRelations = relations(pollVotes, ({ one }) => ({
  poll: one(polls, {
    fields: [pollVotes.pollId],
    references: [polls.id],
  }),
  user: one(users, {
    fields: [pollVotes.userId],
    references: [users.id],
  }),
}));

// Create schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPollSchema = createInsertSchema(polls);
export const selectPollSchema = createSelectSchema(polls);
export const insertPollVoteSchema = createInsertSchema(pollVotes);
export const selectPollVoteSchema = createSelectSchema(pollVotes);

// Types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertPoll = typeof polls.$inferInsert;
export type SelectPoll = typeof polls.$inferSelect;
export type InsertPollVote = typeof pollVotes.$inferInsert;
export type SelectPollVote = typeof pollVotes.$inferSelect;

// Database type
export type Database = {
  public: {
    Tables: {
      users: {
        Row: SelectUser;
        Insert: InsertUser;
      };
      polls: {
        Row: SelectPoll;
        Insert: InsertPoll;
      };
      poll_votes: {
        Row: SelectPollVote;
        Insert: InsertPollVote;
      };
    };
  };
};