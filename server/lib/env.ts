import { config } from "dotenv";

let globalRuntimeEnv: any = null;

/**
 * Injects Cloudflare runtime environment variables into our utility and process.env.
 */
export function setRuntimeEnv(env: any) {
    globalRuntimeEnv = env;

    if (typeof process === 'undefined') {
        (globalThis as any).process = { env: {} };
    } else if (!process.env) {
        (process as any).env = {};
    }

    if (env && process.env) {
        for (const [key, value] of Object.entries(env)) {
            try {
                if (!process.env[key] || key.startsWith('BETTER_AUTH')) {
                    (process.env as any)[key] = value;
                }
            } catch (e) { }
        }
    }
}

/**
 * Get an environment variable with a layered priority system.
 * Priority: 1. Passed context (current request), 2. globalRuntimeEnv (last request), 3. process.env
 */
export function getEnv(key: string, contextEnv?: any): string | undefined {
    const value = contextEnv?.[key] || globalRuntimeEnv?.[key] || process.env[key];
    return value;
}
