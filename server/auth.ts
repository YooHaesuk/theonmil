import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "@shared/schema";
import { getEnv } from "./lib/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema
    }
  }),
  secret: getEnv("BETTER_AUTH_SECRET"),
  baseURL: getEnv("BETTER_AUTH_URL"),
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
    console.log("New user created:", user.email);
  }
});
