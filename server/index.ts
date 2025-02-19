import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { supabase } from './lib/supabase';

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add Supabase health check route
app.get('/api/health', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    if (error) throw error;
    res.json({ status: 'healthy', database: 'connected', userCount: data.count });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Capture JSON responses for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log API requests on completion
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize server
(async () => {
  // Register API routes
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite or static serving based on environment
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Port finding and server start function
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const killPort = async (port: number) => {
    try {
      const { execSync } = await import('child_process');
      execSync(`lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`);
      await delay(1000); // Wait for port to be released
    } catch (err) {
      // Ignore errors if process not found
    }
  };

  const cleanup = () => {
    process.on('SIGINT', () => {
      log('Shutting down server...');
      server.close(() => {
        log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      log('Shutting down server...');
      server.close(() => {
        log('Server closed');
        process.exit(0);
      });
    });
  };

  const startServer = async (initialPort: number) => {
    let currentPort = initialPort;
    const maxAttempts = 10;
    const portIncrement = 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await new Promise<void>((resolve, reject) => {
          const onError = async (error: Error & { code?: string }) => {
            if (error.code === "EADDRINUSE") {
              log(`Port ${currentPort} is in use, trying ${currentPort + portIncrement}`);
              server.removeListener('error', onError);
              server.removeListener('listening', onListening);
              currentPort += portIncrement;
              resolve();
            } else {
              reject(error);
            }
          };

          const onListening = () => {
            server.removeListener('error', onError);
            log(`Server running at http://localhost:${currentPort}`);
            resolve();
          };

          server.once('error', onError);
          server.once('listening', onListening);
          
          server.listen(currentPort, 'localhost');
        });

        // If we reach here, server started successfully
        cleanup();
        return currentPort;
      } catch (error: any) {
        log(`Attempt ${attempt + 1} failed: ${error.message}`);
        if (attempt === maxAttempts - 1) {
          throw new Error(`Failed to start server after ${maxAttempts} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Could not find an available port');
  };

  // Start the server with a higher port range
  try {
    const port = await startServer(3000);
    log(`Server successfully started on port ${port}`);
  } catch (error: any) {
    log(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();

// Export for testing purposes
export { app };