/**
 * Environment access utility.
 * In Cloudflare, environment variables are per-request context (c.env).
 * We avoid modifying global process.env to prevent "read-only" crashes on Edge.
 */

let _globalEnv: any = null;

export function setRuntimeEnv(env: any) {
    _globalEnv = env;
}

/**
 * Get environment variable with fallback.
 * Priority: 1. Passed context, 2. Global runtime context, 3. process.env
 */
export function getEnv(key: string, contextEnv?: any): string | undefined {
    // Check if we have c.env (Cloudflare)
    if (contextEnv && typeof contextEnv === 'object' && key in contextEnv) {
        return contextEnv[key];
    }

    // Check global runtime cache
    if (_globalEnv && typeof _globalEnv === 'object' && key in _globalEnv) {
        return _globalEnv[key];
    }

    // Fallback to process.env (Node.js)
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }

    return undefined;
}

/**
 * Diagnostic helper to list available environment keys (without leaking values).
 */
export function getAvailableKeys(contextEnv?: any): string[] {
    const keys = new Set<string>();

    if (contextEnv) Object.keys(contextEnv).forEach(k => keys.add(k));
    if (_globalEnv) Object.keys(_globalEnv).forEach(k => keys.add(k));
    if (typeof process !== 'undefined' && process.env) Object.keys(process.env).forEach(k => keys.add(k));

    return Array.from(keys);
}
