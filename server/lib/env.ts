import { config } from "dotenv";

let runtimeEnv: any = null;

/**
 * Injects Cloudflare runtime environment variables into our utility and process.env.
 * This is critical for Edge compatibility with libraries that expect process.env.
 */
export function setRuntimeEnv(env: any) {
    runtimeEnv = env;

    // Ensure process.env global exists in Edge runtime
    if (typeof process === 'undefined') {
        (globalThis as any).process = { env: {} };
    } else if (!process.env) {
        (process as any).env = {};
    }

    // Synchronize runtime variables into process.env defensively
    if (env && process.env) {
        for (const [key, value] of Object.entries(env)) {
            try {
                // Only set if not already set or if it's a critical auth var
                if (!process.env[key] || key.startsWith('BETTER_AUTH') || key.includes('CLIENT_')) {
                    (process.env as any)[key] = value;
                }
            } catch (e) {
                // Silently fail for read-only environment variables in some runtimes
            }
        }
    }
}

/**
 * Get an environment variable from either Cloudflare runtime context or process.env.
 */
export function getEnv(key: string): string | undefined {
    // Priority: 1. Runtime Env (Cloudflare), 2. process.env (Node/Polyfill)
    const value = runtimeEnv?.[key] || process.env[key];
    return value;
}
