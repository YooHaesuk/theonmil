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
 */
export const getDb = () => {
    if (!_db) {
        const databaseUrl = getEnv("DATABASE_URL");
        if (!databaseUrl) {
            console.error("DATABASE_URL is missing in runtime environment!");
            throw new Error("DATABASE_URL is required but was not found.");
        }
        _pool = new Pool({ connectionString: databaseUrl });
        _db = drizzle(_pool, { schema });
    }
    return _db;
};
