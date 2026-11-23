import { NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  DeliveryChannel,
  VerificationPurpose,
} from "@prisma/client";
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

    const method = String(body.method ?? "").toUpperCase();
    const rawTarget = String(
      body.identifier ?? body.email ?? body.phone ?? ""
    ).trim();

    if (!rawTarget) {
      return NextResponse.json(
        { error: "Merci d'indiquer ton Gmail ou ton numéro de téléphone." },
        { status: 400 }
      );
    }

    const emailMode =
      method === "GMAIL" || (method !== "PHONE" && rawTarget.includes("@"));
    const normalizedEmail = emailMode ? rawTarget.toLowerCase() : null;
    const normalizedPhone = !emailMode ? rawTarget.replace(/\s+/g, "") : null;

    const user = emailMode
      ? await prisma.user.findUnique({
          where: { email: normalizedEmail! },
          select: { id: true, email: true, phone: true },
        })
      : await prisma.user.findUnique({
          where: { phone: normalizedPhone! },
          select: { id: true, email: true, phone: true },
        });

    if (!user) {
      return NextResponse.json({
        message: "Si ce compte existe, tu vas recevoir un code.",
      });
    }

    const code = generateCode();
    const target = emailMode ? normalizedEmail! : normalizedPhone!;
    const channel: DeliveryChannel = emailMode
      ? DeliveryChannel.EMAIL
      : DeliveryChannel.SMS;

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        target,
        channel,
        purpose: VerificationPurpose.PASSWORD_RESET,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({
      message: "Si ce compte existe, tu vas recevoir un code.",
      ...(process.env.NODE_ENV !== "production" ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("Resend reset code error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du renvoi du code." },
      { status: 500 }
    );
  }
          }
