import crypto from "crypto";
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

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Adresse e-mail ou code à 6 chiffres invalide." },
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

    return NextResponse.json({
      ok: true,
      verified: true,
      message: "Code vérifié. Vous pouvez maintenant définir votre nouveau mot de passe.",
    });
  } catch (err) {
    console.error("Erreur /api/auth/verify-reset-code:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la vérification du code." },
      { status: 500 }
    );
  }
}
