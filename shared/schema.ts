import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  isLeader: boolean("is_leader").default(false).notNull(),
  constituency: text("constituency"),
  position: text("position"),
  bio: text("bio"),
});

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  leaderId: integer("leader_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  isLeader: true,
  constituency: true,
  position: true,
  bio: true,
});

export const insertFeedbackSchema = createInsertSchema(feedbacks).pick({
  leaderId: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacks.$inferSelect;
