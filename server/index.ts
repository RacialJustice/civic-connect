import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load environment variables from client/.env.local
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../client/.env.local') });

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

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

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Function to start the server with port finding
  const startServer = async (initialPort: number) => {
    let currentPort = initialPort;
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await new Promise<void>((resolve, reject) => {
          const onError = (error: Error) => {
            if (error["code"] === "EADDRINUSE") {
              log(`Port ${currentPort} is in use, trying next port`);
              currentPort++;
              server.removeListener('error', onError);
              resolve();
            } else {
              reject(error);
            }
          };

          server.once('error', onError);
          server.listen(currentPort, "0.0.0.0", () => {
            log(`Server running on port ${currentPort} (http://0.0.0.0:${currentPort})`);
            resolve();
          });
        });

        // If we get here, the server started successfully
        break;
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          log(`Failed to find an available port after ${maxAttempts} attempts`);
          throw error;
        }
      }
    }
  };

  // Start the server with initial port 5000
  try {
    await startServer(5000);
  } catch (error) {
    log(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();