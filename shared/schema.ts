
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, type RelationConfig } from "drizzle-orm";

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
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  interests: jsonb("interests").default('[]').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const officials = pgTable("officials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  level: text("level").notNull(),
  party: text("party"),
  photo: text("photo"),
  email: text("email"),
  phone: text("phone"),
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county"),
  country: text("country").default("Kenya").notNull(),
  termStart: timestamp("term_start"),
  termEnd: timestamp("term_end"),
  responsibilities: text("responsibilities"),
  socialMedia: text("social_media"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  parentId: integer("parent_id").references(() => communities.id),
  description: text("description"),
  population: integer("population"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  communityId: integer("community_id").references(() => communities.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forums = pgTable("forums", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  forumId: integer("forum_id").notNull().references(() => forums.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  pinned: boolean("pinned").default(false),
  locked: boolean("locked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").notNull().references(() => posts.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  parentId: integer("parent_id").references(() => comments.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parliamentarySessions = pgTable("parliamentary_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  venue: text("venue").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => parliamentarySessions.id),
  officialId: integer("official_id").notNull().references(() => officials.id),
  status: text("status").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  sponsorId: integer("sponsor_id").notNull().references(() => officials.id),
  dateIntroduced: timestamp("date_introduced").notNull(),
  dateLastModified: timestamp("date_last_modified").defaultNow(),
  documentUrl: text("document_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votingRecords = pgTable("voting_records", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").notNull().references(() => bills.id),
  officialId: integer("official_id").notNull().references(() => officials.id),
  vote: text("vote").notNull(),
  votingDate: timestamp("voting_date").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const developmentProjects = pgTable("development_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  budget: text("budget").notNull(),
  status: text("status").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  officialId: integer("official_id").notNull().references(() => officials.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const communitiesRelations = relations(communities, ({ one }) => ({
  parent: one(communities, {
    fields: [communities.parentId],
    references: [communities.id],
  }),
}));

export const forumsRelations = relations(forums, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  forum: one(forums, {
    fields: [posts.forumId],
    references: [forums.id],
  }),
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  votes: many(votes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  post: one(posts, {
    fields: [votes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

export const parliamentarySessionsRelations = relations(parliamentarySessions, ({ many }) => ({
  attendanceRecords: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  session: one(parliamentarySessions, {
    fields: [attendance.sessionId],
    references: [parliamentarySessions.id],
  }),
  official: one(officials, {
    fields: [attendance.officialId],
    references: [officials.id],
  }),
}));

export const billsRelations = relations(bills, ({ one, many }) => ({
  sponsor: one(officials, {
    fields: [bills.sponsorId],
    references: [officials.id],
  }),
  votingRecords: many(votingRecords),
}));

export const votingRecordsRelations = relations(votingRecords, ({ one }) => ({
  bill: one(bills, {
    fields: [votingRecords.billId],
    references: [bills.id],
  }),
  official: one(officials, {
    fields: [votingRecords.officialId],
    references: [officials.id],
  }),
}));

export const developmentProjectsRelations = relations(developmentProjects, ({ one }) => ({
  official: one(officials, {
    fields: [developmentProjects.officialId],
    references: [officials.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertOfficialSchema = createInsertSchema(officials);
export const selectOfficialSchema = createSelectSchema(officials);
export const insertCommunitySchema = createInsertSchema(communities);
export const selectCommunitySchema = createSelectSchema(communities);
export const insertResourceSchema = createInsertSchema(resources);
export const selectResourceSchema = createSelectSchema(resources);
export const insertForumSchema = createInsertSchema(forums);
export const selectForumSchema = createSelectSchema(forums);
export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);
export const insertCommentSchema = createInsertSchema(comments);
export const selectCommentSchema = createSelectSchema(comments);
export const insertVoteSchema = createInsertSchema(votes);
export const selectVoteSchema = createSelectSchema(votes);
export const insertParliamentarySessionSchema = createInsertSchema(parliamentarySessions);
export const selectParliamentarySessionSchema = createSelectSchema(parliamentarySessions);
export const insertAttendanceSchema = createInsertSchema(attendance);
export const selectAttendanceSchema = createSelectSchema(attendance);
export const insertBillSchema = createInsertSchema(bills);
export const selectBillSchema = createSelectSchema(bills);
export const insertVotingRecordSchema = createInsertSchema(votingRecords);
export const selectVotingRecordSchema = createSelectSchema(votingRecords);
export const insertDevelopmentProjectSchema = createInsertSchema(developmentProjects);
export const selectDevelopmentProjectSchema = createSelectSchema(developmentProjects);

// Types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertOfficial = typeof officials.$inferInsert;
export type SelectOfficial = typeof officials.$inferSelect;
export type InsertCommunity = typeof communities.$inferInsert;
export type SelectCommunity = typeof communities.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;
export type SelectResource = typeof resources.$inferSelect;
export type InsertForum = typeof forums.$inferInsert;
export type SelectForum = typeof forums.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
export type SelectComment = typeof comments.$inferSelect;
export type InsertVote = typeof votes.$inferInsert;
export type SelectVote = typeof votes.$inferSelect;
export type InsertParliamentarySession = typeof parliamentarySessions.$inferInsert;
export type SelectParliamentarySession = typeof parliamentarySessions.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;
export type SelectAttendance = typeof attendance.$inferSelect;
export type InsertBill = typeof bills.$inferInsert;
export type SelectBill = typeof bills.$inferSelect;
export type InsertVotingRecord = typeof votingRecords.$inferInsert;
export type SelectVotingRecord = typeof votingRecords.$inferSelect;
export type InsertDevelopmentProject = typeof developmentProjects.$inferInsert;
export type SelectDevelopmentProject = typeof developmentProjects.$inferSelect;
