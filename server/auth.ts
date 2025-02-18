import { supabase } from '../client/src/lib/supabase';
import type { Express } from "express";
import session from "express-session";
import passport from "passport";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { type SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const SessionStore = MemoryStore(session);

export function setupAuth(app: Express) {
  app.use(session({
    store: new SessionStore({
      checkPeriod: 86400000, // prune expired entries every 24h
      ttl: 24 * 60 * 60 // TTL in seconds
    }),
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.post("/api/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: userData, error: dbError } = await supabase
        .from('users')
        .insert([{ ...req.body, id: authData.user?.id }])
        .select()
        .single();

      if (dbError) throw dbError;

      res.status(201).json(userData);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Registration failed' });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      req.session.userId = data.user.id;
      res.json(data.user);
    } catch (err) {
      res.status(401).json({ error: err instanceof Error ? err.message : 'Login failed' });
    }
  });

  app.post("/api/logout", async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      req.session.destroy(() => {
        res.sendStatus(200);
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Logout failed' });
    }
  });

  app.get("/api/user", async (req, res) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return res.sendStatus(401);
      }

      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError) throw dbError;
      res.json(userData);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to fetch user' });
    }
  });
}