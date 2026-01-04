import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

// Cache for Better Auth instances
const authCache = new Map<string, any>();

/**
 * Get the initialized Better Auth instance.
 */
export const getAuth = (env?: any) => {
  const secret = getEnv("BETTER_AUTH_SECRET", env);
  const dbUrl = getEnv("DATABASE_URL", env);

  // Validation for required variables in production
  if (!secret || !dbUrl) {
    const missing = [];
    if (!secret) missing.push("BETTER_AUTH_SECRET");
    if (!dbUrl) missing.push("DATABASE_URL");
    throw new Error(`Missing required auth environment variables: ${missing.join(", ")}`);
  }

  const cacheKey = `${secret}-${dbUrl}`;
  if (authCache.has(cacheKey)) {
    return authCache.get(cacheKey);
  }

  let baseURL = getEnv("BETTER_AUTH_URL", env) || getEnv("URL", env) || "";
  if (baseURL && !baseURL.startsWith('http')) {
    baseURL = `https://${baseURL.replace(/\/$/, '')}`;
  }

  const googleId = getEnv("GOOGLE_CLIENT_ID", env);
  const googleSecret = getEnv("GOOGLE_CLIENT_SECRET", env);

  // Checking for essential social config
  if (!googleId || !googleSecret) {
    console.warn("Google credentials missing from environment.");
  }

  try {
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
          clientId: googleId || "",
          clientSecret: googleSecret || "",
        },
        naver: {
          clientId: getEnv("NAVER_CLIENT_ID", env) || "",
          clientSecret: getEnv("NAVER_CLIENT_SECRET", env) || "",
        },
        kakao: {
          clientId: getEnv("KAKAO_CLIENT_ID", env) || "",
          clientSecret: getEnv("KAKAO_CLIENT_SECRET", env) || "",
        },
      },
      advanced: {
        trustHost: true
      } as any,
    });

    authCache.set(cacheKey, auth);
    return auth;
  } catch (err: any) {
    console.error("Failed to initialize Better Auth:", err.message);
    throw new Error(`Better Auth Initialization Failed: ${err.message}`);
  }
};
