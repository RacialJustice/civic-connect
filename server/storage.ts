import { User, InsertUser, Feedback, InsertFeedback } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getLeaders(): Promise<User[]>;
  getFeedbackForLeader(leaderId: number): Promise<Feedback[]>;
  createFeedback(userId: number, feedback: InsertFeedback): Promise<Feedback>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
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

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName,
      isLeader: insertUser.isLeader ?? false,
      constituency: insertUser.constituency ?? null,
      position: insertUser.position ?? null,
      bio: insertUser.bio ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getLeaders(): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.isLeader);
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