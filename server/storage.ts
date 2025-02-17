import { type InsertUser, type SelectUser, type Feedback, type InsertFeedback, type SelectOfficial, type SelectCommunity, type SelectForum, type SelectParliamentarySession, type SelectDevelopmentProject } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  getUser(id: number): Promise<SelectUser | undefined>;
  getUserByEmail(email: string): Promise<SelectUser | undefined>;
  createUser(user: InsertUser): Promise<SelectUser>;
  getLeaders(): Promise<SelectUser[]>;
  getFeedbackForLeader(leaderId: number): Promise<Feedback[]>;
  createFeedback(userId: number, feedback: InsertFeedback): Promise<Feedback>;
  sessionStore: session.Store;
  searchOfficials(term: string, location: string): Promise<SelectOfficial[]>;
  searchCommunities(term: string, location: string): Promise<SelectCommunity[]>;
  searchForums(term: string, category: string): Promise<SelectForum[]>;
  searchParliamentarySessions(term: string, type: string): Promise<SelectParliamentarySession[]>;
  searchDevelopmentProjects(
    term: string,
    location: string,
    status: string
  ): Promise<SelectDevelopmentProject[]>;
  updateUserLocation(userId: number, update: { ward: string; constituency: string; county: string }): Promise<SelectUser>;
}

export class MemStorage implements IStorage {
  private users: Map<number, SelectUser>;
  private feedbacks: Map<number, Feedback>;
  private currentUserId: number;
  private currentFeedbackId: number;
  private officials: Map<number, SelectOfficial>;
  private communities: Map<number, SelectCommunity>;
  private forums: Map<number, SelectForum>;
  private parliamentarySessions: Map<number, SelectParliamentarySession>;
  private developmentProjects: Map<number, SelectDevelopmentProject>;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.feedbacks = new Map();
    this.officials = new Map();
    this.communities = new Map();
    this.forums = new Map();
    this.parliamentarySessions = new Map();
    this.developmentProjects = new Map();
    this.currentUserId = 1;
    this.currentFeedbackId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with test data
    this.initializeTestData();
  }

  private async initializeTestData() {
    // Add a test admin user
    const adminUser: SelectUser = {
      id: this.currentUserId++,
      email: "admin@kenyaconnect.com",
      password: await hashPassword("admin123"),
      name: "Admin User",
      village: null,
      ward: "Central Ward",
      constituency: "Nairobi Central",
      county: "Nairobi",
      country: "Kenya",
      role: "admin",
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      interests: ["governance", "development"],
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Add some test officials
    const official1: SelectOfficial = {
      id: 1,
      name: "Hon. Sarah Kamau",
      role: "Member of Parliament",
      level: "National",
      party: "Democratic Party",
      photo: null,
      email: "sarah.kamau@parliament.go.ke",
      phone: "+254700000001",
      village: null,
      ward: null,
      constituency: "Nairobi Central",
      county: "Nairobi",
      country: "Kenya",
      termStart: new Date("2022-08-09"),
      termEnd: new Date("2027-08-09"),
      responsibilities: "Legislative duties, constituency development",
      socialMedia: null,
      createdAt: new Date(),
    };
    this.officials.set(official1.id, official1);

    const official2: SelectOfficial = {
      id: 2,
      name: "Hon. John Mwangi",
      role: "County Assembly Member",
      level: "County",
      party: "Unity Party",
      photo: null,
      email: "john.mwangi@assembly.go.ke",
      phone: "+254700000002",
      village: null,
      ward: "Central Ward",
      constituency: null,
      county: "Nairobi",
      country: "Kenya",
      termStart: new Date("2022-08-09"),
      termEnd: new Date("2027-08-09"),
      responsibilities: "County legislation, ward development",
      socialMedia: null,
      createdAt: new Date(),
    };
    this.officials.set(official2.id, official2);
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<SelectUser | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<SelectUser> {
    const id = this.currentUserId++;
    const user = {
      id,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name || null,
      village: insertUser.village || null,
      ward: insertUser.ward || null,
      constituency: insertUser.constituency || null,
      county: insertUser.county || null,
      country: insertUser.country || "Kenya",
      role: insertUser.role || "citizen",
      emailVerified: insertUser.emailVerified || false,
      verificationToken: insertUser.verificationToken || null,
      verificationTokenExpiry: insertUser.verificationTokenExpiry || null,
      interests: insertUser.interests || [],
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getLeaders(): Promise<SelectUser[]> {
    return Array.from(this.users.values()).filter((user) => user.role === "leader");
  }

  async getFeedbackForLeader(leaderId: number): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.leaderId === leaderId,
    );
  }

  async createFeedback(userId: number, feedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const newFeedback = {
      ...feedback,
      id,
      userId,
      timestamp: new Date(),
    };
    this.feedbacks.set(id, newFeedback);
    return newFeedback;
  }

  async searchOfficials(term: string, location: string): Promise<SelectOfficial[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedLocation = location.toLowerCase();

    return Array.from(this.officials.values()).filter(official => {
      const matchesTerm = !term || 
        official.name.toLowerCase().includes(normalizedTerm) ||
        official.role.toLowerCase().includes(normalizedTerm) ||
        official.party?.toLowerCase().includes(normalizedTerm);

      const matchesLocation = !location ||
        official.ward?.toLowerCase().includes(normalizedLocation) ||
        official.constituency?.toLowerCase().includes(normalizedLocation) ||
        official.county?.toLowerCase().includes(normalizedLocation);

      return matchesTerm && matchesLocation;
    });
  }

  async searchCommunities(term: string, location: string): Promise<SelectCommunity[]> {
    const normalizedTerm = term.toLowerCase();

    return Array.from(this.communities.values()).filter(community => {
      return !term || 
        community.name.toLowerCase().includes(normalizedTerm) ||
        community.description?.toLowerCase().includes(normalizedTerm);
    });
  }

  async searchForums(term: string, category: string): Promise<SelectForum[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedCategory = category.toLowerCase();

    return Array.from(this.forums.values()).filter(forum => {
      const matchesTerm = !term || 
        forum.name.toLowerCase().includes(normalizedTerm) ||
        forum.description.toLowerCase().includes(normalizedTerm);

      const matchesCategory = !category || 
        forum.category.toLowerCase() === normalizedCategory;

      return matchesTerm && matchesCategory;
    });
  }

  async searchParliamentarySessions(term: string, type: string): Promise<SelectParliamentarySession[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedType = type.toLowerCase();

    return Array.from(this.parliamentarySessions.values()).filter(session => {
      const matchesTerm = !term || 
        session.title.toLowerCase().includes(normalizedTerm) ||
        session.description?.toLowerCase().includes(normalizedTerm);

      const matchesType = !type || 
        session.type.toLowerCase() === normalizedType;

      return matchesTerm && matchesType;
    });
  }

  async searchDevelopmentProjects(
    term: string,
    location: string,
    status: string
  ): Promise<SelectDevelopmentProject[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedLocation = location.toLowerCase();
    const normalizedStatus = status.toLowerCase();

    return Array.from(this.developmentProjects.values()).filter(project => {
      const matchesTerm = !term || 
        project.title.toLowerCase().includes(normalizedTerm) ||
        project.description.toLowerCase().includes(normalizedTerm);

      const matchesLocation = !location || 
        project.location.toLowerCase().includes(normalizedLocation);

      const matchesStatus = !status || 
        project.status.toLowerCase() === normalizedStatus;

      return matchesTerm && matchesLocation && matchesStatus;
    });
  }
  async updateUserLocation(
    userId: number,
    update: { ward: string; constituency: string; county: string }
  ): Promise<SelectUser> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      ward: update.ward,
      constituency: update.constituency,
      county: update.county,
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();