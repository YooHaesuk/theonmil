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

  if (!secret) throw new Error("BETTER_AUTH_SECRET is missing!");
  if (!dbUrl) throw new Error("DATABASE_URL is missing!");

  // Cache key includes DB URL and Secret to handle potential rotation
  const cacheKey = `${secret}-${dbUrl}`;
  if (authCache.has(cacheKey)) {
    return authCache.get(cacheKey);
  }

  let baseURL = getEnv("BETTER_AUTH_URL", env) || getEnv("URL", env) || "";
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
        clientId: getEnv("GOOGLE_CLIENT_ID", env) || "",
        clientSecret: getEnv("GOOGLE_CLIENT_SECRET", env) || "",
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
    user: {
      additionalFields: {
        role: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        detailAddress: { type: "string" },
        zipCode: { type: "string" },
        banned: { type: "boolean" },
        bannedReason: { type: "string" },
      }
    },
    advanced: {
      trustHost: true
    } as any,
  });

  authCache.set(cacheKey, auth);
  return auth;
};
