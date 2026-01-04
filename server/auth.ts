import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

// Cache for Better Auth instances to avoid redundant initialization on Edge
const authCache = new Map<string, any>();

/**
 * Get the initialized Better Auth instance.
 * @param env Optional environment context (e.g. Cloudflare c.env)
 * 
 * In Cloudflare Workers, we use a cached approach keyed by environment 
 * to stay within CPU limits while maintaining isolation.
 */
export const getAuth = (env?: any) => {
  const secret = getEnv("BETTER_AUTH_SECRET", env) || "fallback-secret-at-least-thirty-two-chars-long";
  const dbUrl = getEnv("DATABASE_URL", env) || "fallback";
  const cacheKey = `${secret}-${dbUrl}`;

  if (authCache.has(cacheKey)) {
    return authCache.get(cacheKey);
  }

  let baseURL = getEnv("BETTER_AUTH_URL", env) || getEnv("URL", env) || "";

  // Normalize baseURL
  if (baseURL && !baseURL.startsWith('http')) {
    baseURL = `https://${baseURL.replace(/\/$/, '')}`;
  }

  const auth = betterAuth({
    database: drizzleAdapter(getDb(env), {
      provider: "pg",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications
      }
    }),
    secret: secret,
    baseURL: baseURL,
    socialProviders: {
      google: {
        clientId: getEnv("GOOGLE_CLIENT_ID", env),
        clientSecret: getEnv("GOOGLE_CLIENT_SECRET", env),
      },
      naver: {
        clientId: getEnv("NAVER_CLIENT_ID", env),
        clientSecret: getEnv("NAVER_CLIENT_SECRET", env),
      },
      kakao: {
        clientId: getEnv("KAKAO_CLIENT_ID", env),
        clientSecret: getEnv("KAKAO_CLIENT_SECRET", env),
      },
    },
    advanced: {
      trustHost: true
    } as any,
    onUserCreated: async (user) => {
      console.log("New user created via social:", user.email);
    }
  });

  authCache.set(cacheKey, auth);
  return auth;
};
