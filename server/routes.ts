import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertFeedbackSchema, type InsertFeedback } from "@shared/schema";

// Maintain a list of connected clients
const clients = new Map<WebSocket, { userId: number, username: string }>();

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/leaders", async (_req, res) => {
    const leaders = await storage.getLeaders();
    res.json(leaders);
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

    const { ward, constituency } = req.body;
    const user = await storage.updateUserLocation(req.user!.id, {
      ward,
      constituency,
      // We'll add county based on constituency later
      county: "Nairobi" // Default for now
    });

    res.json(user);
  });

  const httpServer = createServer(app);

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    // Authentication check using the session
    if (!req.session?.passport?.user) {
      ws.close(1008, 'Authentication required');
      return;
    }

    const userId = req.session.passport.user;

    // Get user details from storage
    storage.getUser(userId).then(user => {
      if (!user) {
        ws.close(1008, 'User not found');
        return;
      }

      // Store client information
      clients.set(ws, { userId: user.id, username: user.displayName });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'system',
        content: `Welcome ${user.displayName}!`,
        timestamp: new Date().toISOString()
      }));

      // Broadcast user joined message
      const joinMessage = JSON.stringify({
        type: 'system',
        content: `${user.displayName} joined the chat`,
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
}