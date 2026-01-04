import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

/**
 * Configure Neon for the specific runtime environment.
 */
function configureNeonRuntime() {
    if (typeof WebSocket !== 'undefined') {
        neonConfig.webSocketConstructor = WebSocket;
    }
}

// Map to cache database instances per connection string
const dbCache = new Map<string, any>();

/**
 * Get the initialized Drizzle database instance.
 * @param env Optional environment context (c.env)
 * 
 * We cache the instance based on the DATABASE_URL to avoid re-opening pools 
 * unnecessarily while ensuring the correct context is used.
 */
export const getDb = (env?: any) => {
    configureNeonRuntime();
    const databaseUrl = getEnv("DATABASE_URL", env);

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is missing! Check your Cloudflare environment variables.");
    }

    if (dbCache.has(databaseUrl)) {
        return dbCache.get(databaseUrl);
    }

    try {
        const pool = new Pool({ connectionString: databaseUrl });
        const db = drizzle(pool, { schema });
        dbCache.set(databaseUrl, db);
        return db;
    } catch (e: any) {
        console.error("Database Pool creation failed:", e.message);
        throw e;
    }
};
