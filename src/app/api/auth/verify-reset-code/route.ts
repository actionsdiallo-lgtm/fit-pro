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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = normalizeEmail(body?.email);
    const code = normalizeOtpCode(body?.code ?? body?.otp ?? body?.token);

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

    return NextResponse.json({
      ok: true,
      verified: true,
      message:
        "Code vérifié. Vous pouvez maintenant définir votre nouveau mot de passe.",
    });
  } catch (err) {
    console.error("Erreur /api/auth/verify-reset-code:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la vérification du code." },
      { status: 500 }
    );
  }
}
  
