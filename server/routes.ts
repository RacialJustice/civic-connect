<<<<<<< HEAD
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";
import type { IncomingMessage } from "http";
import type { SelectUser } from "@shared/schema";
import { 
  isValidCounty, 
  isValidConstituencyInCounty, 
  isValidWardInConstituency,
  getCountyByConstituency 
} from "@shared/kenya-locations";

// Extend the IncomingMessage interface to include the user property
interface AuthenticatedRequest extends IncomingMessage {
  user?: SelectUser;
}

// Maintain a list of connected clients
const clients = new Map<WebSocket, { userId: number, username: string }>();

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/leaders", async (req, res) => {
    try {
      console.log('Received leader request with params:', req.query);
      const leaders = await storage.getLocalOfficials({
        ward: req.query.ward as string,
        constituency: req.query.constituency as string,
        county: req.query.county as string,
      });
      console.log('Returning leaders:', leaders);
      res.json(leaders);
    } catch (error) {
      console.error('Error fetching leaders:', error);
      res.status(500).json({ error: "Failed to fetch leaders" });
    }
  });

  app.get("/api/leaders/:id/feedback", async (req, res) => {
    const leaderId = parseInt(req.params.id);
    const feedbacks = await storage.getFeedbackForLeader(leaderId);
    res.json(feedbacks);
  });

  app.post("/api/leaders/:id/feedback", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const leaderId = parseInt(req.params.id);
    const parsedBody = insertFeedbackSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ error: "Invalid feedback data" });
    }

    const feedback = await storage.createFeedback(req.user!.id, {
      ...parsedBody.data,
      leaderId,
    });

    res.status(201).json(feedback);
  });

  // Search endpoints
  app.get("/api/search/officials", async (req, res) => {
    const { term, location } = req.query;
    const officials = await storage.searchOfficials(
      term as string,
      location as string
    );
    res.json(officials);
  });

  app.get("/api/search/communities", async (req, res) => {
    const { term, location } = req.query;
    const communities = await storage.searchCommunities(
      term as string,
      location as string
    );
    res.json(communities);
  });

  app.get("/api/search/forums", async (req, res) => {
    const { term, category } = req.query;
    const forums = await storage.searchForums(
      term as string,
      category as string
    );
    res.json(forums);
  });

  app.get("/api/search/parliament", async (req, res) => {
    const { term, type } = req.query;
    const sessions = await storage.searchParliamentarySessions(
      term as string,
      type as string
    );
    res.json(sessions);
  });

  app.get("/api/search/projects", async (req, res) => {
    const { term, location, status } = req.query;
    const projects = await storage.searchDevelopmentProjects(
      term as string,
      location as string,
      status as string
    );
    res.json(projects);
  });

  app.patch("/api/user/location", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { ward, constituency, village } = req.body;

    try {
      // Get county based on constituency
      const county = getCountyByConstituency(constituency);
      if (!constituency || !county) {
        return res.status(400).json({
          error: "Invalid constituency name"
        });
      }

      // Validate ward if provided
      if (ward && !isValidWardInConstituency(ward, constituency)) {
        return res.status(400).json({
          error: "The specified ward does not belong to this constituency"
        });
      }

      const user = await storage.updateUserLocation(req.user!.id, {
        ward,
        constituency,
        county,
        village
      });

      res.json(user);
    } catch (error) {
      console.error('Error updating user location:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Failed to update location"
      });
    }
  });

  app.patch("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { name, email, village, ward, constituency } = req.body;

    try {
      // Validate location data
      if (ward && constituency) {
        const isValidWard = validateWardInConstituency(ward, constituency);
        if (!isValidWard) {
          return res.status(400).json({
            error: "The specified ward does not belong to this constituency"
          });
        }
      }

      // Get county based on constituency
      const county = constituency ? getCountyByConstituency(constituency) : null;
      if (constituency && !county) {
        return res.status(400).json({
          error: "Invalid constituency name"
        });
      }

      const user = await storage.updateUserProfile(req.user!.id, {
        name,
        email,
        village,
        ward,
        constituency,
        county
      });

      res.json(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Failed to update profile"
      });
    }
  });

  app.get("/api/user/activity", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const activity = await storage.getUserActivity(req.user!.id);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to fetch user activity" });
    }
  });

  app.get("/api/forums/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const forumId = parseInt(req.params.id);
    const forum = await storage.getForum(forumId);

    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    res.json(forum);
  });

  app.get("/api/forums/:id/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const forumId = parseInt(req.params.id);
    const posts = await storage.getForumPosts(forumId);
    res.json(posts);
  });

  app.post("/api/forums/:id/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const forumId = parseInt(req.params.id);
    const post = await storage.createPost({
      ...req.body,
      forumId,
      authorId: req.user!.id,
    });

    res.status(201).json(post);
  });

  app.post("/api/forums/:forumId/posts/:postId/vote", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const postId = parseInt(req.params.postId);
    const { type } = req.body;

    await storage.upsertVote({
      postId,
      userId: req.user!.id,
      type,
    });

    const posts = await storage.getForumPosts(parseInt(req.params.forumId));
    res.json(posts);
  });

  const httpServer = createServer(app);

  // Initialize WebSocket server with proper types
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: AuthenticatedRequest) => {
    console.log('New WebSocket connection');

    // Authentication check using the session
    if (!req.user?.id) {
      ws.close(1008, 'Authentication required');
      return;
    }

    const userId = req.user.id;

    // Get user details from storage
    storage.getUser(userId).then(user => {
      if (!user) {
        ws.close(1008, 'User not found');
        return;
      }

      // Store client information
      clients.set(ws, { userId: user.id, username: user.name || 'Anonymous' });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'system',
        content: `Welcome ${user.name || 'Anonymous'}!`,
        timestamp: new Date().toISOString()
      }));

      // Broadcast user joined message
      const joinMessage = JSON.stringify({
        type: 'system',
        content: `${user.name || 'Anonymous'} joined the chat`,
        timestamp: new Date().toISOString()
      });

      broadcastMessage(joinMessage, ws);

      // Handle incoming messages
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          const clientInfo = clients.get(ws);

          if (clientInfo) {
            const formattedMessage = JSON.stringify({
              type: 'message',
              sender: clientInfo.username,
              content: message.content,
              timestamp: new Date().toISOString()
            });

            broadcastMessage(formattedMessage, null); // Send to all clients
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        const clientInfo = clients.get(ws);
        if (clientInfo) {
          const leaveMessage = JSON.stringify({
            type: 'system',
            content: `${clientInfo.username} left the chat`,
            timestamp: new Date().toISOString()
          });

          broadcastMessage(leaveMessage, null);
          clients.delete(ws);
        }
      });
    });
  });

  // Utility function to broadcast messages
  function broadcastMessage(message: string, exclude: WebSocket | null) {
    clients.forEach((_, client) => {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  return httpServer;
=======
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { officials, resources, users, communities, forums, posts, comments, votes,
         parliamentarySessions, attendance, bills, votingRecords, developmentProjects } from "@db/schema";
import { scrapeIEBCRepresentatives } from "./utils/iebc-scraper";
import { eq, desc, and } from "drizzle-orm";
import { sql } from 'drizzle-orm/sql';

export const PORT = 3000;

function handleDatabaseError(error: unknown, res: Response, operation: string) {
  console.error(`Database error during ${operation}:`, error);
  if (error instanceof Error) {
    res.status(500).json({
      error: "Database operation failed",
      message: error.message,
      operation,
    });
  } else {
    res.status(500).json({
      error: "An unexpected database error occurred",
      operation,
    });
  }
}

export function registerRoutes(app: Express): Server {
  // Get officials - Public access
  app.get("/api/officials", async (_req: Request, res: Response) => {
    try {
      const allOfficials = await db.select().from(officials);
      res.json(allOfficials);
    } catch (error) {
      handleDatabaseError(error, res, "fetching officials");
    }
  });

  // Get officials by location - Public access
  app.get("/api/officials/location/:type/:value", async (req: Request, res: Response) => {
    try {
      const { type, value } = req.params;
      const locationOfficials = await db
        .select()
        .from(officials)
        .where(eq(officials[type as "village" | "ward" | "county" | "constituency"], value));
      res.json(locationOfficials);
    } catch (error) {
      handleDatabaseError(error, res, "fetching officials by location");
    }
  });

  // Get educational resources - Public access
  app.get("/api/resources", async (_req: Request, res: Response) => {
    try {
      const allResources = await db.select().from(resources);
      res.json(allResources);
    } catch (error) {
      handleDatabaseError(error, res, "fetching resources");
    }
  });

  // Get resources by category - Public access
  app.get("/api/resources/:category", async (req: Request, res: Response) => {
    try {
      const categoryResources = await db
        .select()
        .from(resources)
        .where(eq(resources.category, req.params.category));
      res.json(categoryResources);
    } catch (error) {
      handleDatabaseError(error, res, "fetching resources by category");
    }
  });


  // IEBC PDF Resources endpoint - Public access
  app.get("/api/iebc-pdf", async (_req:Request, res: Response) => {
    try {
      const pdfData = await scrapeIEBCPdf();
      res.json(pdfData);
    } catch (error) {
      handleDatabaseError(error, res, "fetching IEBC PDF data");
    }
  });

  // IEBC Representatives endpoint - Public access
  app.get("/api/iebc-representatives", async (_req:Request, res: Response) => {
    try {
      const [representatives, mps] = await Promise.all([
        scrapeIEBCRepresentatives(),
        scrapeParliamentMPs()
      ]);
      res.json([...representatives, ...mps]);
    } catch (error) {
      handleDatabaseError(error, res, "fetching representatives");
    }
  });

  // Get trending posts - Public access
  app.get("/api/trending-posts", async (_req: Request, res: Response) => {
    try {
      const trendingPosts = await db.query.posts.findMany({
        with: {
          forum: {
            columns: {
              name: true,
            },
          },
          votes: true,
          comments: {
            columns: {
              id: true,
            },
          },
        },
        where: sql`${posts.createdAt} >= NOW() - INTERVAL '7 days'`,
        orderBy: [
          sql`(
            SELECT COUNT(*) 
            FROM ${votes} 
            WHERE ${votes.postId} = ${posts.id}
            AND ${votes.type} = 'up'
          ) DESC`,
          desc(posts.createdAt),
        ],
        limit: 5,
      });

      const transformedPosts = trendingPosts.map((post) => ({
        id: post.id,
        title: post.title,
        forumId: post.forumId,
        forumName: post.forum?.name || 'Unknown Forum',
        upvotes: post.votes.filter((vote) => vote.type === "up").length,
        commentCount: post.comments.length,
      }));

      res.json(transformedPosts);
    } catch (error) {
      handleDatabaseError(error, res, "fetching trending posts");
    }
  });

  // Chat endpoint for Quick Help - Public access
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).send("Message is required");
      }

      const response = await getChatResponse(message);
      res.json({ message: response });
    } catch (error) {
      handleDatabaseError(error, res, "getting chat response");
    }
  });


  // Add county mapping function
  function getCountyFromConstituency(constituency: string): string | null {
    const constituencyToCounty: Record<string, string> = {
      // Nairobi County
      'Langata': 'Nairobi',
      'Dagoretti North': 'Nairobi',
      'Dagoretti South': 'Nairobi',
      'Kibra': 'Nairobi',
      'Roysambu': 'Nairobi',
      'Kasarani': 'Nairobi',
      'Ruaraka': 'Nairobi',
      'Embakasi South': 'Nairobi',
      'Embakasi North': 'Nairobi',
      'Embakasi Central': 'Nairobi',
      'Embakasi East': 'Nairobi',
      'Embakasi West': 'Nairobi',
      'Makadara': 'Nairobi',
      'Kamukunji': 'Nairobi',
      'Starehe': 'Nairobi',
      'Mathare': 'Nairobi',
      'Westlands': 'Nairobi',

      // Kiambu County
      'Kabete': 'Kiambu',
      'Gatundu South': 'Kiambu',
      'Gatundu North': 'Kiambu',
      'Juja': 'Kiambu',
      'Thika Town': 'Kiambu',
      'Ruiru': 'Kiambu',
      'Githunguri': 'Kiambu',
      'Kiambu': 'Kiambu',
      'Kiambaa': 'Kiambu',
      'Kikuyu': 'Kiambu',
      'Limuru': 'Kiambu',
      'Lari': 'Kiambu',

      // Mombasa County
      'Mvita': 'Mombasa',
      'Nyali': 'Mombasa',
      'Changamwe': 'Mombasa',
      'Jomvu': 'Mombasa',
      'Kisauni': 'Mombasa',
      'Likoni': 'Mombasa',

      // Kisumu County
      'Kisumu East': 'Kisumu',
      'Kisumu West': 'Kisumu',
      'Kisumu Central': 'Kisumu',
      'Seme': 'Kisumu',
      'Nyando': 'Kisumu',
      'Muhoroni': 'Kisumu',
      'Nyakach': 'Kisumu',

      // Nakuru County
      'Nakuru Town East': 'Nakuru',
      'Nakuru Town West': 'Nakuru',
      'Naivasha': 'Nakuru',
      'Gilgil': 'Nakuru',
      'Kuresoi South': 'Nakuru',
      'Kuresoi North': 'Nakuru',
      'Molo': 'Nakuru',
      'Njoro': 'Nakuru',
      'Rongai': 'Nakuru',
      'Subukia': 'Nakuru',
      'Bahati': 'Nakuru',

      // Bomet County
      'Bomet East': 'Bomet',
      'Bomet Central': 'Bomet',
      'Chepalungu': 'Bomet',
      'Sotik': 'Bomet',
      'Konoin': 'Bomet'
    };
    return constituencyToCounty[constituency] || null;
  }

  // Update user profile
  app.patch("/api/user/profile", async (req: Request, res: Response) => {
    try {
      const { userId, name, village, ward, constituency } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: "User ID is required",
          message: "Please provide a user ID"
        });
      }

      if (!constituency) {
        return res.status(400).json({
          error: "Constituency is required",
          message: "Please provide your constituency"
        });
      }

      const county = getCountyFromConstituency(constituency);
      if (!county) {
        return res.status(400).json({
          error: "Invalid constituency",
          message: "The provided constituency is not recognized"
        });
      }

      const updateData: Partial<typeof users.$inferInsert> = {
        constituency,
        county,
      };

      if (name) updateData.name = name;
      if (village) updateData.village = village;
      if (ward) updateData.ward = ward;

      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning();

      res.json(updatedUser);
    } catch (error) {
      handleDatabaseError(error, res, "updating profile");
    }
  });

  // Get parliamentary sessions
  app.get("/api/parliamentary-sessions", async (_req: Request, res: Response) => {
    try {
      const sessions = await db.query.parliamentarySessions.findMany({
        with: {
          attendanceRecords: {
            with: {
              official: true,
            },
          },
        },
        orderBy: desc(parliamentarySessions.date),
      });
      res.json(sessions);
    } catch (error) {
      handleDatabaseError(error, res, "fetching parliamentary sessions");
    }
  });

  // Get attendance record for an official
  app.get("/api/officials/:id/attendance", async (req: Request, res: Response) => {
    try {
      const officialId = parseInt(req.params.id);
      const attendanceRecord = await db.query.attendance.findMany({
        where: eq(attendance.officialId, officialId),
        with: {
          session: true,
        },
        orderBy: desc(attendance.createdAt),
      });

      // Calculate attendance statistics
      const totalSessions = attendanceRecord.length;
      const presentCount = attendanceRecord.filter(record => record.status === "present").length;
      const attendanceRate = totalSessions ? (presentCount / totalSessions) * 100 : 0;

      res.json({
        records: attendanceRecord,
        statistics: {
          totalSessions,
          presentCount,
          attendanceRate: Math.round(attendanceRate * 100) / 100,
        },
      });
    } catch (error) {
      handleDatabaseError(error, res, "fetching attendance record");
    }
  });

  // Get bills and voting records for an official
  app.get("/api/officials/:id/voting-record", async (req: Request, res: Response) => {
    try {
      const officialId = parseInt(req.params.id);
      const votingHistory = await db.query.votingRecords.findMany({
        where: eq(votingRecords.officialId, officialId),
        with: {
          bill: true,
        },
        orderBy: desc(votingRecords.votingDate),
      });
      res.json(votingHistory);
    } catch (error) {
      handleDatabaseError(error, res, "fetching voting records");
    }
  });

  // Get development projects
  app.get("/api/development-projects", async (req: Request, res: Response) => {
    try {
      const { constituency, ward, county } = req.query;
      let queryBuilder = db.select().from(developmentProjects);

      if (constituency) {
        queryBuilder = db.select().from(developmentProjects)
          .where(eq(developmentProjects.location, constituency as string));
      } else if (ward) {
        queryBuilder = db.select().from(developmentProjects)
          .where(eq(developmentProjects.location, ward as string));
      } else if (county) {
        queryBuilder = db.select().from(developmentProjects)
          .where(eq(developmentProjects.location, county as string));
      }

      const projects = await queryBuilder.orderBy(desc(developmentProjects.startDate));
      res.json(projects);
    } catch (error) {
      handleDatabaseError(error, res, "fetching development projects");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for data scraping
export async function scrapeIEBCPdf(): Promise<any> {
  return {};
}

export async function scrapeParliamentMPs(): Promise<any> {
  return {};
}

export async function getChatResponse(message: string):Promise<string> {
  return "This is a placeholder response"; 
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
}