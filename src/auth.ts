import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email ou Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const rawIdentifier = String(credentials?.identifier ?? "").trim();
        const password = String(credentials?.password ?? "");

        if (!rawIdentifier || !password) {
          return null;
        }

        const isEmail = rawIdentifier.includes("@");
        const user = isEmail
          ? await prisma.user.findUnique({
              where: { email: rawIdentifier.toLowerCase() },
            })
          : await prisma.user.findUnique({
              where: { phone: rawIdentifier.replace(/\s+/g, "") },
            });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName,
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.name = token.name ? String(token.name) : null;
      }
      return session;
    },
  },
});
                                 
