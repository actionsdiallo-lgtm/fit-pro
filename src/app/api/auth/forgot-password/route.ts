import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateSixDigitCode,
  hashSecret,
  isEmailInput,
  normalizeEmail,
  normalizePhone,
} from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawIdentifier = String(body?.identifier ?? body?.email ?? "").trim();

    if (!rawIdentifier) {
      return NextResponse.json({
        ok: true,
        message: "Si ce compte existe, tu vas recevoir un code.",
      });
    }

    const emailMode = isEmailInput(rawIdentifier);
    const target = emailMode ? normalizeEmail(rawIdentifier) : normalizePhone(rawIdentifier);

    const user = await prisma.user.findFirst({
      where: emailMode
        ? { OR: [{ email: target }, { backupEmail: target }] }
        : { OR: [{ phone: target }, { backupPhone: target }] },
      select: { id: true },
    });

    if (user) {
      const code = generateSixDigitCode();
      await prisma.verificationCode.create({
        data: {
          userId: user.id,
          target,
          channel: emailMode ? "EMAIL" : "PHONE",
          purpose: "PASSWORD_RESET",
          codeHash: hashSecret(code),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEV RESET CODE -> ${target}]: ${code}`);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Si ce compte existe, tu vas recevoir un code.",
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du code." },
      { status: 500 }
    );
  }
          }
      
