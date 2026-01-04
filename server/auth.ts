import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

/**
 * Get the initialized Better Auth instance.
 * @param env Optional environment context (e.g. Cloudflare c.env)
 * 
 * IMPORTANT: In Cloudflare Workers, we instantiate per request to ensure 
 * correct environment context isolation.
 */
export const getAuth = (env?: any) => {
  let baseURL = getEnv("BETTER_AUTH_URL", env) || getEnv("URL", env) || "";

  // Normalize baseURL
  if (baseURL && !baseURL.startsWith('http')) {
    baseURL = `https://${baseURL.replace(/\/$/, '')}`;
  }

  const secret = getEnv("BETTER_AUTH_SECRET", env) || "fallback-secret-at-least-thirty-two-chars-long";

  return betterAuth({
    database: drizzleAdapter(getDb(), {
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
        // Explicitly set scope to avoid requesting unauthorized profile_image/nickname
        scope: ["account_email"]
      },
    },
    advanced: {
      trustHost: true
    } as any,
    onUserCreated: async (user) => {
      console.log("New user created via social:", user.email);
    }
  });
};
