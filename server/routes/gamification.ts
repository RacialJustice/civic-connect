import { eq } from "drizzle-orm";
import { storage } from "../storage";
import { points, badges, userBadges } from "@shared/schema";
import { Router } from "express";

const router = Router();

// Get user points
router.get("/points/:userId", async (req, res) => {
  const userPoints = await storage.getPoints(req.params.userId);
  res.json(userPoints);
});

// Get user badges with badge details
router.get("/badges/:userId", async (req, res) => {
  const userBadgesWithDetails = await storage.getBadgesForUser(req.params.userId);
  res.json(userBadgesWithDetails);
});

// Award points to user
router.post("/points", async (req, res) => {
  const { userId, amount, reason, category } = req.body;
  const newPoints = await storage.awardPoints({
    userId,
    amount,
    reason,
    category,
  });
  res.json(newPoints);
});

// Award badge to user
router.post("/badges", async (req, res) => {
  const { userId, badgeId } = req.body;
  const newUserBadge = await storage.awardBadge({
    userId,
    badgeId,
  });
  res.json(newUserBadge);
});

export default router;