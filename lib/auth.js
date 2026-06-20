import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, getDB } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  // ── Database ──────────────────────────────────────────────────────────────
  database: mongodbAdapter(getDB(), {
    client, // enables transactions
  }),

  // ── Secret & base URL ────────────────────────────────────────────────────
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.SERVER_URL || "http://localhost:5000",

  // ── Allowed origins (your Next.js client) ────────────────────────────────
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],

  // ── Email & Password login ───────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  // ── Google OAuth login ────────────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // ── User extra fields — matches your DB schema ───────────────────────────
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user", // "user" | "admin"
        input: false, // prevent user from setting this on signup
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },

  // ── Session / cookie config — HTTPOnly cookie for cross-origin client ────
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none", // needed because client (3000) & server (5000) are different origins
      secure: true,      // requires HTTPS in production; in dev on localhost this still works for sameSite=none in modern browsers
      httpOnly: true,
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // refresh every 1 day
  },
});

// auth.js