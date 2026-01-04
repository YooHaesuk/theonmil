import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// WebSocket support for serverless environments (Node.js only)
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.node) {
    import("ws").then(ws => {
        neonConfig.webSocketConstructor = ws.default;
    });
}

// Initial database connection
const getDatabaseUrl = () => {
    if (typeof process !== 'undefined' && process.env?.DATABASE_URL) return process.env.DATABASE_URL;
    // @ts-ignore - Cloudflare global
    if (typeof DATABASE_URL !== 'undefined') return DATABASE_URL;
    return "";
};

const databaseUrl = getDatabaseUrl();

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
