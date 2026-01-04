import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

let _auth: any = null;

export const auth = new Proxy({} as any, {
  get(target, prop) {
    if (!_auth) {
      const baseURL = getEnv("BETTER_AUTH_URL") || getEnv("URL") || "";
      const secret = getEnv("BETTER_AUTH_SECRET") || "fallback-secret-at-least-thirty-two-chars-long";

      _auth = betterAuth({
        database: drizzleAdapter(db, {
          provider: "pg",
          schema: {
            ...schema
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

    const value = _auth[prop];
    if (typeof value === 'function') {
      return value.bind(_auth);
    }
    return value;
  }
});
