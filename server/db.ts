import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

// WebSocket support for serverless environments (Node.js only)
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.node) {
    import("ws").then(ws => {
        neonConfig.webSocketConstructor = ws.default;
    });
}

const databaseUrl = getEnv("DATABASE_URL");

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
