import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/modules/auth/password";
import type { Role } from "@/modules/auth/roles";
import { loginSchema } from "@/server/validators/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: env.AUTH_TRUST_HOST === "true",
  secret: env.AUTH_SECRET ?? process.env.AUTH_SECRET,
  useSecureCookies: env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: env.SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: {
            roles: {
              where: {
                revokedAt: null,
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
              },
              include: { role: true },
            },
          },
        });

        if (!user || !user.isActive || user.isSuspended || !user.passwordHash) {
          return null;
        }

        const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          roles: user.roles.map((entry) => entry.role.name as Role),
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
      }
      if ("roles" in (user ?? {}) && Array.isArray(user.roles)) {
        token.roles = user.roles;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : (token.sub ?? "");
        session.user.roles = Array.isArray(token.roles) ? (token.roles as Role[]) : [];
      }
      return session;
    },
  },
});
