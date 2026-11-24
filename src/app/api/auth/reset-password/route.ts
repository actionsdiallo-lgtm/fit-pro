import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, VerificationPurpose } from "@prisma/client";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawIdentifier = String(
      body.identifier ?? body.email ?? body.phone ?? body.target ?? ""
    ).trim();
    const code = String(body.code ?? body.resetCode ?? "").trim();
    const newPassword = String(
      body.newPassword ?? body.password ?? ""
    );

    if (!rawIdentifier || !code || !newPassword) {
      return NextResponse.json(
        { error: "Identifiant, code à 6 chiffres et nouveau mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const isEmail = rawIdentifier.includes("@");
    const normalizedTarget = isEmail
      ? rawIdentifier.toLowerCase()
      : rawIdentifier.replace(/\s+/g, "");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: normalizedTarget }
        : { phone: normalizedTarget },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Code invalide ou expiré." },
        { status: 400 }
      );
    }

    const now = new Date();
    const record = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        target: normalizedTarget,
        purpose: VerificationPurpose.PASSWORD_RESET,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Code invalide ou expiré." },
        { status: 400 }
      );
    }

    if (record.lockedUntil && record.lockedUntil > now) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie dans quelques minutes." },
        { status: 429 }
      );
    }

    const maxAttempts = record.maxAttempts ?? 5;
    if (record.attempts >= maxAttempts) {
      await prisma.verificationCode.update({
        where: { id: record.id },
        data: { lockedUntil: new Date(Date.now() + 10 * 60 * 1000) },
      });
      return NextResponse.json(
        { error: "Nombre maximal de tentatives atteint." },
        { status: 429 }
      );
    }

    const expectedHash = hashValue(code);
    if (record.codeHash !== expectedHash) {
      const nextAttempts = record.attempts + 1;
      await prisma.verificationCode.update({
        where: { id: record.id },
        data: {
          attempts: nextAttempts,
          ...(nextAttempts >= maxAttempts
            ? { lockedUntil: new Date(Date.now() + 10 * 60 * 1000) }
            : {}),
        },
      });
      return NextResponse.json(
        { error: "Code de vérification incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.verificationCode.update({
        where: { id: record.id },
        data: { consumedAt: now },
      }),
    ]);

    return NextResponse.json({
      message: "Mot de passe mis à jour avec succès.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
  }
      
