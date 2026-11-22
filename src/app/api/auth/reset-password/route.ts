import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeOtpCode(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "").trim() : "";
}

function hashOtp(email: string, code: string): string {
  return crypto
    .createHash("sha256")
    .update(`${email}:${code}`)
    .digest("hex");
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = normalizeEmail(body?.email);
    const code = normalizeOtpCode(body?.code ?? body?.otp ?? body?.token);
    const newPassword =
      typeof body?.newPassword === "string"
        ? body.newPassword
        : typeof body?.password === "string"
          ? body.password
          : "";

    if (!email) {
      return NextResponse.json(
        { error: "Veuillez saisir votre adresse e-mail." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Veuillez saisir le code de vérification à 6 chiffres." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit contenir au moins 6 caractères." },
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

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return NextResponse.json(
        { error: "Code de vérification invalide ou expiré." },
        { status: 400 }
      );
    }

    if (new Date(user.resetPasswordExpires).getTime() < Date.now()) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      return NextResponse.json(
        { error: "Ce code à 6 chiffres a expiré. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    const expectedHash = hashOtp(user.email.toLowerCase(), code);
    const storedBuf = Buffer.from(user.resetPasswordToken, "utf8");
    const expectedBuf = Buffer.from(expectedHash, "utf8");

    const isValidCode =
      storedBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(storedBuf, expectedBuf);

    if (!isValidCode) {
      return NextResponse.json(
        { error: "Le code à 6 chiffres est incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(newPassword);

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
        "Votre mot de passe a bien été mis à jour. Toutes vos données sont conservées.",
    });
  } catch (err) {
    console.error("Erreur /api/auth/reset-password:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
          }
