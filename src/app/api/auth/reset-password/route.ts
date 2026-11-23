import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeCode(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "").trim() : "";
}

function hashToken(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length === 0 || bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);
    const code = normalizeCode(body?.code ?? body?.otp ?? body?.token);
    const newPassword =
      typeof body?.newPassword === "string"
        ? body.newPassword
        : typeof body?.password === "string"
        ? body.password
        : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    if (code.length !== 6) {
      return NextResponse.json(
        { error: "Le code de vérification est incorrect." },
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
        resetPasswordToken: true,
        resetPasswordExpires: true,
      },
    });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return NextResponse.json(
        { error: "Le code de vérification est incorrect." },
        { status: 400 }
      );
    }

    if (new Date(user.resetPasswordExpires).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Ce code a expiré. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    const providedHash = hashToken(code);
    if (!safeEqualHex(providedHash, user.resetPasswordToken)) {
      return NextResponse.json(
        { error: "Le code de vérification est incorrect." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès.",
    });
  } catch (error) {
    console.error("Reset password route error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
}
