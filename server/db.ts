import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

/**
 * Configure Neon for the specific runtime environment.
 * On Cloudflare Workers, we use the native WebSocket global.
 * On Node.js, we would normally use 'ws', but we avoid top-level dynamic imports 
 * to prevent module evaluation crashes on Edge.
 */
function configureNeonRuntime() {
    if (typeof WebSocket !== 'undefined') {
        neonConfig.webSocketConstructor = WebSocket;
    }
}

let _db: any = null;
let _pool: Pool | null = null;

/**
 * Get the initialized Drizzle database instance.
 * Initializes the connection on the first call.
 * 
 * Supports an optional context environment for scoped initialization.
 */
export const getDb = (contextEnv?: any) => {
    if (!_db) {
        configureNeonRuntime();
        const databaseUrl = getEnv("DATABASE_URL", contextEnv);

        if (!databaseUrl) {
            const errorMsg = "DATABASE_URL is missing! Please check environment variables.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        try {
            _pool = new Pool({ connectionString: databaseUrl });
            _db = drizzle(_pool, { schema });
        } catch (e: any) {
            console.error("Failed to initialize database connection:", e.message);
            throw e;
        }
    }
    return _db;
};
