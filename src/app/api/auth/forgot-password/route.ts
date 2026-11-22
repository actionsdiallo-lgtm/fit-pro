import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getAppUrl(req: NextRequest): string {
  const configured =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  const origin = req.headers.get("origin")?.trim();
  if (origin) {
    return origin.replace(/\/+$/, "");
  }
  return `https://${req.headers.get("host") ?? "fit-pro-vert.vercel.app"}`;
}

async function sendResetEmail(params: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquante");
  }

  const from =
    process.env.EMAIL_FROM?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    "FIT PRO <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: "FIT PRO — Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2>Réinitialisation de mot de passe — FIT PRO</h2>
          <p>Vous avez demandé à réinitialiser le mot de passe de votre compte FIT PRO.</p>
          <p>
            <a href="${params.resetUrl}" style="display:inline-block;padding:12px 20px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
              Choisir un nouveau mot de passe
            </a>
          </p>
          <p>Ce lien est valable 1 heure et à usage unique. Votre compte, votre historique et vos progressions restent intacts.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Échec d'envoi Resend (${response.status}): ${errorText}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Veuillez saisir une adresse e-mail valide." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: { id: true, email: true },
    });

    if (!user || !user.email) {
      return NextResponse.json({
        ok: true,
        message:
          "Si un compte est associé à cette adresse, un lien de réinitialisation a été envoyé.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: expiresAt,
      },
    });

    const appUrl = getAppUrl(req);
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(
      rawToken
    )}`;

    await sendResetEmail({
      to: user.email,
      resetUrl,
    });

    return NextResponse.json({
      ok: true,
      message:
        "Un lien de réinitialisation sécurisé vient d'être envoyé dans votre boîte Gmail.",
    });
  } catch (err) {
    console.error("Erreur /api/auth/forgot-password:", err);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'e-mail de réinitialisation pour le moment." },
      { status: 500 }
    );
  }
           }
      
