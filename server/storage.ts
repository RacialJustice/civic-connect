import { type InsertUser, type SelectUser, type SelectFeedback, type InsertFeedback, type SelectOfficial, type SelectCommunity, type SelectForum, type SelectParliamentarySession, type SelectDevelopmentProject, type SelectPost, type InsertPost } from "@shared/schema";
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
  getLeaders({ ward, constituency, county }: { ward?: string; constituency?: string; county?: string }): Promise<SelectUser[]>;
  getFeedbackForLeader(leaderId: number): Promise<SelectFeedback[]>;
  createFeedback(userId: number, feedback: InsertFeedback): Promise<SelectFeedback>;
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
  updateUserProfile(
    userId: number,
    update: {
      name?: string;
      email?: string;
      village?: string | null;
      ward?: string | null;
      constituency?: string | null;
      county?: string | null;
    }
  ): Promise<SelectUser>;
  getUserActivity(userId: number): Promise<any[]>;
  getForum(forumId: number): Promise<SelectForum | undefined>;
  getForumPosts(forumId: number): Promise<SelectPost[]>;
  createPost(post: InsertPost): Promise<SelectPost>;
  upsertVote(vote: { postId: number; userId: number; type: string }): Promise<void>;
  updateRegistrationStep(userId: number, step: string): Promise<SelectUser>;
  completeUserProfile(userId: number): Promise<SelectUser>;
  getLocalOfficials(location: {
    village?: string;
    ward?: string;
    constituency?: string;
    county?: string;
  }): Promise<SelectOfficial[]>;
  getWomenRepresentative(county: string): Promise<SelectOfficial | undefined>;
  getSenator(county: string): Promise<SelectOfficial | undefined>;
  getMemberOfParliament(constituency: string): Promise<SelectOfficial | undefined>;
}

export interface Feedback extends InsertFeedback {
    id: number;
    userId: number;
    timestamp: Date;
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
  private posts: Map<number, SelectPost>;
  private votes: Map<string, { postId: number; userId: number; type: string; id: string; createdAt: Date }>;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.feedbacks = new Map();
    this.officials = new Map();
    this.communities = new Map();
    this.forums = new Map();
    this.parliamentarySessions = new Map();
    this.developmentProjects = new Map();
    this.posts = new Map();
    this.votes = new Map();
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
      level: null,
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      interests: ["governance", "development"],
      profileComplete: true,
      registrationStep: "completed",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Add some test officials
    const official1: SelectOfficial = {
      id: 1,
      name: "Hon. Sarah Kamau",
      role: "Member of Parliament",
      level: "National",
      position: "legislative",
      houseType: "lower_house",
      representationType: "elected",
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
      socialMedia: {},
      status: "active",
      createdAt: new Date(),
    };
    this.officials.set(official1.id, official1);

    const official2: SelectOfficial = {
      id: 2,
      name: "Hon. John Mwangi",
      role: "County Assembly Member",
      level: "County",
      position: "legislative",
      houseType: "lower_house",
      representationType: "elected",
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
      socialMedia: {},
      status: "active",
      createdAt: new Date(),
    };
    this.officials.set(official2.id, official2);

    const nationalLeader: SelectUser = {
      id: this.currentUserId++,
      email: "national@gov.ke",
      password: await hashPassword("leader123"),
      name: "Dr. Sarah Mwangi",
      village: null,
      ward: null,
      constituency: null,
      county: null,
      country: "Kenya",
      role: "leader",
      level: "national",
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      interests: ["governance"],
      profileComplete: true,
      registrationStep: "completed",
      createdAt: new Date(),
    };
    this.users.set(nationalLeader.id, nationalLeader);

    const countyLeader: SelectUser = {
      id: this.currentUserId++,
      email: "county@kiambu.go.ke",
      password: await hashPassword("leader123"),
      name: "Hon. James Kamau",
      village: null,
      ward: null,
      constituency: null,
      county: "Kiambu",
      country: "Kenya",
      role: "leader",
      level: "county",
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      interests: ["development"],
      profileComplete: true,
      registrationStep: "completed",
      createdAt: new Date(),
    };
    this.users.set(countyLeader.id, countyLeader);

    const constituencyLeader: SelectUser = {
      id: this.currentUserId++,
      email: "mp@kabete.go.ke",
      password: await hashPassword("leader123"),
      name: "Hon. Peter Gitau",
      village: null,
      ward: null,
      constituency: "Kabete",
      county: "Kiambu",
      country: "Kenya",
      role: "leader",
      level: "constituency",
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      interests: ["education"],
      profileComplete: true,
      registrationStep: "completed",
      createdAt: new Date(),
    };
    this.users.set(constituencyLeader.id, constituencyLeader);

    const wardLeader: SelectUser = {
      id: this.currentUserId++,
      email: "mca@kabete.go.ke",
      password: await hashPassword("leader123"),
      name: "Hon. Mary Njeri",
      village: null,
      ward: "Kabete",
      constituency: "Kabete",
      county: "Kiambu",
      country: "Kenya",
      role: "leader",
      level: "ward",
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      interests: ["local development"],
      profileComplete: true,
      registrationStep: "completed",
      createdAt: new Date(),
    };
    this.users.set(wardLeader.id, wardLeader);

    const womenRep: SelectOfficial = {
      id: 3,
      name: "Hon. Jane Njeri",
      role: "Women Representative",
      level: "county",
      position: "legislative",
      houseType: "lower_house",
      representationType: "elected",
      party: "Democratic Party",
      photo: null,
      email: "jane.njeri@parliament.go.ke",
      phone: "+254700000003",
      village: null,
      ward: null,
      constituency: null,
      county: "Nairobi",
      country: "Kenya",
      termStart: new Date("2022-08-09"),
      termEnd: new Date("2027-08-09"),
      responsibilities: "Women representation, gender equality advocacy",
      socialMedia: {},
      status: "active",
      createdAt: new Date(),
    };
    this.officials.set(womenRep.id, womenRep);

    const senator: SelectOfficial = {
      id: 4,
      name: "Hon. James Orengo",
      role: "Senator",
      level: "county",
      position: "legislative",
      houseType: "upper_house",
      representationType: "elected",
      party: "Unity Party",
      photo: null,
      email: "james.orengo@senate.go.ke",
      phone: "+254700000004",
      village: null,
      ward: null,
      constituency: null,
      county: "Nairobi",
      country: "Kenya",
      termStart: new Date("2022-08-09"),
      termEnd: new Date("2027-08-09"),
      responsibilities: "County representation, legislation review",
      socialMedia: {},
      status: "active",
      createdAt: new Date(),
    };
    this.officials.set(senator.id, senator);
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
      level: null,
      emailVerified: insertUser.emailVerified || false,
      verificationToken: insertUser.verificationToken || null,
      verificationTokenExpiry: insertUser.verificationTokenExpiry || null,
      interests: insertUser.interests || [],
      profileComplete: false,
      registrationStep: "incomplete",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getLeaders({ ward, constituency, county }: { 
    ward?: string, 
    constituency?: string, 
    county?: string 
  } = {}): Promise<SelectUser[]> {
    const leaders = Array.from(this.users.values()).filter(user => {
      // Only return users with 'leader' role
      if (user.role !== 'leader') return false;

      // If no location filters provided, return all leaders
      if (!ward && !constituency && !county) return true;

      // National level leaders should always be included
      if (user.level === 'national') return true;

      // For county level, include if county matches
      if (user.level === 'county') {
        return !county || user.county === county;
      }

      // For constituency level, include if constituency matches
      if (user.level === 'constituency') {
        return !constituency || user.constituency === constituency;
      }

      // For ward level, include if ward matches
      if (user.level === 'ward') {
        return !ward || user.ward === ward;
      }

      return false;
    });

    return leaders;
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
  async updateUserProfile(
    userId: number,
    update: {
      name?: string;
      email?: string;
      village?: string | null;
      ward?: string | null;
      constituency?: string | null;
      county?: string | null;
    }
  ): Promise<SelectUser> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      ...update,
      // Ensure null values are properly handled
      village: update.village ?? user.village,
      ward: update.ward ?? user.ward,
      constituency: update.constituency ?? user.constituency,
      county: update.county ?? user.county,
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserActivity(userId: number): Promise<any[]> {
    // Stub implementation - return empty activity list
    return [];
  }

  async getForum(forumId: number): Promise<SelectForum | undefined> {
    return Array.from(this.forums.values()).find(forum => forum.id === forumId);
  }

  async getForumPosts(forumId: number): Promise<SelectPost[]> {
    // Return posts for the given forum
    return Array.from(this.posts.values())
      .filter(post => post.forumId === forumId);
  }

  async createPost(post: InsertPost): Promise<SelectPost> {
    const id = this.posts.size ? Math.max(...Array.from(this.posts.keys())) + 1 : 1;
    const newPost: SelectPost = {
      ...post,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: post.pinned ?? null,
      locked: post.locked ?? null,
    };

    this.posts.set(id, newPost);
    return newPost;
  }

  async upsertVote(vote: { postId: number; userId: number; type: string }): Promise<void> {
    // Stub implementation - just store the vote
    const voteId = `${vote.postId}-${vote.userId}`;
    this.votes.set(voteId, {
      ...vote,
      id: voteId,
      createdAt: new Date()
    });
  }

  async updateRegistrationStep(userId: number, step: string): Promise<SelectUser> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      registrationStep: step,
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async completeUserProfile(userId: number): Promise<SelectUser> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      profileComplete: true,
      registrationStep: "completed",
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getLocalOfficials(location: {
    village?: string;
    ward?: string;
    constituency?: string;
    county?: string;
  }): Promise<SelectOfficial[]> {
    return Array.from(this.officials.values()).filter(official => {
      if (location.village && official.village === location.village) return true;
      if (location.ward && official.ward === location.ward) return true;
      if (location.constituency && official.constituency === location.constituency) return true;
      if (location.county && official.county === location.county) return true;
      return false;
    });
  }

  async getWomenRepresentative(county: string): Promise<SelectOfficial | undefined> {
    return Array.from(this.officials.values()).find(
      official => 
        official.county === county && 
        official.role === "Women Representative" &&
        official.status === "active"
    );
  }

  async getSenator(county: string): Promise<SelectOfficial | undefined> {
    return Array.from(this.officials.values()).find(
      official => 
        official.county === county && 
        official.role === "Senator" &&
        official.houseType === "upper_house" &&
        official.status === "active"
    );
  }

  async getMemberOfParliament(constituency: string): Promise<SelectOfficial | undefined> {
    return Array.from(this.officials.values()).find(
      official => 
        official.constituency === constituency && 
        official.role === "MP" &&
        official.houseType === "lower_house" &&
        official.status === "active"
    );
  }
}

export const storage = new MemStorage();