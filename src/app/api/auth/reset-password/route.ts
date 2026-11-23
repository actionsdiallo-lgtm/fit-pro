import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AUTH_ERRORS,
  hashSecret,
  isEmailInput,
  normalizeEmail,
  normalizePhone,
  resetPasswordSchema,
  verifySecret,
} from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides." },
        { status: 400 }
      );
    }

    const { target, code, newPassword, confirmPassword } = parsed.data;

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Les nouveaux mots de passe ne correspondent pas." },
        { status: 400 }
      );
    }

    const emailMode = isEmailInput(target);
    const normalizedTarget = emailMode ? normalizeEmail(target) : normalizePhone(target);

    const record = await prisma.verificationCode.findFirst({
      where: {
        target: normalizedTarget,
        purpose: "PASSWORD_RESET",
        consumedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: AUTH_ERRORS.INVALID_CODE }, { status: 400 });
    }

    if (record.attempts >= 5) {
      return NextResponse.json({ error: AUTH_ERRORS.TOO_MANY_ATTEMPTS }, { status: 429 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: AUTH_ERRORS.EXPIRED_CODE }, { status: 400 });
    }

    const validCode = verifySecret(code, record.codeHash);
    if (!validCode) {
      const nextAttempts = record.attempts + 1;
      await prisma.verificationCode.update({
        where: { id: record.id },
        data: { attempts: nextAttempts },
      });

      return NextResponse.json(
        {
          error:
            nextAttempts >= 5
              ? AUTH_ERRORS.TOO_MANY_ATTEMPTS
              : AUTH_ERRORS.INVALID_CODE,
        },
        { status: nextAttempts >= 5 ? 429 : 400 }
      );
    }

    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });

    if (record.userId) {
      await prisma.user.update({
        where: { id: record.userId },
        data: {
          password: hashSecret(newPassword),
          tokenVersion: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Mot de passe changé avec succès. Tu peux te connecter.",
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
}
