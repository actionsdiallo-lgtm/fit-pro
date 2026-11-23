import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const OTP_TTL_MS = 10 * 60 * 1000;
const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function generateSixDigitCode(): string {
  const num = crypto.randomInt(0, 1000000);
  return String(num).padStart(6, "0");
}

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function parseSender(rawFrom: string | undefined): { name: string; email: string } {
  const fallbackEmail = "actionsdiallo@gmail.com";
  const fallbackName = "FIT PRO";

  if (!rawFrom || !rawFrom.trim()) {
    return { name: fallbackName, email: fallbackEmail };
  }

  const trimmed = rawFrom.trim();
  const match = trimmed.match(/^(.*)<([^>]+)>$/);
  if (match) {
    const parsedName = match[1].trim().replace(/^"|"$/g, "") || fallbackName;
    const parsedEmail = match[2].trim();
    return { name: parsedName, email: parsedEmail || fallbackEmail };
  }

  return { name: fallbackName, email: trimmed };
}

async function sendBrevoResetEmail(params: {
  toEmail: string;
  userName?: string | null;
  otpCode: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "BREVO_API_KEY is missing" };
  }

  const sender = parseSender(process.env.EMAIL_FROM);
  const greeting = params.userName ? `Bonjour ${params.userName},` : "Bonjour,";

  const response = await fetch(BREVO_EMAIL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      to: [{ email: params.toEmail }],
      subject: "FIT PRO — Votre code de vérification (valable 10 minutes)",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2>FIT PRO — Code de réinitialisation</h2>
          <p>${greeting}</p>
          <p>Voici votre code de vérification à 6 chiffres pour réinitialiser le mot de passe de votre compte <strong>${params.toEmail}</strong> :</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">${params.otpCode}</p>
          <p>Ce code est valable pendant 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    return { ok: false, error: `Brevo error (${response.status}): ${details}` };
  }

  return { ok: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Veuillez saisir une adresse e-mail valide." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    // Réponse neutre si l'adresse n'existe pas pour éviter l'énumération de comptes
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si un compte existe avec cette adresse, un code a été envoyé.",
      });
    }

    const otpCode = generateSixDigitCode();
    const tokenHash = hashCode(otpCode);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: expiresAt,
      },
    });

    const mailResult = await sendBrevoResetEmail({
      toEmail: user.email,
      userName: user.name,
      otpCode,
    });

    if (!mailResult.ok) {
      console.error("Forgot-password Brevo send failed:", mailResult.error);
      return NextResponse.json(
        { error: "Impossible d'envoyer l'e-mail de vérification pour le moment." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code de vérification envoyé par e-mail.",
    });
  } catch (error) {
    console.error("Forgot-password route error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la demande de réinitialisation." },
      { status: 500 }
    );
  }
    }
