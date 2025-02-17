import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations, type AnyColumn } from "drizzle-orm";

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
  level: text("level"), // For leaders: national, county, constituency, ward
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  interests: jsonb("interests").default('[]').notNull(),
  profileComplete: boolean("profile_complete").default(false).notNull(),
  registrationStep: text("registration_step").default("location").notNull(), // location, interests, verification
  createdAt: timestamp("created_at").defaultNow(),
});

// Create schemas
export const insertUserSchema = createInsertSchema(users);

// Types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const officials = pgTable("officials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // MP, Senator, Women Rep, MCA, Nominated
  level: text("level").notNull(), // national, county, constituency, ward
  position: text("position").notNull(), // executive, legislative
  house_type: text("house_type"), // upper_house (Senate), lower_house (National Assembly), county_assembly
  representation_type: text("representation_type"), // elected, nominated
  party: text("party"),
  photo: text("photo"),
  email: text("email"),
  phone: text("phone"),
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county"),
  country: text("country").default("Kenya").notNull(),
  term_start: timestamp("term_start"),
  term_end: timestamp("term_end"),
  responsibilities: text("responsibilities"),
  social_media: jsonb("social_media").default('{}'),
  status: text("status").default("active").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  parentId: integer("parent_id").references((): AnyColumn => communities.id),
  description: text("description"),
  population: integer("population"),
  createdAt: timestamp("created_at").defaultNow(),
}) as typeof communities;

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
  level: text("level").notNull(), // village, ward, constituency, county, national
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county"),
  moderationEnabled: boolean("moderation_enabled").default(true).notNull(),
  membershipType: text("membership_type").default("public").notNull(), // public, request, invite
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
  parentId: integer("parent_id").references((): AnyColumn => comments.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}) as typeof comments;

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

export const forumModerators = pgTable("forum_moderators", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  forumId: integer("forum_id").notNull().references(() => forums.id),
  level: text("level").notNull(), // village, ward, constituency, county
  permissions: jsonb("permissions").default('["moderate_posts", "delete_comments"]').notNull(),
  appointed_by: integer("appointed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumMembers = pgTable("forum_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  forumId: integer("forum_id").notNull().references(() => forums.id),
  role: text("role").default("member").notNull(), // member, contributor
  status: text("status").default("active").notNull(), // active, pending, banned
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // townhall, community_meeting, public_participation
  format: text("format").notNull(), // hybrid, physical, virtual
  status: text("status").default("upcoming").notNull(), // upcoming, ongoing, completed, cancelled
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  location: text("location"), // Physical location if applicable
  virtualLink: text("virtual_link"), // Meeting link if virtual/hybrid
  organizerId: integer("organizer_id").notNull().references(() => users.id),
  forumId: integer("forum_id").references(() => forums.id), // Optional forum association
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county"),
  maxAttendees: integer("max_attendees"),
  requiresRegistration: boolean("requires_registration").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventAttendance = pgTable("event_attendance", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull(), // registered, attended, absent
  attendanceTime: timestamp("attendance_time"), // When they actually attended
  registrationTime: timestamp("registration_time").defaultNow(),
  attendanceMode: text("attendance_mode"), // physical, virtual
  verifiedBy: integer("verified_by").references(() => users.id), // Moderator who verified attendance
  createdAt: timestamp("created_at").defaultNow(),
});

export const whatsappNotifications = pgTable("whatsapp_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  phoneNumber: text("phone_number").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationCode: text("verification_code"),
  verificationExpiry: timestamp("verification_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  forumId: integer("forum_id").references(() => forums.id),
  eventNotifications: boolean("event_notifications").default(true).notNull(),
  forumPostNotifications: boolean("forum_post_notifications").default(true).notNull(),
  urgentAlerts: boolean("urgent_alerts").default(true).notNull(),
  leaderUpdates: boolean("leader_updates").default(true).notNull(),
  whatsappEnabled: boolean("whatsapp_enabled").default(false).notNull(),
  emailEnabled: boolean("email_enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  leaderId: integer("leader_id").notNull().references(() => officials.id),
  content: text("content").notNull(),
  rating: integer("rating"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const emergencyServices = pgTable("emergency_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // police, hospital, ambulance, fire, security
  phoneNumbers: jsonb("phone_numbers").notNull(), // Array of contact numbers
  description: text("description"),
  address: text("address").notNull(),
  operatingHours: text("operating_hours"),
  village: text("village"),
  ward: text("ward"),
  constituency: text("constituency"),
  county: text("county").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedBy: integer("verified_by").references(() => users.id),
  status: text("status").default("active").notNull(), // active, inactive, temporary_closed
  additionalInfo: jsonb("additional_info").default('{}'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Add to exports
export const insertEmergencyServiceSchema = createInsertSchema(emergencyServices);
export type InsertEmergencyService = typeof emergencyServices.$inferInsert;
export type SelectEmergencyService = typeof emergencyServices.$inferSelect;

// Add relations
export const emergencyServiceRelations = relations(emergencyServices, ({ one }) => ({
  verifier: one(users, {
    fields: [emergencyServices.verifiedBy],
    references: [users.id],
  }),
}));


// Relations
export const communitiesRelations = relations(communities, ({ one }) => ({
  parent: one(communities, {
    fields: [communities.parentId],
    references: [communities.id],
  }),
}));

export const forumsRelations = relations(forums, ({ many }) => ({
  posts: many(posts),
  moderators: many(forumModerators),
  members: many(forumMembers),
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

export const forumModeratorRelations = relations(forumModerators, ({ one }) => ({
  user: one(users, {
    fields: [forumModerators.userId],
    references: [users.id],
  }),
  forum: one(forums, {
    fields: [forumModerators.forumId],
    references: [forums.id],
  }),
  appointedBy: one(users, {
    fields: [forumModerators.appointed_by],
    references: [users.id],
  }),
}));

export const forumMemberRelations = relations(forumMembers, ({ one }) => ({
  user: one(users, {
    fields: [forumMembers.userId],
    references: [users.id],
  }),
  forum: one(forums, {
    fields: [forumMembers.forumId],
    references: [forums.id],
  }),
}));

// Schemas
export const insertOfficialSchema = createInsertSchema(officials);
export const insertCommunitySchema = createInsertSchema(communities);
export const insertResourceSchema = createInsertSchema(resources);
export const insertForumSchema = createInsertSchema(forums);
export const insertPostSchema = createInsertSchema(posts);
export const insertCommentSchema = createInsertSchema(comments);
export const insertVoteSchema = createInsertSchema(votes);
export const insertParliamentarySessionSchema = createInsertSchema(parliamentarySessions);
export const insertAttendanceSchema = createInsertSchema(attendance);
export const insertBillSchema = createInsertSchema(bills);
export const insertVotingRecordSchema = createInsertSchema(votingRecords);
export const insertDevelopmentProjectSchema = createInsertSchema(developmentProjects);
export const insertForumModeratorSchema = createInsertSchema(forumModerators);
export const insertForumMemberSchema = createInsertSchema(forumMembers);
export const insertFeedbackSchema = createInsertSchema(feedbacks);

// Types
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
export type InsertForumModerator = typeof forumModerators.$inferInsert;
export type SelectForumModerator = typeof forumModerators.$inferSelect;
export type InsertForumMember = typeof forumMembers.$inferInsert;
export type SelectForumMember = typeof forumMembers.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;
export type SelectFeedback = typeof feedbacks.$inferSelect;

export const officialsRelations = relations(officials, ({ many }) => ({
  constituents: many(users),
  feedbacks: many(feedbacks),
  developmentProjects: many(developmentProjects),
  votingRecords: many(votingRecords),
  attendanceRecords: many(attendance),
}));

export const usersRelations = relations(users, ({ many }) => ({
  feedbacks: many(feedbacks),
  posts: many(posts),
  votes: many(votes),
  comments: many(comments),
  organizedEvents: many(events, { relationName: "organizer" }),
  eventAttendance: many(eventAttendance),
  whatsappNotifications: many(whatsappNotifications),
  notificationPreferences: many(notificationPreferences),
}));

export const insertEventSchema = createInsertSchema(events);
export const insertEventAttendanceSchema = createInsertSchema(eventAttendance);
export const insertWhatsappNotificationSchema = createInsertSchema(whatsappNotifications);
export const insertNotificationPreferenceSchema = createInsertSchema(notificationPreferences);

// Add new types
export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;
export type InsertEventAttendance = typeof eventAttendance.$inferInsert;
export type SelectEventAttendance = typeof eventAttendance.$inferSelect;
export type InsertWhatsappNotification = typeof whatsappNotifications.$inferInsert;
export type SelectWhatsappNotification = typeof whatsappNotifications.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;
export type SelectNotificationPreference = typeof notificationPreferences.$inferSelect;

// Add relations for the new tables
export const eventRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  forum: one(forums, {
    fields: [events.forumId],
    references: [forums.id],
  }),
  attendees: many(eventAttendance),
}));

export const eventAttendanceRelations = relations(eventAttendance, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendance.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendance.userId],
    references: [users.id],
  }),
  verifier: one(users, {
    fields: [eventAttendance.verifiedBy],
    references: [users.id],
  }),
}));

export const whatsappNotificationRelations = relations(whatsappNotifications, ({ one }) => ({
  user: one(users, {
    fields: [whatsappNotifications.userId],
    references: [users.id],
  }),
}));

export const notificationPreferenceRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
  forum: one(forums, {
    fields: [notificationPreferences.forumId],
    references: [forums.id],
  }),
}));

// Add Database type for Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: SelectUser;
        Insert: InsertUser;
      };
      officials: {
        Row: SelectOfficial;
        Insert: InsertOfficial;
      };
      communities: {
        Row: SelectCommunity;
        Insert: InsertCommunity;
      };
      forums: {
        Row: SelectForum;
        Insert: InsertForum;
      };
      posts: {
        Row: SelectPost;
        Insert: InsertPost;
      };
      comments: {
        Row: SelectComment;
        Insert: InsertComment;
      };
      parliamentary_sessions: {
        Row: SelectParliamentarySession;
        Insert: InsertParliamentarySession;
      };
      development_projects: {
        Row: SelectDevelopmentProject;
        Insert: InsertDevelopmentProject;
      };
      forum_moderators: {
        Row: SelectForumModerator;
        Insert: InsertForumModerator;
      };
      forum_members: {
        Row: SelectForumMember;
        Insert: InsertForumMember;
      };
      emergency_services: {
        Row: SelectEmergencyService;
        Insert: InsertEmergencyService;
      };
      feedbacks: {
        Row: SelectFeedback;
        Insert: InsertFeedback;
      };
    };
  };
};