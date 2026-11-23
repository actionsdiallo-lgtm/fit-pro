import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AUTH_ERRORS,
  isEmailInput,
  normalizeEmail,
  normalizePhone,
  verifyCodeSchema,
  verifySecret,
} from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyCodeSchema.safeParse({
      ...body,
      purpose: body?.purpose ?? "PASSWORD_RESET",
    });

    if (!parsed.success) {
      return NextResponse.json({ error: AUTH_ERRORS.INVALID_CODE }, { status: 400 });
    }

    const { target, code, purpose } = parsed.data;
    const emailMode = isEmailInput(target);
    const normalizedTarget = emailMode ? normalizeEmail(target) : normalizePhone(target);

    const record = await prisma.verificationCode.findFirst({
      where: {
        target: normalizedTarget,
        purpose,
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

    return NextResponse.json({
      ok: true,
      target: normalizedTarget,
    });
  } catch {
    return NextResponse.json({ error: AUTH_ERRORS.INVALID_CODE }, { status: 500 });
  }
}
