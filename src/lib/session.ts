
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get("fitpro_session")?.value;

  if (!token) {
    return null;
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date()
  ) {
    return null;
  }

  return session.user;
}
