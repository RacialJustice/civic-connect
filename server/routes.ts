import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
