import { NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  AuthMethod,
  DeliveryChannel,
  VerificationPurpose,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function hashCode(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function generateCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = String(body.firstName ?? "").trim();
    const rawIdentifier = String(body.identifier ?? body.email ?? body.phone ?? "").trim();
    const password = String(body.password ?? "");
    const birthDateRaw = body.birthDate;
    const healthAccepted = Boolean(body.healthAccepted);
    const rawMethod = String(body.primaryMethod ?? "").toUpperCase();
    const requestedMethod: AuthMethod | undefined =
      rawMethod === "PHONE"
        ? AuthMethod.PHONE
        : rawMethod === "GMAIL" || rawMethod === "EMAIL"
          ? AuthMethod.GMAIL
          : undefined;

    if (!firstName || !rawIdentifier || !password) {
      return NextResponse.json(
        { error: "Prénom, Gmail ou numéro de téléphone, et mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    if (!healthAccepted) {
      return NextResponse.json(
        { error: "Tu dois confirmer l'avertissement santé et les conditions." },
        { status: 400 }
      );
    }

    const birthDate = birthDateRaw ? new Date(birthDateRaw) : new Date("2000-01-01");
    if (Number.isNaN(birthDate.getTime())) {
      return NextResponse.json({ error: "Date de naissance invalide." }, { status: 400 });
    }

    const isEmail = rawIdentifier.includes("@");
    const primaryMethod: AuthMethod =
      requestedMethod ?? (isEmail ? AuthMethod.GMAIL : AuthMethod.PHONE);

    const email = isEmail ? rawIdentifier.toLowerCase() : null;
    const phone = !isEmail ? rawIdentifier.replace(/\s+/g, "") : null;

    if (primaryMethod === AuthMethod.GMAIL && !email) {
      return NextResponse.json({ error: "Adresse Gmail invalide." }, { status: 400 });
    }

    if (primaryMethod === AuthMethod.PHONE && !phone) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }

    const existingAccount = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
      select: { id: true, isGuest: true },
    });

    if (existingAccount && !existingAccount.isGuest) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet identifiant." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = existingAccount?.isGuest
      ? await prisma.user.update({
          where: { id: existingAccount.id },
          data: {
            firstName,
            email,
            emailVerified: false,
            phone,
            phoneVerified: false,
            passwordHash,
            birthDate,
            healthAccepted: true,
            healthAcceptedAt: new Date(),
            primaryMethod,
            isGuest: false,
          },
        })
      : await prisma.user.create({
          data: {
            firstName,
            email,
            emailVerified: false,
            phone,
            phoneVerified: false,
            passwordHash,
            birthDate,
            healthAccepted: true,
            healthAcceptedAt: new Date(),
            primaryMethod,
            isGuest: false,
          },
        });

    const code = generateCode();
    const target = primaryMethod === AuthMethod.GMAIL ? email! : phone!;
    const channel: DeliveryChannel =
      primaryMethod === AuthMethod.GMAIL ? DeliveryChannel.EMAIL : DeliveryChannel.SMS;

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        target,
        channel,
        purpose: VerificationPurpose.REGISTER_PRIMARY,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json(
      {
        message: "Compte créé. Code de vérification envoyé.",
        userId: user.id,
        primaryMethod,
        ...(process.env.NODE_ENV !== "production" ? { devCode: code } : {}),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du compte." },
      { status: 500 }
    );
  }
          }
