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

let _db: any = null;
let _pool: Pool | null = null;

/**
 * Get the initialized Drizzle database instance.
 * Initializes the connection on the first call.
 * 
 * Per Gemini 1.5 Pro advice: We ensure environment variables are captured 
 * at the moment of initialization within the request context.
 */
export const getDb = (contextEnv?: any) => {
    if (!_db) {
        const databaseUrl = getEnv("DATABASE_URL", contextEnv);

        if (!databaseUrl) {
            const errorMsg = "DATABASE_URL is missing! Please check Cloudflare environment variables.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        try {
            _pool = new Pool({ connectionString: databaseUrl });
            _db = drizzle(_pool, { schema });
            console.log("Database connection initialized successfully.");
        } catch (e: any) {
            console.error("Failed to initialize database connection:", e.message);
            throw e;
        }
    }
    return _db;
};
