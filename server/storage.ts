import { type InsertUser, type SelectUser, type SelectFeedback, type InsertFeedback, type SelectOfficial, type SelectCommunity, type SelectForum, type SelectParliamentarySession, type SelectDevelopmentProject, type SelectPost, type InsertPost, type InsertForumModerator, type SelectForumModerator, type InsertForumMember, type SelectForumMember, type InsertEmergencyService, type SelectEmergencyService, users, feedbacks, officials, communities, forums, parliamentarySessions, developmentProjects, posts, forumModerators, forumMembers, emergencyServices } from "@shared/schema";
import { db } from "./db";
import { eq, inArray, and, or, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<SelectUser | undefined>;
  getUserByEmail(email: string): Promise<SelectUser | undefined>;
  createUser(user: InsertUser): Promise<SelectUser>;
  getLeaders(params: { ward?: string; constituency?: string; county?: string }): Promise<SelectUser[]>;
  getFeedbackForLeader(leaderId: number): Promise<SelectFeedback[]>;
  createFeedback(userId: number, feedback: InsertFeedback): Promise<SelectFeedback>;
  searchOfficials(term: string, location: string): Promise<SelectOfficial[]>;
  searchCommunities(term: string, location: string): Promise<SelectCommunity[]>;
  searchForums(term: string, category: string): Promise<SelectForum[]>;
  searchParliamentarySessions(term: string, type: string): Promise<SelectParliamentarySession[]>;
  searchDevelopmentProjects(term: string, location: string, status: string): Promise<SelectDevelopmentProject[]>;
  updateUserLocation(userId: number, update: { ward: string; constituency: string; county: string; village?: string }): Promise<SelectUser>;
  updateUserProfile(userId: number, update: { name?: string; email?: string; village?: string | null; ward?: string | null; constituency?: string | null; county?: string | null }): Promise<SelectUser>;
  getUserActivity(userId: number): Promise<any[]>;
  getForum(forumId: number): Promise<SelectForum | undefined>;
  getForumPosts(forumId: number): Promise<SelectPost[]>;
  createPost(post: InsertPost): Promise<SelectPost>;
  upsertVote(vote: { postId: number; userId: number; type: string }): Promise<void>;
  updateRegistrationStep(userId: number, step: string): Promise<SelectUser>;
  completeUserProfile(userId: number): Promise<SelectUser>;
  getLocalOfficials(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectOfficial[]>;
  getWomenRepresentative(county: string): Promise<SelectOfficial | undefined>;
  getSenator(county: string): Promise<SelectOfficial | undefined>;
  getMemberOfParliament(constituency: string): Promise<SelectOfficial | undefined>;
  getForumsByLocation(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectForum[]>;
  addForumModerator(moderator: InsertForumModerator): Promise<SelectForumModerator>;
  getForumModerators(forumId: number): Promise<SelectForumModerator[]>;
  joinForum(member: InsertForumMember): Promise<SelectForumMember>;
  getForumMembers(forumId: number): Promise<SelectForumMember[]>;
  isUserForumModerator(userId: number, forumId: number): Promise<boolean>;
  getEmergencyServices(filters: { type?: string; village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectEmergencyService[]>;
  getEmergencyServiceById(id: number): Promise<SelectEmergencyService | undefined>;
  createEmergencyService(service: InsertEmergencyService): Promise<SelectEmergencyService>;
  updateEmergencyServiceStatus(id: number, status: string, updatedBy: number): Promise<SelectEmergencyService>;
  verifyEmergencyService(id: number, verifiedBy: number): Promise<SelectEmergencyService>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<SelectUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<SelectUser> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async getLeaders({ ward, constituency, county }: { ward?: string; constituency?: string; county?: string }): Promise<SelectUser[]> {
    const query = db.select().from(users);

    const conditions = [];
    conditions.push(sql`${users.role} = 'leader'`);

    if (ward) conditions.push(sql`${users.ward} = ${ward}`);
    if (constituency) conditions.push(sql`${users.constituency} = ${constituency}`);
    if (county) conditions.push(sql`${users.county} = ${county}`);

    return query.where(and(...conditions));
  }

  async getFeedbackForLeader(leaderId: number): Promise<SelectFeedback[]> {
    return db.select().from(feedbacks).where(eq(feedbacks.leaderId, leaderId));
  }

  async createFeedback(userId: number, feedback: InsertFeedback): Promise<SelectFeedback> {
    const [createdFeedback] = await db.insert(feedbacks).values({...feedback, userId}).returning();
    return createdFeedback;
  }

  async searchOfficials(term: string, location: string): Promise<SelectOfficial[]> {
    const normalizedTerm = `%${term.toLowerCase()}%`;
    const normalizedLocation = `%${location.toLowerCase()}%`;

    return db.select()
      .from(officials)
      .where(
        and(
          or(
            sql`LOWER(${officials.name}) LIKE ${normalizedTerm}`,
            sql`LOWER(${officials.role}) LIKE ${normalizedTerm}`,
            sql`LOWER(${officials.party}) LIKE ${normalizedTerm}`
          ),
          or(
            sql`LOWER(${officials.ward}) LIKE ${normalizedLocation}`,
            sql`LOWER(${officials.constituency}) LIKE ${normalizedLocation}`,
            sql`LOWER(${officials.county}) LIKE ${normalizedLocation}`
          )
        )
      );
  }

  async searchCommunities(term: string, location: string): Promise<SelectCommunity[]> {
    const normalizedTerm = term.toLowerCase();
    return db.select().from(communities).where(
        or(
            communities.name.like(`%${normalizedTerm}%`),
            communities.description.like(`%${normalizedTerm}%`)
        )
    );
  }

  async searchForums(term: string, category: string): Promise<SelectForum[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedCategory = category.toLowerCase();
    return db.select().from(forums).where(
      and(
          or(
              forums.name.like(`%${normalizedTerm}%`),
              forums.description.like(`%${normalizedTerm}%`)
          ),
          eq(forums.category, category)
      )
    );
  }

  async searchParliamentarySessions(term: string, type: string): Promise<SelectParliamentarySession[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedType = type.toLowerCase();
    return db.select().from(parliamentarySessions).where(
      and(
        or(
          parliamentarySessions.title.like(`%${normalizedTerm}%`),
          parliamentarySessions.description.like(`%${normalizedTerm}%`)
        ),
        eq(parliamentarySessions.type, type)
      )
    );
  }

  async searchDevelopmentProjects(term: string, location: string, status: string): Promise<SelectDevelopmentProject[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedLocation = location.toLowerCase();
    const normalizedStatus = status.toLowerCase();
    return db.select().from(developmentProjects).where(
      and(
        or(
          developmentProjects.title.like(`%${normalizedTerm}%`),
          developmentProjects.description.like(`%${normalizedTerm}%`)
        ),
        developmentProjects.location.like(`%${normalizedLocation}%`),
        eq(developmentProjects.status, status)
      )
    );
  }

  async updateUserLocation(userId: number, update: { ward: string; constituency: string; county: string; village?: string }): Promise<SelectUser> {
    const [updatedUser] = await db.update(users).set(update).where(eq(users.id, userId)).returning();
    return updatedUser;
  }

  async updateUserProfile(userId: number, update: { name?: string; email?: string; village?: string | null; ward?: string | null; constituency?: string | null; county?: string | null }): Promise<SelectUser> {
    const [updatedUser] = await db.update(users).set(update).where(eq(users.id, userId)).returning();
    return updatedUser;
  }

  async getUserActivity(userId: number): Promise<any[]> {
    return [];
  }

  async getForum(forumId: number): Promise<SelectForum | undefined> {
    const [forum] = await db.select().from(forums).where(eq(forums.id, forumId));
    return forum;
  }

  async getForumPosts(forumId: number): Promise<SelectPost[]> {
    return db.select().from(posts).where(eq(posts.forumId, forumId));
  }

  async createPost(post: InsertPost): Promise<SelectPost> {
    const [createdPost] = await db.insert(posts).values(post).returning();
    return createdPost;
  }

  async upsertVote(vote: { postId: number; userId: number; type: string }): Promise<void> {
    //This needs a more robust implementation for a real database
  }

  async updateRegistrationStep(userId: number, step: string): Promise<SelectUser> {
    const [updatedUser] = await db.update(users).set({registrationStep: step}).where(eq(users.id, userId)).returning();
    return updatedUser;
  }

  async completeUserProfile(userId: number): Promise<SelectUser> {
    const [updatedUser] = await db.update(users).set({profileComplete: true, registrationStep: "completed"}).where(eq(users.id, userId)).returning();
    return updatedUser;
  }

  async getLocalOfficials(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectOfficial[]> {
    const query = db.select().from(officials);
    const conditions = [];

    // Add conditions based on location hierarchy
    if (location.ward) {
      conditions.push(eq(officials.ward, location.ward));
    }
    if (location.constituency) {
      conditions.push(
        or(
          eq(officials.constituency, location.constituency),
          eq(officials.county, location.county) // Include county officials when viewing constituency
        )
      );
    } else if (location.county) {
      conditions.push(eq(officials.county, location.county));
    }

    // Only return active officials
    conditions.push(eq(officials.status, 'active'));

    return conditions.length > 0 
      ? query.where(and(...conditions))
      : query.where(eq(officials.status, 'active')); // Return all active officials if no location filters
  }

  async getWomenRepresentative(county: string): Promise<SelectOfficial | undefined> {
      const [womenRep] = await db.select().from(officials).where(and(eq(officials.county, county), eq(officials.role, "Women Representative"), eq(officials.status, "active")));
      return womenRep;
  }

  async getSenator(county: string): Promise<SelectOfficial | undefined> {
    const [senator] = await db.select().from(officials).where(and(eq(officials.county, county), eq(officials.role, "Senator"), eq(officials.houseType, "upper_house"), eq(officials.status, "active")));
    return senator;
  }

  async getMemberOfParliament(constituency: string): Promise<SelectOfficial | undefined> {
    const [mp] = await db.select().from(officials).where(and(eq(officials.constituency, constituency), eq(officials.role, "MP"), eq(officials.houseType, "lower_house"), eq(officials.status, "active")));
    return mp;
  }

  async getForumsByLocation(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectForum[]> {
    let query = db.select().from(forums);
    if (location.village) query = query.where(eq(forums.village, location.village));
    if (location.ward) query = query.where(eq(forums.ward, location.ward));
    if (location.constituency) query = query.where(eq(forums.constituency, location.constituency));
    if (location.county) query = query.where(eq(forums.county, location.county));
    return query;
  }

  async addForumModerator(moderator: InsertForumModerator): Promise<SelectForumModerator> {
    const [createdModerator] = await db.insert(forumModerators).values(moderator).returning();
    return createdModerator;
  }

  async getForumModerators(forumId: number): Promise<SelectForumModerator[]> {
    return db.select().from(forumModerators).where(eq(forumModerators.forumId, forumId));
  }

  async joinForum(member: InsertForumMember): Promise<SelectForumMember> {
    const [createdMember] = await db.insert(forumMembers).values(member).returning();
    return createdMember;
  }

  async getForumMembers(forumId: number): Promise<SelectForumMember[]> {
    return db.select().from(forumMembers).where(eq(forumMembers.forumId, forumId));
  }

  async isUserForumModerator(userId: number, forumId: number): Promise<boolean> {
    const count = await db.count().from(forumModerators).where(and(eq(forumModerators.userId, userId), eq(forumModerators.forumId, forumId)));
    return count > 0;
  }

  async getEmergencyServices(filters: { type?: string; village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectEmergencyService[]> {
    let query = db.select().from(emergencyServices);
    if (filters.type) query = query.where(eq(emergencyServices.type, filters.type));
    if (filters.village) query = query.where(eq(emergencyServices.village, filters.village));
    if (filters.ward) query = query.where(eq(emergencyServices.ward, filters.ward));
    if (filters.constituency) query = query.where(eq(emergencyServices.constituency, filters.constituency));
    if (filters.county) query = query.where(eq(emergencyServices.county, filters.county));
    return query;
  }

  async getEmergencyServiceById(id: number): Promise<SelectEmergencyService | undefined> {
    const [service] = await db.select().from(emergencyServices).where(eq(emergencyServices.id, id));
    return service;
  }

  async createEmergencyService(service: InsertEmergencyService): Promise<SelectEmergencyService> {
    const [createdService] = await db.insert(emergencyServices).values(service).returning();
    return createdService;
  }

  async updateEmergencyServiceStatus(id: number, status: string, updatedBy: number): Promise<SelectEmergencyService> {
    const [updatedService] = await db.update(emergencyServices).set({status, updatedAt: new Date()}).where(eq(emergencyServices.id, id)).returning();
    return updatedService;
  }

  async verifyEmergencyService(id: number, verifiedBy: number): Promise<SelectEmergencyService> {
    const [verifiedService] = await db.update(emergencyServices).set({isVerified: true, verifiedBy, updatedAt: new Date()}).where(eq(emergencyServices.id, id)).returning();
    return verifiedService;
  }
}

export const storage = new DatabaseStorage();