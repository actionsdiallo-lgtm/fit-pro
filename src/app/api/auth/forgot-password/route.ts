import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const OTP_TTL_MS = 10 * 60 * 1000;

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function getOtpSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.RESEND_API_KEY ||
    "fitpro-otp-fallback-secret"
  );
}

function hashOtp(email: string, code: string): string {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`${email}:${code}`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = normalizeEmail(body?.email);

    if (!email) {
      return NextResponse.json(
        { error: "Veuillez saisir votre adresse e-mail." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;

    if (!apiKey || !fromEmail) {
      console.error("Configuration e-mail manquante: RESEND_API_KEY ou EMAIL_FROM");
      return NextResponse.json(
        {
          error:
            "Service d'envoi d'e-mails indisponible (RESEND_API_KEY ou EMAIL_FROM manquant).",
        },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun compte FIT PRO n'est associé à cette adresse e-mail." },
        { status: 404 }
      );
    }

    const otpCode = String(crypto.randomInt(100000, 1000000));
    const otpHash = hashOtp(user.email.toLowerCase(), otpCode);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: otpHash,
        resetPasswordExpires: expiresAt,
      },
    });

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [user.email],
        subject: "Votre code de vérification FIT PRO (valable 10 minutes)",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827; max-width: 480px;">
            <h2 style="margin-bottom: 8px;">FIT PRO — Code de vérification</h2>
            <p>Voici votre code à 6 chiffres pour réinitialiser le mot de passe de <strong>${user.email}</strong> :</p>
            <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 14px 20px; background: #f3f4f6; border-radius: 8px; text-align: center; margin: 16px 0;">
              ${otpCode}
            </div>
            <p>Ce code expire dans <strong>10 minutes</strong> et est à usage unique.</p>
            <p>Votre compte ainsi que toutes vos données (profil, entraînements, nutrition, progrès, historique, paramètres et abonnement) restent intactes.</p>
          </div>
        `,
      }),
    });

    const resendData = await resendRes.json().catch(() => null);

    if (!resendRes.ok || !resendData?.id) {
      console.error("Échec envoi OTP:", {
        status: resendRes.status,
        to: user.email,
        from: fromEmail,
        response: resendData,
      });
      return NextResponse.json(
        {
          error:
            "L'envoi du code par e-mail a échoué. Veuillez réessayer dans un instant.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Un code à 6 chiffres a été envoyé à ${user.email} (valable 10 minutes).`,
    });
  } catch (err) {
    console.error("Erreur /api/auth/forgot-password:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi du code." },
      { status: 500 }
    );
  }
      }
          
