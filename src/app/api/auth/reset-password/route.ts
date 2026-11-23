import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeCode(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getOtpSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.RESEND_API_KEY ||
    "fitpro-otp-fallback-secret"
  );
}

function hashOtp(email: string, code: string): string {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`${email}:${code}`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = normalizeEmail(body?.email);
    const code = normalizeCode(body?.code);
    const newPassword =
      typeof body?.newPassword === "string"
        ? body.newPassword
        : typeof body?.password === "string"
        ? body.password
        : "";

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Adresse e-mail ou code à 6 chiffres invalide." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        resetPasswordToken: true,
        resetPasswordExpires: true,
      },
    });

    if (
      !user ||
      !user.resetPasswordToken ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires.getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: "Code invalide ou expiré. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    const expectedHash = hashOtp(user.email.toLowerCase(), code);
    const actualBuf = Buffer.from(user.resetPasswordToken, "utf8");
    const expectedBuf = Buffer.from(expectedHash, "utf8");

    if (
      actualBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(actualBuf, expectedBuf)
    ) {
      return NextResponse.json(
        { error: "Le code de vérification est incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Votre mot de passe a été mis à jour. Toutes vos données sont conservées.",
    });
  } catch (err) {
    console.error("Erreur /api/auth/reset-password:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
         }
      
