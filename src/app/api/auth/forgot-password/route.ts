import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawIdentifier = String(body?.email ?? body?.identifier ?? "")
      .trim()
      .toLowerCase();

    if (!rawIdentifier || !rawIdentifier.includes("@")) {
      return NextResponse.json(
        { error: "Veuillez saisir une adresse e-mail valide." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: rawIdentifier },
      select: { id: true, email: true, firstName: true },
    });

    if (!user?.email) {
      return NextResponse.json(
        { error: "Aucun compte trouvé avec cette adresse e-mail." },
        { status: 404 }
      );
    }

    const code = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        email: user.email,
        code,
        expiresAt,
      },
    });

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_FROM || "no-reply@fitpro.app";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Service d'envoi d'e-mail non configuré." },
        { status: 500 }
      );
    }

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "FIT PRO", email: senderEmail },
        to: [{ email: user.email, name: user.firstName || "Utilisateur" }],
        subject: "FIT PRO — Code de récupération à 6 chiffres",
        htmlContent: `<p>Bonjour ${user.firstName || ""},</p><p>Votre code de vérification à 6 chiffres est : <strong>${code}</strong>. Il est valable 10 minutes.</p>`,
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error("Brevo error:", errText);
      return NextResponse.json(
        { error: "Erreur serveur lors de l'envoi du code par e-mail." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code de vérification à 6 chiffres envoyé.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la demande de récupération." },
      { status: 500 }
    );
  }
}
  
