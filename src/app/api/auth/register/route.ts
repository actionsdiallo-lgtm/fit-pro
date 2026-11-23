import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateSixDigitCode,
  hashSecret,
  isEmailInput,
  normalizeEmail,
  normalizePhone,
  registerSchema,
} from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides." },
        { status: 400 }
      );
    }

    const { firstName, identifier, password, birthDate, healthAccepted, primaryMethod } =
      parsed.data;

    const emailMode = isEmailInput(identifier);
    const normalizedTarget = emailMode ? normalizeEmail(identifier) : normalizePhone(identifier);
    const resolvedMethod = primaryMethod ?? (emailMode ? "EMAIL" : "PHONE");

    const existingUser = await prisma.user.findFirst({
      where: emailMode ? { email: normalizedTarget } : { phone: normalizedTarget },
    });

    if (existingUser && !existingUser.isGuest) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet identifiant." },
        { status: 409 }
      );
    }

    const passwordHash = hashSecret(password);

    const user = existingUser?.isGuest
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            firstName,
            email: emailMode ? normalizedTarget : null,
            phone: emailMode ? null : normalizedTarget,
            password: passwordHash,
            birthDate: new Date(birthDate),
            healthAcceptedAt: healthAccepted ? new Date() : null,
            primaryMethod: resolvedMethod,
            isGuest: false,
          },
        })
      : await prisma.user.create({
          data: {
            firstName,
            email: emailMode ? normalizedTarget : null,
            phone: emailMode ? null : normalizedTarget,
            password: passwordHash,
            birthDate: new Date(birthDate),
            healthAcceptedAt: healthAccepted ? new Date() : null,
            primaryMethod: resolvedMethod,
          },
        });

    const rawCode = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        target: normalizedTarget,
        channel: emailMode ? "EMAIL" : "PHONE",
        purpose: "REGISTER",
        codeHash: hashSecret(rawCode),
        expiresAt,
      },
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV OTP REGISTER -> ${normalizedTarget}]: ${rawCode}`);
    }

    return NextResponse.json({
      ok: true,
      target: normalizedTarget,
      channel: emailMode ? "EMAIL" : "PHONE",
      primaryMethod: resolvedMethod,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du compte." },
      { status: 500 }
    );
  }
            }

