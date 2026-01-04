/**
 * Environment variable utility for cross-platform compatibility (Node.js & Cloudflare Workers/Pages)
 */

export const getEnv = (key: string): string => {
    // Try process.env (Node.js)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key] as string;
    }

    // Try global context (Cloudflare Pages/Workers)
    // @ts-ignore
    if (typeof globalThis !== 'undefined' && globalThis[key]) {
        // @ts-ignore
        return globalThis[key] as string;
    }

    // Fallback to empty string
    return "";
};
