import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

let _auth: any = null;

/**
 * Get the initialized Better Auth instance.
 * Initializes with current environment variables on the first call.
 */
export const getAuth = () => {
  if (!_auth) {
    const baseURL = getEnv("BETTER_AUTH_URL") || getEnv("URL") || "";
    const secret = getEnv("BETTER_AUTH_SECRET") || "fallback-secret-at-least-thirty-two-chars-long";

    _auth = betterAuth({
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
          clientId: getEnv("GOOGLE_CLIENT_ID"),
          clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
        },
        naver: {
          clientId: getEnv("NAVER_CLIENT_ID"),
          clientSecret: getEnv("NAVER_CLIENT_SECRET"),
        },
        kakao: {
          clientId: getEnv("KAKAO_CLIENT_ID"),
          clientSecret: getEnv("KAKAO_CLIENT_SECRET"),
        },
      },
      onUserCreated: async (user) => {
        console.log("New user created via social:", user.email);
      }
    });
  }
  return _auth;
};
