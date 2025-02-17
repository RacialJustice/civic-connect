import express, { type Request, Response, NextFunction } from "express";
<<<<<<< HEAD
import { registerRoutes } from "./routes";
=======
import { registerRoutes, PORT } from "./routes";
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

<<<<<<< HEAD
=======
// Add request logging middleware
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
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
<<<<<<< HEAD
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

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
=======
  try {
    const server = registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error: ${message}`);
      res.status(status).json({ message });
    });

    // Always set up Vite in development mode for Replit
    await setupVite(app, server);

    // Try alternative ports if the default port is in use
    const startServer = (port: number) => {
      server.listen(port, "0.0.0.0", () => {
        log(`Server running on port ${port}`);
      }).on('error', (err: any) => {
        if (err.code === 'EADDRINUSE' && port < PORT + 10) {
          log(`Port ${port} is in use, trying ${port + 1}`);
          startServer(port + 1);
        } else {
          log(`Failed to start server: ${err.message}`);
          process.exit(1);
        }
      });
    };

    startServer(PORT);
  } catch (error) {
    log(`Failed to start application: ${error}`);
    process.exit(1);
  }
})();
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
