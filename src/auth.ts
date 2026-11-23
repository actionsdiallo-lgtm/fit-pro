import crypto from "crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

function verifyPasswordHash(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // Format scrypt "salt:derivedKey"
  if (storedHash.includes(":")) {
    try {
      const [salt, keyHex] = storedHash.split(":");
      if (!salt || !keyHex) return false;
      const keyBuf = Buffer.from(keyHex, "hex");
      const derivedBuf = crypto.scryptSync(password, salt, 64);
      if (keyBuf.length === 0 || keyBuf.length !== derivedBuf.length) {
        return false;
      }
      return crypto.timingSafeEqual(keyBuf, derivedBuf);
    } catch {
      return false;
    }
  }

  return false;
}

const providers = [
  Credentials({
    name: "Email and password",
    credentials: {
      email: {},
      password: { type: "password" },
    },
    async authorize(input) {
      const parsed = credentialsSchema.safeParse(input);
      if (!parsed.success) return null;

      const email = parsed.data.email.toLowerCase();
      const password = parsed.data.password;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user?.passwordHash) return null;

      const isScryptValid = verifyPasswordHash(password, user.passwordHash);
      const isBcryptValid =
        !isScryptValid && !user.passwordHash.includes(":")
          ? await compare(password, user.passwordHash).catch(() => false)
          : false;

      if (!isScryptValid && !isBcryptValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: null,
      };
    },
  }),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : []),
  ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
    ? [
        Facebook({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
        
