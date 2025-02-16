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
}