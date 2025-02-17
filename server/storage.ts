import { type InsertUser, type SelectUser, type Feedback, type InsertFeedback } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<SelectUser | undefined>;
  getUserByEmail(email: string): Promise<SelectUser | undefined>;
  createUser(user: InsertUser): Promise<SelectUser>;
  getLeaders(): Promise<SelectUser[]>;
  getFeedbackForLeader(leaderId: number): Promise<Feedback[]>;
  createFeedback(userId: number, feedback: InsertFeedback): Promise<Feedback>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, SelectUser>;
  private feedbacks: Map<number, Feedback>;
  private currentUserId: number;
  private currentFeedbackId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.feedbacks = new Map();
    this.currentUserId = 1;
    this.currentFeedbackId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
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
}

export const storage = new MemStorage();