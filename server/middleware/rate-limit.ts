
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 failed login attempts per hour
  message: { error: 'Too many login attempts. Please try again later.' }
});

export const forumLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20 // limit posts/comments creation
});

export const donationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50 // limit donation attempts
});
