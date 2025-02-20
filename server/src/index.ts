import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from "http";
import cors from 'cors';
import { log } from './utils/logger.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mock data
const leaders = [
  { id: 1, name: 'John Doe', role: 'County Governor', constituency: 'Kabete' },
  { id: 2, name: 'Jane Smith', role: 'MP', constituency: 'Kabete' },
];

const events = [
  { id: 1, title: 'Town Hall Meeting', date: '2024-02-01', constituency: 'Kabete' },
  { id: 2, title: 'Community Clean-up', date: '2024-02-15', constituency: 'Kabete' },
];

// Add emergency services mock data
const emergencyServices = [
  {
    id: 1,
    name: "Emergency Police Hotline",
    phone: "999",
    type: "police",
    available24h: true,
    location: "Nationwide"
  },
  {
    id: 2,
    name: "Fire and Rescue Services",
    phone: "020-2344599",
    type: "fire",
    available24h: true,
    location: "Nairobi"
  },
  {
    id: 3,
    name: "Medical Emergency Response",
    phone: "0800-723355",
    type: "medical",
    available24h: true,
    location: "Nationwide"
  }
];

// Basic health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

// Routes
app.get('/api/leaders', (req, res) => {
  res.json(leaders);
});

app.get('/api/events', (req, res) => {
  const { constituency } = req.query;
  const filteredEvents = constituency 
    ? events.filter(event => event.constituency === constituency)
    : events;
  res.json(filteredEvents);
});

// Add new endpoint
app.get('/api/emergency-services', (_req, res) => {
  res.json(emergencyServices);
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`);
});

export { app };