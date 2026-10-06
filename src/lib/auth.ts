import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },

  rateLimit: {
    enabled: true,
    storage: "database",
  },

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL:
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;