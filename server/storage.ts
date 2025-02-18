import { type InsertUser, type SelectUser, type SelectFeedback, type InsertFeedback, type SelectOfficial, type SelectCommunity, type SelectForum, type SelectParliamentarySession, type SelectDevelopmentProject, type SelectPost, type InsertPost, type InsertForumModerator, type SelectForumModerator, type InsertForumMember, type SelectForumMember, type InsertEmergencyService, type SelectEmergencyService } from "@shared/schema";
import { supabase } from '../client/src/lib/supabase';
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: string): Promise<SelectUser | undefined>;
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
  updateUserLocation(userId: string, update: { ward: string; constituency: string; county: string; village?: string }): Promise<SelectUser>;
  updateUserProfile(userId: string, update: { name?: string; email?: string; village?: string | null; ward?: string | null; constituency?: string | null; county?: string | null }): Promise<SelectUser>;
  getUserActivity(userId: string): Promise<any[]>;
  getForum(forumId: number): Promise<SelectForum | undefined>;
  getForumPosts(forumId: number): Promise<SelectPost[]>;
  createPost(post: InsertPost): Promise<SelectPost>;
  upsertVote(vote: { postId: number; userId: number; type: string }): Promise<void>;
  updateRegistrationStep(userId: string, step: string): Promise<SelectUser>;
  completeUserProfile(userId: string): Promise<SelectUser>;
  getLocalOfficials(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectOfficial[]>;
  getWomenRepresentative(county: string): Promise<SelectOfficial | undefined>;
  getSenator(county: string): Promise<SelectOfficial | undefined>;
  getMemberOfParliament(constituency: string): Promise<SelectOfficial | undefined>;
  getForumsByLocation(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectForum[]>;
  addForumModerator(moderator: InsertForumModerator): Promise<SelectForumModerator>;
  getForumModerators(forumId: number): Promise<SelectForumModerator[]>;
  joinForum(member: InsertForumMember): Promise<SelectForumMember>;
  getForumMembers(forumId: number): Promise<SelectForumMember[]>;
  isUserForumModerator(userId: string, forumId: number): Promise<boolean>;
  getEmergencyServices(filters: { type?: string; village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectEmergencyService[]>;
  getEmergencyServiceById(id: number): Promise<SelectEmergencyService | undefined>;
  createEmergencyService(service: InsertEmergencyService): Promise<SelectEmergencyService>;
  updateEmergencyServiceStatus(id: number, status: string, updatedBy: string): Promise<SelectEmergencyService>;
  verifyEmergencyService(id: number, verifiedBy: string): Promise<SelectEmergencyService>;

  // Gamification methods
  getPoints(userId: string): Promise<any[]>;
  getBadgesForUser(userId: string): Promise<any[]>;
  awardPoints(params: { userId: string; amount: number; reason: string; category: string }): Promise<any>;
  awardBadge(params: { userId: string; badgeId: string }): Promise<any>;
}

export class SupabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: string): Promise<SelectUser | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserByEmail(email: string): Promise<SelectUser | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  async createUser(user: InsertUser): Promise<SelectUser> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getLeaders({ ward, constituency, county }: { ward?: string; constituency?: string; county?: string }): Promise<SelectUser[]> {
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'leader');

    if (ward) query = query.eq('ward', ward);
    if (constituency) query = query.eq('constituency', constituency);
    if (county) query = query.eq('county', county);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getFeedbackForLeader(leaderId: number): Promise<SelectFeedback[]> {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('leaderId', leaderId);
    if (error) throw error;
    return data;
  }

  async createFeedback(userId: number, feedback: InsertFeedback): Promise<SelectFeedback> {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({...feedback, userId})
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async searchOfficials(term: string, location: string): Promise<SelectOfficial[]> {
    const normalizedTerm = `%${term.toLowerCase()}%`;
    const normalizedLocation = `%${location.toLowerCase()}%`;
    const { data, error } = await supabase
      .from('officials')
      .select('*')
      .or(`LOWER(name) LIKE '${normalizedTerm}', LOWER(role) LIKE '${normalizedTerm}', LOWER(party) LIKE '${normalizedTerm}'`)
      .or(`LOWER(ward) LIKE '${normalizedLocation}', LOWER(constituency) LIKE '${normalizedLocation}', LOWER(county) LIKE '${normalizedLocation}'`);
    if (error) throw error;
    return data;
  }

  async searchCommunities(term: string, location: string): Promise<SelectCommunity[]> {
    const normalizedTerm = term.toLowerCase();
    const {data, error} = await supabase.from('communities').select('*').or(`LOWER(name) LIKE '%${normalizedTerm}%', LOWER(description) LIKE '%${normalizedTerm}%'`);
    if (error) throw error;
    return data;
  }

  async searchForums(term: string, category: string): Promise<SelectForum[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedCategory = category.toLowerCase();
    const {data, error} = await supabase.from('forums').select('*').or(`LOWER(name) LIKE '%${normalizedTerm}%', LOWER(description) LIKE '%${normalizedTerm}%'`).eq('category', category);
    if (error) throw error;
    return data;
  }

  async searchParliamentarySessions(term: string, type: string): Promise<SelectParliamentarySession[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedType = type.toLowerCase();
    const {data, error} = await supabase.from('parliamentarySessions').select('*').or(`LOWER(title) LIKE '%${normalizedTerm}%', LOWER(description) LIKE '%${normalizedTerm}%'`).eq('type', type);
    if (error) throw error;
    return data;
  }

  async searchDevelopmentProjects(term: string, location: string, status: string): Promise<SelectDevelopmentProject[]> {
    const normalizedTerm = term.toLowerCase();
    const normalizedLocation = location.toLowerCase();
    const normalizedStatus = status.toLowerCase();
    const {data, error} = await supabase.from('developmentProjects').select('*').or(`LOWER(title) LIKE '%${normalizedTerm}%', LOWER(description) LIKE '%${normalizedTerm}%'`).like('location', `%${normalizedLocation}%`).eq('status', status);
    if (error) throw error;
    return data;
  }

  async updateUserLocation(userId: string, update: { ward: string; constituency: string; county: string; village?: string }): Promise<SelectUser> {
    const { data, error } = await supabase
      .from('users')
      .update(update)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, update: { name?: string; email?: string; village?: string | null; ward?: string | null; constituency?: string | null; county?: string | null }): Promise<SelectUser> {
    const { data, error } = await supabase
      .from('users')
      .update(update)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getUserActivity(userId: string): Promise<any[]> {
    return [];
  }

  async getForum(forumId: number): Promise<SelectForum | undefined> {
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .eq('id', forumId)
      .single();
    if (error) throw error;
    return data;
  }

  async getForumPosts(forumId: number): Promise<SelectPost[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('forumId', forumId);
    if (error) throw error;
    return data;
  }

  async createPost(post: InsertPost): Promise<SelectPost> {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async upsertVote(vote: { postId: number; userId: number; type: string }): Promise<void> {
    //This needs a more robust implementation for a real database
  }

  async updateRegistrationStep(userId: string, step: string): Promise<SelectUser> {
    const { data, error } = await supabase
      .from('users')
      .update({ registrationStep: step })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async completeUserProfile(userId: string): Promise<SelectUser> {
    const { data, error } = await supabase
      .from('users')
      .update({ profileComplete: true, registrationStep: "completed" })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getLocalOfficials(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectOfficial[]> {
    let query = supabase.from('officials').select('*').eq('status', 'active');
    if (location.ward) query = query.eq('ward', location.ward);
    if (location.constituency) query = query.or(`constituency = '${location.constituency}', county = '${location.county}'`);
    else if (location.county) query = query.eq('county', location.county);
    const {data, error} = await query;
    if (error) throw error;
    return data;
  }

  async getWomenRepresentative(county: string): Promise<SelectOfficial | undefined> {
    const { data, error } = await supabase
      .from('officials')
      .select('*')
      .eq('county', county)
      .eq('role', 'Women Representative')
      .eq('status', 'active')
      .single();
    if (error) throw error;
    return data;
  }

  async getSenator(county: string): Promise<SelectOfficial | undefined> {
    const { data, error } = await supabase
      .from('officials')
      .select('*')
      .eq('county', county)
      .eq('role', 'Senator')
      .eq('houseType', 'upper_house')
      .eq('status', 'active')
      .single();
    if (error) throw error;
    return data;
  }

  async getMemberOfParliament(constituency: string): Promise<SelectOfficial | undefined> {
    const { data, error } = await supabase
      .from('officials')
      .select('*')
      .eq('constituency', constituency)
      .eq('role', 'MP')
      .eq('houseType', 'lower_house')
      .eq('status', 'active')
      .single();
    if (error) throw error;
    return data;
  }

  async getForumsByLocation(location: { village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectForum[]> {
    let query = supabase.from('forums').select('*');
    if (location.village) query = query.eq('village', location.village);
    if (location.ward) query = query.eq('ward', location.ward);
    if (location.constituency) query = query.eq('constituency', location.constituency);
    if (location.county) query = query.eq('county', location.county);
    const {data, error} = await query;
    if (error) throw error;
    return data;
  }

  async addForumModerator(moderator: InsertForumModerator): Promise<SelectForumModerator> {
    const { data, error } = await supabase
      .from('forumModerators')
      .insert([moderator])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getForumModerators(forumId: number): Promise<SelectForumModerator[]> {
    const { data, error } = await supabase
      .from('forumModerators')
      .select('*')
      .eq('forumId', forumId);
    if (error) throw error;
    return data;
  }

  async joinForum(member: InsertForumMember): Promise<SelectForumMember> {
    const { data, error } = await supabase
      .from('forumMembers')
      .insert([member])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getForumMembers(forumId: number): Promise<SelectForumMember[]> {
    const { data, error } = await supabase
      .from('forumMembers')
      .select('*')
      .eq('forumId', forumId);
    if (error) throw error;
    return data;
  }

  async isUserForumModerator(userId: string, forumId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('forumModerators')
      .select()
      .eq('userId', userId)
      .eq('forumId', forumId)
      .single();
    if (error) throw error;
    return data !== null;
  }

  async getEmergencyServices(filters: { type?: string; village?: string; ward?: string; constituency?: string; county?: string }): Promise<SelectEmergencyService[]> {
    let query = supabase.from('emergencyServices').select('*');
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.village) query = query.eq('village', filters.village);
    if (filters.ward) query = query.eq('ward', filters.ward);
    if (filters.constituency) query = query.eq('constituency', filters.constituency);
    if (filters.county) query = query.eq('county', filters.county);
    const {data, error} = await query;
    if (error) throw error;
    return data;
  }

  async getEmergencyServiceById(id: number): Promise<SelectEmergencyService | undefined> {
    const { data, error } = await supabase
      .from('emergencyServices')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createEmergencyService(service: InsertEmergencyService): Promise<SelectEmergencyService> {
    const { data, error } = await supabase
      .from('emergencyServices')
      .insert([service])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateEmergencyServiceStatus(id: number, status: string, updatedBy: string): Promise<SelectEmergencyService> {
    const { data, error } = await supabase
      .from('emergencyServices')
      .update({ status, updatedAt: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async verifyEmergencyService(id: number, verifiedBy: string): Promise<SelectEmergencyService> {
    const { data, error } = await supabase
      .from('emergencyServices')
      .update({ isVerified: true, verifiedBy, updatedAt: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getPoints(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('points')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async getBadgesForUser(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async awardPoints(params: { userId: string; amount: number; reason: string; category: string }): Promise<any> {
    const { data, error } = await supabase
      .from('points')
      .insert([{
        user_id: params.userId,
        amount: params.amount,
        reason: params.reason,
        category: params.category
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async awardBadge(params: { userId: string; badgeId: string }): Promise<any> {
    const { data, error } = await supabase
      .from('user_badges')
      .insert([{
        user_id: params.userId,
        badge_id: params.badgeId,
        awarded_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const storage = new SupabaseStorage();