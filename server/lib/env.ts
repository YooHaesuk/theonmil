/**
 * Environment variable utility for cross-platform compatibility (Node.js & Cloudflare Workers/Pages)
 */

let runtimeEnv: any = null;

// Ensure process.env is polyfilled globally for libraries that expect it
if (typeof process === 'undefined') {
    (globalThis as any).process = { env: {} };
}

export const setRuntimeEnv = (env: any) => {
    runtimeEnv = env;

    // Sync with process.env polyfill
    if (typeof process !== 'undefined' && process.env) {
        Object.assign(process.env, env);
    }
};

export const getEnv = (key: string): string => {
    // Try provided runtime env (Cloudflare Pages c.env)
    if (runtimeEnv && runtimeEnv[key]) {
        return runtimeEnv[key];
    }

    // Try process.env (Node.js or polyfilled)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key] as string;
    }

    // Try global context (Cloudflare Pages/Workers)
    // @ts-ignore
    if (typeof globalThis !== 'undefined' && (globalThis as any)[key]) {
        // @ts-ignore
        return (globalThis as any)[key] as string;
    }

    // Fallback to empty string
    return "";
};
