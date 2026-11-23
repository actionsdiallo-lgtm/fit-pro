import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, VerificationPurpose } from "@prisma/client";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function hashCode(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawTarget = String(
      body.identifier ?? body.email ?? body.phone ?? ""
    ).trim();
    const code = String(body.code ?? "").trim();

    if (!rawTarget || !code) {
      return NextResponse.json(
        { error: "Identifiant et code de vérification requis." },
        { status: 400 }
      );
    }

    const normalizedTarget = rawTarget.includes("@")
      ? rawTarget.toLowerCase()
      : rawTarget.replace(/\s+/g, "");

    const verification = await prisma.verificationCode.findFirst({
      where: {
        target: normalizedTarget,
        purpose: VerificationPurpose.PASSWORD_RESET,
        consumedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Aucun code actif trouvé pour cet identifiant." },
        { status: 400 }
      );
    }

    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Ce code a expiré. Demande un nouveau code." },
        { status: 400 }
      );
    }

    if (verification.codeHash !== hashCode(code)) {
      return NextResponse.json(
        { error: "Code de vérification incorrect." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      message: "Code vérifié avec succès.",
    });
  } catch (error) {
    console.error("Verify reset code error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la vérification du code." },
      { status: 500 }
    );
  }
}
