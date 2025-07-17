import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// 환경변수 로드
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// 개발 환경 강제 설정 (Windows 환경변수 문제 해결)
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
// 공백 제거
process.env.NODE_ENV = process.env.NODE_ENV.trim();
app.set('env', process.env.NODE_ENV);

console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔧 App Environment:', app.get('env'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 세션 설정
app.use(session({
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
}));

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

  // Vite 설정을 건너뛰고 정적 파일 서빙만 사용
  console.log('🔧 Setting up static file serving...');
  try {
    serveStatic(app);
  } catch (error) {
    console.log('⚠️ Static serving failed, continuing without it...');
    // 정적 파일 서빙 실패해도 계속 진행
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
