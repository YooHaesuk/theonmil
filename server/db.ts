import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

// Map to cache database instances per connection string
const dbCache = new Map<string, any>();

/**
 * Get the initialized Drizzle database instance using the HTTP driver.
 * @param env Optional environment context (c.env)
 * 
 * We use the neon-http driver for better performance and lower memory 
 * footprint in Cloudflare Edge compared to WebSockets.
 */
export const getDb = (env?: any) => {
    const databaseUrl = getEnv("DATABASE_URL", env);

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is missing! Check your Cloudflare environment variables.");
    }

    if (dbCache.has(databaseUrl)) {
        return dbCache.get(databaseUrl);
    }

    try {
        const sql = neon(databaseUrl);
        const db = drizzle(sql, { schema });
        dbCache.set(databaseUrl, db);
        return db;
    } catch (e: any) {
        console.error("Database initialization failed:", e.message);
        throw e;
    }
};
