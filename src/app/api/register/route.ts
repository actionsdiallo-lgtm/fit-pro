import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, AuthMethod, DeliveryChannel, VerificationPurpose } from "@prisma/client";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function generateSixDigitCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = String(body.firstName ?? body.name ?? "").trim();
    const rawIdentifier = String(body.identifier ?? body.email ?? body.phone ?? "").trim();
    const password = String(body.password ?? "");
    const birthDateRaw = body.birthDate;
    const healthAccepted = Boolean(body.healthAccepted);
    const requestedMethod: AuthMethod | undefined =
      body.primaryMethod === "PHONE" || body.primaryMethod === "GMAIL"
        ? body.primaryMethod
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

    const parsedBirthDate = birthDateRaw ? new Date(birthDateRaw) : new Date("2000-01-01");
    if (Number.isNaN(parsedBirthDate.getTime())) {
      return NextResponse.json({ error: "Date de naissance invalide." }, { status: 400 });
    }

    const isEmail = rawIdentifier.includes("@");
    const primaryMethod: AuthMethod = requestedMethod ?? (isEmail ? "GMAIL" : "PHONE");

    const normalizedEmail = isEmail ? rawIdentifier.toLowerCase() : null;
    const normalizedPhone = !isEmail ? rawIdentifier.replace(/\s+/g, "") : null;

    if (primaryMethod === "GMAIL" && !normalizedEmail) {
      return NextResponse.json({ error: "Adresse Gmail invalide." }, { status: 400 });
    }

    if (primaryMethod === "PHONE" && !normalizedPhone) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet identifiant." },
        { status: 409 }
      );
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;

    const user = await prisma.user.create({
      data: {
        firstName,
        email: normalizedEmail,
        emailVerified: false,
        phone: normalizedPhone,
        phoneVerified: false,
        passwordHash,
        birthDate: parsedBirthDate,
        healthAccepted: true,
        healthAcceptedAt: new Date(),
        primaryMethod,
      },
    });

    const code = generateSixDigitCode();
    const target = primaryMethod === "GMAIL" ? normalizedEmail! : normalizedPhone!;
    const channel: DeliveryChannel = primaryMethod === "GMAIL" ? "EMAIL" : "SMS";

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        target,
        channel,
        purpose: VerificationPurpose.REGISTER_PRIMARY,
        codeHash: hashValue(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // L'envoi réel (Brevo / SMS) sera branché à la Catégorie 2
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
      
