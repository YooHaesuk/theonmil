import dotenv from 'dotenv';
// Load environment variables immediately at the top
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getAuth } from "./auth";
import { toNodeHandler } from "better-auth/node";

const app = express();

// 환경 설정
const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
app.set('env', nodeEnv);

console.log('🔧 Environment:', nodeEnv);
console.log('🔧 App Environment:', app.get('env'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Better Auth handler - mounted as a middleware to ensure getAuth() is called 
 * within the request cycle, properly capturing initialized env variables.
 */
app.all("/api/auth/*", (req, res) => {
  return toNodeHandler(getAuth())(req, res);
});

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
    if (nodeEnv !== 'production') {
      console.error(err);
    }
  });

  // ALWAYS setup Vite in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
